import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { updateTrip } from '../services/tripService';
import './SetDestinationModal.css';

interface SetDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  currentDestination?: string;
}

export default function SetDestinationModal({
  isOpen,
  onClose,
  tripId,
  currentDestination
}: SetDestinationModalProps) {
  const [destination, setDestination] = useState(currentDestination || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!destination.trim()) {
      setError('Please enter a destination');
      return;
    }

    try {
      setError('');
      setLoading(true);

      await updateTrip(tripId, { destination: destination.trim() });

      setDestination('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update destination');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content set-destination-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <MapPin size={24} />
            Set Trip Destination
          </h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="destination-form">
          <div className="form-group">
            <label className="form-label">Where are you going?</label>
            <input
              type="text"
              className="form-input destination-input"
              placeholder="e.g., Paris, France"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              autoFocus
              required
            />
            <p className="form-hint">
              This will be visible to all trip members and used to discover popular places
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : currentDestination ? 'Update Destination' : 'Set Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
