import { useState } from 'react';
import { X, Mail, Link as LinkIcon, Check, Loader, UserPlus } from 'lucide-react';
import { addTripMember } from '../services/tripService';
import { sendTripInvitation } from '../services/emailService';
import { useAuth } from '../contexts/AuthContext';
import type { Trip } from '../types/trip';
import './InviteMembersModal.css';

interface InviteMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  trip: Trip;
}

export default function InviteMembersModal({
  isOpen,
  onClose,
  onSuccess,
  trip,
}: InviteMembersModalProps) {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/trip/${trip.id}`;

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if member already exists
    if (trip.members.some((m) => m.email === email)) {
      setError('This person is already a member of this trip');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Add as pending member in Firebase
      await addTripMember(trip.id, {
        userId: `pending-${Date.now()}`, // Temporary ID until they accept
        email,
        displayName: email.split('@')[0],
        role: 'member',
        joinedAt: new Date(),
        status: 'pending',
      });

      // Send actual email invitation
      await sendTripInvitation({
        toEmail: email,
        toName: email.split('@')[0],
        fromName: currentUser?.displayName || currentUser?.email || 'Someone',
        tripName: trip.name,
        tripLink: shareUrl,
        message: `Join us for ${trip.destination ? `our trip to ${trip.destination}` : 'this exciting trip'}!`,
      });

      setSuccess(`Invitation sent to ${email}!`);
      setEmail('');
      onSuccess();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <UserPlus size={24} />
            Invite Members
          </h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="invite-content">
          <p className="invite-description">
            Invite friends and family to collaborate on {trip.destination ? `your trip to ${trip.destination}` : 'planning this trip'}
          </p>

          <form onSubmit={handleInvite} className="invite-form">
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Email Address
              </label>
              <div className="invite-input-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="spinner" />
                      Sending...
                    </>
                  ) : (
                    'Send Invite'
                  )}
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
            </div>
          </form>

          <div className="invite-divider">
            <span>or</span>
          </div>

          <div className="share-link-section">
            <label className="form-label">
              <LinkIcon size={16} />
              Share Link
            </label>
            <p className="share-link-description">
              Anyone with this link can view and join your trip
            </p>
            <div className="share-link-box">
              <input
                type="text"
                className="share-link-input"
                value={shareUrl}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                className="btn btn-secondary"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <LinkIcon size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="current-members">
            <h3>Current Members ({trip.members.length})</h3>
            <div className="members-list">
              {trip.members.map((member) => (
                <div key={member.userId} className="member-item">
                  <div className="member-avatar-small">
                    {member.displayName?.[0]?.toUpperCase() || member.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="member-details">
                    <span className="member-name-small">
                      {member.displayName || member.email || 'User'}
                    </span>
                    <span className={`member-badge ${member.status}`}>
                      {member.role}
                      {member.status === 'pending' && ' (pending)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
