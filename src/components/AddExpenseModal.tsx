import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createExpense, splitExpenseEqually } from '../services/expenseService';
import type { TripMember } from '../types/trip';
import type { CreateExpenseData } from '../types/expense';
import './AddExpenseModal.css';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tripId: string;
  members: TripMember[];
  currency: string;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSuccess,
  tripId,
  members,
  currency
}: AddExpenseModalProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Omit<CreateExpenseData, 'splitAmong'>>({
    title: '',
    amount: 0,
    currency: currency,
    category: 'food',
    date: new Date(),
    paidBy: currentUser?.uid || '',
    paidByName: currentUser?.displayName || currentUser?.email || '',
    description: '',
    splitType: 'equal',
  });

  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    members.map(m => m.userId)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in');
      return;
    }

    if (!formData.title || formData.amount <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Please select at least one person to split with');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Get selected members data
      const selectedMembersData = members
        .filter(m => selectedMembers.includes(m.userId))
        .map(m => ({
          userId: m.userId,
          userName: m.displayName || m.email
        }));

      // Calculate splits
      const splits = formData.splitType === 'equal'
        ? splitExpenseEqually(formData.amount, selectedMembersData)
        : selectedMembersData.map(m => ({
            userId: m.userId,
            userName: m.userName,
            amount: formData.amount / selectedMembers.length,
            paid: false
          }));

      const expenseData: CreateExpenseData = {
        ...formData,
        splitAmong: splits,
      };

      await createExpense(currentUser.uid, tripId, expenseData);

      // Reset form
      setFormData({
        title: '',
        amount: 0,
        currency: currency,
        category: 'food',
        date: new Date(),
        paidBy: currentUser.uid,
        paidByName: currentUser.displayName || currentUser.email || '',
        description: '',
        splitType: 'equal',
      });
      setSelectedMembers(members.map(m => m.userId));

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
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

  function toggleMember(userId: string) {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Expense</h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label className="form-label">What did you pay for? *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Dinner at restaurant"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Amount *</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="food">Food</option>
                <option value="accommodation">Accommodation</option>
                <option value="transport">Transport</option>
                <option value="activity">Activity</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
            </div>
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
              <label className="form-label">Paid By</label>
              <select
                className="form-input"
                value={formData.paidBy}
                onChange={(e) => {
                  const member = members.find(m => m.userId === e.target.value);
                  handleChange('paidBy', e.target.value);
                  handleChange('paidByName', member?.displayName || member?.email || '');
                }}
              >
                {members.map(member => (
                  <option key={member.userId} value={member.userId}>
                    {member.displayName || member.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Split With</label>
            <div className="member-checkboxes">
              {members.map(member => (
                <label key={member.userId} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.userId)}
                    onChange={() => toggleMember(member.userId)}
                  />
                  <span>{member.displayName || member.email}</span>
                  {selectedMembers.includes(member.userId) && (
                    <span className="split-amount">
                      {currency} {(formData.amount / selectedMembers.length).toFixed(2)}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Add some notes..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
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
              {loading ? 'Adding...' : `Add ${currency} ${formData.amount.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
