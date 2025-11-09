import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, MapPin, DollarSign, Calendar, Users, Hotel, Car, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createTrip, createActivity } from '../services/tripService';
import { Timestamp } from 'firebase/firestore';
import './AIGeneratedTrip.css';

interface GeneratedTrip {
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

export default function AIGeneratedTrip() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tripData, setTripData] = useState<GeneratedTrip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get trip data from navigation state
    if (location.state?.tripData) {
      setTripData(location.state.tripData);
    } else {
      // Redirect back if no data
      navigate('/dashboard');
    }
  }, [location, navigate]);

  async function handleCreateTrip() {
    if (!currentUser || !tripData) return;

    try {
      setLoading(true);
      setError('');

      // Build comprehensive description with hotels and transportation
      let fullDescription = `${tripData.recommendations}\n\n`;

      if (tripData.hotels && tripData.hotels.length > 0) {
        fullDescription += `🏨 RECOMMENDED HOTELS:\n`;
        tripData.hotels.forEach(hotel => {
          fullDescription += `• ${hotel.name} (${hotel.type}) - $${hotel.pricePerNight}/night\n  ${hotel.description}\n`;
        });
        fullDescription += '\n';
      }

      if (tripData.transportation && tripData.transportation.length > 0) {
        fullDescription += `🚗 TRANSPORTATION OPTIONS:\n`;
        tripData.transportation.forEach(transport => {
          fullDescription += `• ${transport.type} - $${transport.estimatedCost}\n  ${transport.description}\n`;
        });
      }

      // Create the trip first
      const tripId = await createTrip(
        currentUser.uid,
        {
          name: `AI Trip to ${tripData.destination}`,
          destination: tripData.destination,
          startDate: Timestamp.fromDate(new Date(tripData.startDate)),
          endDate: Timestamp.fromDate(new Date(tripData.endDate)),
          budget: tripData.estimatedTotal,
          description: fullDescription,
        },
        currentUser.email || undefined,
        currentUser.displayName || undefined
      );

      // Save all AI-generated activities to Firebase
      const startDate = new Date(tripData.startDate);

      for (const activity of tripData.activities) {
        // Calculate the date for this activity
        const activityDate = new Date(startDate);
        activityDate.setDate(startDate.getDate() + (activity.day - 1));

        await createActivity(currentUser.uid, {
          tripId,
          title: activity.title,
          description: activity.description,
          date: Timestamp.fromDate(activityDate),
          location: tripData.destination,
          category: 'sightseeing',
          order: activity.day,
        });
      }

      // Navigate to the trip detail page
      navigate(`/trip/${tripId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  }

  if (!tripData) {
    return <div className="loading-page">Loading...</div>;
  }

  // Get destination image - using Picsum for reliable placeholder
  const destinationImage = `https://picsum.photos/seed/${encodeURIComponent(tripData.destination)}/1600/900`;

  return (
    <div className="ai-trip-page">
      {/* Hero Section with Destination Image */}
      <div className="trip-hero" style={{ backgroundImage: `url(${destinationImage})` }}>
        <div className="hero-overlay">
          <div className="container">
            <button onClick={() => navigate('/dashboard')} className="back-button">
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="hero-content">
              <div className="ai-badge">
                <Sparkles size={20} />
                <span>AI Generated Trip</span>
              </div>
              <h1 className="trip-title">{tripData.destination} Adventure</h1>
              <div className="trip-meta">
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{tripData.days} Days</span>
                </div>
                <div className="meta-item">
                  <Users size={18} />
                  <span>{tripData.travelers} Traveler{tripData.travelers > 1 ? 's' : ''}</span>
                </div>
                <div className="meta-item">
                  <DollarSign size={18} />
                  <span>${tripData.estimatedTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container trip-container">
        {error && <div className="error-banner">{error}</div>}

        {/* Cost Breakdown */}
        <section className="cost-section glass-card">
          <h2>Cost Breakdown</h2>
          <div className="cost-grid">
            <div className="cost-item">
              <span className="cost-label">Flights</span>
              <span className="cost-value">${tripData.flightPrice.toLocaleString()}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Accommodation</span>
              <span className="cost-value">${tripData.hotelPrice.toLocaleString()}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Activities</span>
              <span className="cost-value">
                ${tripData.activities.reduce((sum, a) => sum + a.estimatedCost, 0).toLocaleString()}
              </span>
            </div>
            <div className="cost-item total">
              <span className="cost-label">Total Estimated</span>
              <span className="cost-value">${tripData.estimatedTotal.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Daily Itinerary */}
        <section className="itinerary-section">
          <h2>Your Day-by-Day Itinerary</h2>
          <div className="itinerary-timeline">
            {tripData.activities.map((activity, index) => (
              <div key={index} className="timeline-item glass-card">
                <div className="timeline-marker">
                  <div className="day-badge">Day {activity.day}</div>
                </div>
                <div className="timeline-content">
                  <div className="activity-header">
                    <h3>{activity.title}</h3>
                    <span className="activity-cost">${activity.estimatedCost}</span>
                  </div>
                  <p className="activity-desc">{activity.description}</p>
                  <div className="activity-image">
                    <img
                      src={`https://picsum.photos/seed/${encodeURIComponent(activity.title + tripData.destination + activity.day)}/800/400`}
                      alt={activity.title}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Hotels */}
        {tripData.hotels && tripData.hotels.length > 0 && (
          <section className="hotels-section">
            <h2>
              <Hotel size={24} />
              Recommended Accommodations
            </h2>
            <div className="hotels-grid">
              {tripData.hotels.map((hotel, index) => (
                <div key={index} className="hotel-card glass-card">
                  <div className="hotel-image">
                    <img
                      src={`https://picsum.photos/seed/${encodeURIComponent(hotel.name + hotel.type + tripData.destination)}/600/400`}
                      alt={hotel.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="hotel-content">
                    <h3>{hotel.name}</h3>
                    <span className="hotel-type">{hotel.type}</span>
                    <p>{hotel.description}</p>
                    <div className="hotel-price">
                      <span className="price-label">From</span>
                      <span className="price-value">${hotel.pricePerNight}/night</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transportation Options */}
        {tripData.transportation && tripData.transportation.length > 0 && (
          <section className="transport-section">
            <h2>
              <Car size={24} />
              Getting Around
            </h2>
            <div className="transport-grid">
              {tripData.transportation.map((transport, index) => (
                <div key={index} className="transport-card glass-card">
                  <h3>{transport.type}</h3>
                  <p>{transport.description}</p>
                  <span className="transport-cost">${transport.estimatedCost}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Travel Tips */}
        <section className="recommendations-section glass-card">
          <h2>
            <CheckCircle size={24} />
            Travel Tips & Recommendations
          </h2>
          <p className="recommendations-text">{tripData.recommendations}</p>
        </section>

        {/* Create Trip Button */}
        <div className="create-trip-section">
          <button
            onClick={handleCreateTrip}
            className="btn btn-primary btn-large create-trip-btn"
            disabled={loading}
          >
            {loading ? (
              'Saving trip and activities to your dashboard...'
            ) : (
              <>
                <Sparkles size={20} />
                Create This Trip
              </>
            )}
          </button>
          <p className="create-hint">
            Save this trip to your dashboard and start planning with friends
          </p>
        </div>
      </div>
    </div>
  );
}
