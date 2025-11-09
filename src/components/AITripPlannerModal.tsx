import { useState } from 'react';
import { X, Sparkles, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { model } from '../config/gemini';
import { searchFlights, searchHotels, searchHotelOffers, getCityCode } from '../services/amadeusService';
import './AITripPlannerModal.css';

interface AITripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TripPlanFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budgetMin: number;
  budgetMax: number;
  interests: string[];
}

interface GeneratedItinerary {
  destination: string;
  days: number;
  travelers: number;
  startDate: string;
  endDate: string;
  budget: number;
  flightPrice: number;
  hotelPrice: number;
  estimatedTotal: number;
  activities: Array<{
    day: number;
    title: string;
    description: string;
    estimatedCost: number;
  }>;
  hotels: Array<{
    name: string;
    type: string;
    pricePerNight: number;
    description: string;
  }>;
  transportation: Array<{
    type: string;
    description: string;
    estimatedCost: number;
  }>;
  recommendations: string;
}

const INTEREST_OPTIONS = [
  'Culture & Museums',
  'Food & Dining',
  'Adventure & Sports',
  'Nature & Wildlife',
  'Shopping',
  'Nightlife',
  'History',
  'Beach & Relaxation',
];

export default function AITripPlannerModal({ isOpen, onClose }: AITripPlannerModalProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);

  const [formData, setFormData] = useState<TripPlanFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budgetMin: 500,
    budgetMax: 2000,
    interests: [],
  });

  function handleChange(field: keyof TripPlanFormData, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function toggleInterest(interest: string) {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  async function generateItinerary() {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      // Calculate trip duration
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      // Get city code for Amadeus API
      const cityCode = getCityCode(formData.destination);

      // Fetch real prices from Amadeus API (with fallback to estimates)
      let flightPrice = 0;
      let hotelPrice = 0;

      try {
        // Search flights (assuming departure from user's location - NYC for demo)
        const flights = await searchFlights(
          'NYC',
          cityCode,
          formData.startDate,
          formData.travelers
        );

        if (flights && flights.length > 0) {
          flightPrice = parseFloat(flights[0].price.total) * formData.travelers;
        } else {
          // Fallback estimate
          flightPrice = 400 * formData.travelers;
        }
      } catch (err) {
        console.error('Flight search error:', err);
        flightPrice = 400 * formData.travelers; // Fallback
      }

      try {
        // Search hotels
        const hotels = await searchHotels(cityCode);

        if (hotels && hotels.length > 0) {
          const hotelIds = hotels.slice(0, 5).map((h: any) => h.hotelId);
          const hotelOffers = await searchHotelOffers(
            hotelIds,
            formData.startDate,
            formData.endDate,
            formData.travelers
          );

          if (hotelOffers && hotelOffers.length > 0) {
            const offer = hotelOffers[0].offers?.[0];
            if (offer && offer.price) {
              hotelPrice = parseFloat(offer.price.total);
            } else {
              hotelPrice = 100 * days; // Fallback per night rate
            }
          } else {
            hotelPrice = 100 * days; // Fallback
          }
        } else {
          hotelPrice = 100 * days; // Fallback
        }
      } catch (err) {
        console.error('Hotel search error:', err);
        hotelPrice = 100 * days; // Fallback
      }

      // Use REAL Gemini AI to generate itinerary with hotels and transportation
      const prompt = `You are a professional travel planner. Create a detailed ${days}-day travel itinerary for ${formData.destination} for ${formData.travelers} traveler(s).

Trip Details:
- Destination: ${formData.destination}
- Duration: ${days} days
- Travelers: ${formData.travelers}
- Budget Range: $${formData.budgetMin} - $${formData.budgetMax}
- Interests: ${formData.interests.join(', ') || 'General sightseeing'}
- Estimated Flight Cost: $${flightPrice}
- Estimated Hotel Cost: $${hotelPrice}

Please provide:
1. Day-by-day activities (2-3 activities per day) with realistic costs
2. 2-3 recommended hotels with different budget levels
3. 2-3 transportation options for getting around
4. Brief travel tips and recommendations

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "activities": [
    {
      "day": 1,
      "title": "Activity name",
      "description": "Brief description of the activity",
      "estimatedCost": 50
    }
  ],
  "hotels": [
    {
      "name": "Hotel name",
      "type": "Budget/Mid-range/Luxury",
      "pricePerNight": 120,
      "description": "Brief description of the hotel and its amenities"
    }
  ],
  "transportation": [
    {
      "type": "Metro/Taxi/Car Rental/etc",
      "description": "How to use it and when it's best",
      "estimatedCost": 50
    }
  ],
  "recommendations": "Brief travel tips and recommendations for this destination"
}`;

      console.log('Calling Gemini AI...');
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      console.log('AI Response:', aiResponse);

      // Parse AI response - extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON format');
      }

      const aiData = JSON.parse(jsonMatch[0]);

      if (!aiData.activities || !Array.isArray(aiData.activities)) {
        throw new Error('AI response missing activities array');
      }

      const activityCosts = aiData.activities.reduce(
        (sum: number, activity: any) => sum + (activity.estimatedCost || 0),
        0
      );

      const itinerary: GeneratedItinerary = {
        destination: formData.destination,
        days,
        travelers: formData.travelers,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budgetMax,
        flightPrice,
        hotelPrice,
        estimatedTotal: flightPrice + hotelPrice + activityCosts,
        activities: aiData.activities,
        hotels: aiData.hotels || [],
        transportation: aiData.transportation || [],
        recommendations: aiData.recommendations,
      };

      // Navigate to full-page view instead of showing in modal
      navigate('/ai-trip-generated', { state: { tripData: itinerary } });
      onClose();
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  function handleNext() {
    if (step === 1) {
      if (!formData.destination || !formData.startDate || !formData.endDate) {
        setError('Please fill in all required fields');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      generateItinerary();
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ai-trip-planner-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <Sparkles size={24} className="sparkle-icon" />
            <h2>AI Trip Planner</h2>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="planner-step">
            <h3>Where are you planning to go?</h3>
            <div className="form-group">
              <label className="form-label">Destination *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Paris, Tokyo, Bali"
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Number of Travelers</label>
              <input
                type="number"
                className="form-input"
                value={formData.travelers}
                onChange={(e) => handleChange('travelers', parseInt(e.target.value) || 1)}
                min="1"
                max="10"
              />
            </div>
          </div>
        )}

        {/* Step 2: Budget & Interests */}
        {step === 2 && (
          <div className="planner-step">
            <h3>Tell us more about your trip</h3>

            <div className="form-group">
              <label className="form-label">Budget Range (USD)</label>
              <div className="budget-inputs">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min"
                  value={formData.budgetMin}
                  onChange={(e) => handleChange('budgetMin', parseInt(e.target.value) || 0)}
                  min="0"
                  step="100"
                />
                <span>to</span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max"
                  value={formData.budgetMax}
                  onChange={(e) => handleChange('budgetMax', parseInt(e.target.value) || 0)}
                  min={formData.budgetMin}
                  step="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">What are you interested in?</label>
              <div className="interests-grid">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className={`interest-chip ${
                      formData.interests.includes(interest) ? 'selected' : ''
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Footer Buttons */}
        <div className="modal-footer">
          {step > 1 && step < 3 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              disabled={loading}
            >
              Back
            </button>
          )}

          {step < 2 && (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              disabled={loading}
            >
              Next
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={16} className="spinner" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Itinerary
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
