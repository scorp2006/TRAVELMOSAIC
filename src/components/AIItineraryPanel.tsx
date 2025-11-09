import { useState } from 'react';
import { Sparkles, X, Plus, Loader, MapPin, Clock, DollarSign, Lightbulb } from 'lucide-react';
import { generateItinerary } from '../services/aiService';
import { createActivity } from '../services/tripService';
import { useAuth } from '../contexts/AuthContext';
import type { Trip } from '../types/trip';
import type { AISuggestion, GeneratedItinerary } from '../types/ai';
import './AIItineraryPanel.css';

interface AIItineraryPanelProps {
  trip: Trip;
  onActivityAdded: () => void;
}

export default function AIItineraryPanel({ trip, onActivityAdded }: AIItineraryPanelProps) {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);
  const [error, setError] = useState('');
  const [addingActivity, setAddingActivity] = useState<string | null>(null);

  async function handleGenerateItinerary() {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      const itinerary = await generateItinerary({
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        currency: trip.currency,
        travelStyle: 'moderate',
        groupSize: trip.members.length,
      });

      setGeneratedItinerary(itinerary);
      setIsExpanded(true);
    } catch (err: any) {
      setError(err.message || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToTrip(suggestion: AISuggestion) {
    if (!currentUser) return;

    try {
      setAddingActivity(suggestion.id);

      await createActivity(currentUser.uid, trip.id, {
        title: suggestion.title,
        description: suggestion.description,
        location: suggestion.location || trip.destination,
        category: suggestion.category,
        startTime: suggestion.bestTimeToVisit || '',
        endTime: '',
        cost: suggestion.estimatedCost,
        date: trip.startDate,
      });

      onActivityAdded();
    } catch (err) {
      console.error('Failed to add activity:', err);
    } finally {
      setAddingActivity(null);
    }
  }

  if (!isExpanded && !generatedItinerary) {
    return (
      <div className="ai-panel-collapsed">
        <button
          className="btn btn-ai"
          onClick={handleGenerateItinerary}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size={20} className="spinner" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate AI Itinerary
            </>
          )}
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }

  if (!generatedItinerary) return null;

  return (
    <div className={`ai-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <Sparkles size={24} />
          <h2>AI Itinerary Suggestions</h2>
        </div>
        <button
          className="ai-panel-close"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <X size={24} /> : <Sparkles size={24} />}
        </button>
      </div>

      {isExpanded && (
        <div className="ai-panel-content">
          {/* Overview */}
          <div className="ai-overview glass-card">
            <h3>Trip Overview</h3>
            <p>{generatedItinerary.overview}</p>
          </div>

          {/* Budget Breakdown */}
          {generatedItinerary.budgetBreakdown && (
            <div className="ai-budget glass-card">
              <h3>Budget Breakdown</h3>
              <div className="budget-items">
                <div className="budget-item">
                  <span>Accommodation</span>
                  <span className="budget-amount">
                    {trip.currency} {generatedItinerary.budgetBreakdown.accommodation.toFixed(2)}
                  </span>
                </div>
                <div className="budget-item">
                  <span>Food</span>
                  <span className="budget-amount">
                    {trip.currency} {generatedItinerary.budgetBreakdown.food.toFixed(2)}
                  </span>
                </div>
                <div className="budget-item">
                  <span>Activities</span>
                  <span className="budget-amount">
                    {trip.currency} {generatedItinerary.budgetBreakdown.activities.toFixed(2)}
                  </span>
                </div>
                <div className="budget-item">
                  <span>Transport</span>
                  <span className="budget-amount">
                    {trip.currency} {generatedItinerary.budgetBreakdown.transport.toFixed(2)}
                  </span>
                </div>
                <div className="budget-item">
                  <span>Other</span>
                  <span className="budget-amount">
                    {trip.currency} {generatedItinerary.budgetBreakdown.other.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="ai-suggestions">
            <h3>Suggested Activities & Places</h3>
            <div className="suggestions-grid">
              {generatedItinerary.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card glass-card">
                  <div className="suggestion-header">
                    <h4>{suggestion.title}</h4>
                    <span className={`suggestion-category category-${suggestion.category}`}>
                      {suggestion.category}
                    </span>
                  </div>

                  <p className="suggestion-description">{suggestion.description}</p>

                  <div className="suggestion-details">
                    {suggestion.location && (
                      <span className="suggestion-detail">
                        <MapPin size={14} />
                        {suggestion.location}
                      </span>
                    )}
                    {suggestion.duration && (
                      <span className="suggestion-detail">
                        <Clock size={14} />
                        {suggestion.duration}
                      </span>
                    )}
                    {suggestion.estimatedCost !== undefined && (
                      <span className="suggestion-detail">
                        <DollarSign size={14} />
                        {trip.currency} {suggestion.estimatedCost.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {suggestion.bestTimeToVisit && (
                    <p className="suggestion-time">
                      <Clock size={14} />
                      Best time: {suggestion.bestTimeToVisit}
                    </p>
                  )}

                  {suggestion.tips && suggestion.tips.length > 0 && (
                    <div className="suggestion-tips">
                      <p className="tips-label">
                        <Lightbulb size={14} />
                        Tips:
                      </p>
                      <ul>
                        {suggestion.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToTrip(suggestion)}
                    disabled={addingActivity === suggestion.id}
                  >
                    {addingActivity === suggestion.id ? (
                      <>
                        <Loader size={16} className="spinner" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add to Trip
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* General Tips */}
          {generatedItinerary.tips && generatedItinerary.tips.length > 0 && (
            <div className="ai-tips glass-card">
              <h3>
                <Lightbulb size={20} />
                Travel Tips
              </h3>
              <ul>
                {generatedItinerary.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="btn btn-secondary"
            onClick={handleGenerateItinerary}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={20} className="spinner" />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Regenerate Itinerary
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
