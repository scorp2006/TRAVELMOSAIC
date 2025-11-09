import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createActivity } from '../services/tripService';
import './AddActivityModal.css';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tripId: string;
}

export default function AddActivityModal({ isOpen, onClose, onSuccess, tripId }: AddActivityModalProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    location: '',
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
    cost: 0,
    category: 'activity' as 'accommodation' | 'transport' | 'food' | 'activity' | 'other',
    order: 0,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in');
      return;
    }

    if (!formData.title || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setLoading(true);

      await createActivity(currentUser.uid, {
        ...formData,
        tripId,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: new Date(),
        startTime: '',
        endTime: '',
        location: '',
        lat: undefined,
        lng: undefined,
        cost: 0,
        category: 'activity',
        order: 0,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: any) {
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
          <h2>Add Activity</h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <label className="form-label">Activity Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Visit Eiffel Tower"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Eiffel Tower, Paris"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
            <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Enter the location name (e.g., Eiffel Tower, Paris)
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date.toISOString().split('T')[0]}
                onChange={(e) => handleChange('date', new Date(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="activity">Activity</option>
                <option value="accommodation">Accommodation</option>
                <option value="transport">Transport</option>
                <option value="food">Food</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time (Optional)</label>
              <input
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time (Optional)</label>
              <input
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cost (Optional)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.cost}
              onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Add some notes about this activity..."
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
              {loading ? 'Adding...' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
