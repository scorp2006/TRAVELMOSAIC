import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createTrip } from '../services/tripService';
import type { CreateTripData } from '../types/trip';
import './CreateTripModal.css';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTripModal({ isOpen, onClose, onSuccess }: CreateTripModalProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateTripData>({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    budget: 0,
    currency: 'USD',
    description: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to create a trip');
      return;
    }

    // Validation
    if (!formData.name) {
      setError('Please enter a trip name');
      return;
    }

    if (formData.startDate > formData.endDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const tripId = await createTrip(
        currentUser.uid,
        formData,
        currentUser.email || '',
        currentUser.displayName || ''
      );

      // Reset form
      setFormData({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        budget: 0,
        currency: 'USD',
        description: '',
      });

      onSuccess();
      onClose();

      // Navigate to the new trip detail page
      navigate(`/trip/${tripId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof CreateTripData, value: any) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Trip</h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="trip-form">
          <div className="form-group">
            <label className="form-label">Trip Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Summer Europe Adventure"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <p className="form-hint">You can decide the destination with your group after creating the trip</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate.toISOString().split('T')[0]}
                onChange={(e) => handleChange('startDate', new Date(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate.toISOString().split('T')[0]}
                onChange={(e) => handleChange('endDate', new Date(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Budget</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.budget}
                onChange={(e) => handleChange('budget', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Currency</label>
              <select
                className="form-input"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="AUD">AUD</option>
                <option value="CAD">CAD</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Add some notes about this trip..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
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
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
