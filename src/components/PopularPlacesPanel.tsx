import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { Star, MapPin, Clock, DollarSign, Loader, Search, GripVertical } from 'lucide-react';
import { searchPopularPlaces } from '../services/placesService';
import { createActivity } from '../services/tripService';
import { useAuth } from '../contexts/AuthContext';
import type { PopularPlace } from '../types/places';
import type { Trip } from '../types/trip';
import './PopularPlacesPanel.css';

interface PopularPlacesPanelProps {
  trip: Trip;
  onPlaceAdded: () => void;
}

export default function PopularPlacesPanel({ trip, onPlaceAdded }: PopularPlacesPanelProps) {
  const { currentUser } = useAuth();
  const [places, setPlaces] = useState<PopularPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePlace, setActivePlace] = useState<PopularPlace | null>(null);
  const [addingPlaceId, setAddingPlaceId] = useState<string | null>(null);

  useEffect(() => {
    loadPlaces();
  }, [trip.destination]);

  async function loadPlaces() {
    setLoading(true);
    setError('');

    try {
      const result = await searchPopularPlaces({
        destination: trip.destination,
        category: 'all',
        limit: 20,
      });

      setPlaces(result.places);
    } catch (err: any) {
      setError('Failed to load popular places');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPlace(place: PopularPlace) {
    if (!currentUser) return;

    try {
      setAddingPlaceId(place.id);

      await createActivity(currentUser.uid, trip.id, {
        title: place.name,
        description: place.description || '',
        location: place.location.address,
        lat: place.location.lat, // Store coordinates for map display
        lng: place.location.lng,
        category: place.category,
        startTime: place.suggestedDuration || '',
        endTime: '',
        cost: place.priceLevel ? place.priceLevel * 20 : undefined, // Rough estimate
        date: trip.startDate,
      });

      onPlaceAdded();
    } catch (err) {
      console.error('Failed to add place:', err);
    } finally {
      setAddingPlaceId(null);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const place = places.find((p) => p.id === event.active.id);
    setActivePlace(place || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePlace(null);

    if (event.over && event.over.id === 'itinerary-drop-zone') {
      const place = places.find((p) => p.id === event.active.id);
      if (place) {
        handleAddPlace(place);
      }
    }
  }

  function getPriceLevel(level?: number) {
    if (!level) return '';
    return '$'.repeat(level);
  }

  return (
    <div className="popular-places-panel glass-card">
      <div className="places-header">
        <div className="places-title">
          <Search size={20} />
          <h3>Popular Places in {trip.destination}</h3>
        </div>
        <p className="places-subtitle">
          Drag & drop places into your itinerary or click to add
        </p>
      </div>

      {loading ? (
        <div className="places-loading">
          <Loader size={32} className="spinner" />
          <p>Finding popular places...</p>
        </div>
      ) : error ? (
        <div className="places-error">
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={loadPlaces}>
            Try Again
          </button>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="places-grid">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isAdding={addingPlaceId === place.id}
                onAdd={() => handleAddPlace(place)}
              />
            ))}
          </div>

          <DragOverlay>
            {activePlace && (
              <div className="place-card place-card-dragging">
                <div className="place-card-header">
                  <h4>{activePlace.name}</h4>
                  {activePlace.rating && (
                    <div className="place-rating">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>{activePlace.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

interface PlaceCardProps {
  place: PopularPlace;
  isAdding: boolean;
  onAdd: () => void;
}

function PlaceCard({ place, isAdding, onAdd }: PlaceCardProps) {
  return (
    <div
      className="place-card"
      draggable
      data-place-id={place.id}
    >
      {place.photoUrl && (
        <div className="place-image">
          <img src={place.photoUrl} alt={place.name} />
          <div className="place-drag-handle">
            <GripVertical size={20} />
          </div>
        </div>
      )}

      <div className="place-content">
        <div className="place-card-header">
          <h4>{place.name}</h4>
          {place.rating && (
            <div className="place-rating">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {place.description && (
          <p className="place-description">{place.description}</p>
        )}

        <div className="place-meta">
          {place.location.address && (
            <span className="place-meta-item">
              <MapPin size={12} />
              {place.location.address.split(',')[0]}
            </span>
          )}
          {place.suggestedDuration && (
            <span className="place-meta-item">
              <Clock size={12} />
              {place.suggestedDuration}
            </span>
          )}
          {place.priceLevel !== undefined && (
            <span className="place-meta-item">
              <DollarSign size={12} />
              {'$'.repeat(place.priceLevel || 1)}
            </span>
          )}
        </div>

        {place.reviewCount && (
          <p className="place-reviews">{place.reviewCount.toLocaleString()} reviews</p>
        )}

        {place.tags && place.tags.length > 0 && (
          <div className="place-tags">
            {place.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="place-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary btn-sm place-add-btn"
          onClick={onAdd}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Loader size={14} className="spinner" />
              Adding...
            </>
          ) : (
            'Add to Itinerary'
          )}
        </button>
      </div>
    </div>
  );
}
