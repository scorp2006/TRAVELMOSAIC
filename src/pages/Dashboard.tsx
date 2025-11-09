import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plane, Wallet, Activity, LogOut, Plus, MapPin, Sparkles } from 'lucide-react';
import { getUserTrips } from '../services/tripService';
import CreateTripModal from '../components/CreateTripModal';
import AITripPlannerModal from '../components/AITripPlannerModal';
import type { Trip } from '../types/trip';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIPlannerModal, setShowAIPlannerModal] = useState(false);

  useEffect(() => {
    loadTrips();
  }, [currentUser]);

  async function loadTrips() {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userTrips = await getUserTrips(currentUser.uid);
      setTrips(userTrips);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="dashboard-page">
      {/* Glass Navigation */}
      <nav className="glass-nav">
        <Link to="/dashboard" className="nav-logo">
          <span className="logo-text">TRIPMOSAIC</span>
        </Link>
        <div className="nav-user">
          <span className="user-name">
            {currentUser?.displayName || currentUser?.email}
          </span>
          <button onClick={handleLogout} className="btn btn-glass">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="dashboard-container">
        <div className="container">
          <section className="dashboard-header">
            <h1>Welcome Back, {currentUser?.displayName?.split(' ')[0] || 'Traveler'}!</h1>
            <p>Ready to plan your next adventure?</p>
          </section>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card glass-card">
              <div className="stat-value">{trips.length}</div>
              <div className="stat-label">Total Trips</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-value">{trips.filter(t => t.status === 'planning' || t.status === 'upcoming').length}</div>
              <div className="stat-label">Active Trips</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-value">${trips.reduce((sum, t) => sum + t.budget, 0).toLocaleString()}</div>
              <div className="stat-label">Total Budget</div>
            </div>
          </div>

          {/* My Trips Section */}
          <section className="my-trips-section">
            <div className="section-header">
              <h2>My Trips</h2>
              <div className="section-actions">
                <button className="btn btn-glass" onClick={() => setShowAIPlannerModal(true)}>
                  <Sparkles size={20} />
                  AI Trip Planner
                </button>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                  <Plus size={20} />
                  Create New Trip
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state glass-card">
                <p>Loading trips...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="empty-state glass-card">
                <div className="empty-icon">
                  <Plane size={64} strokeWidth={1.5} />
                </div>
                <h3>No trips yet</h3>
                <p>
                  Start planning your first trip and invite friends to collaborate
                </p>
                <div className="empty-actions">
                  <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    Create Your First Trip
                  </button>
                </div>
              </div>
            ) : (
              <div className="trips-grid">
                {trips.map((trip) => (
                  <Link to={`/trip/${trip.id}`} key={trip.id} className="trip-card glass-card">
                    <div className="trip-card-header">
                      <h3>{trip.name}</h3>
                      <span className={`trip-status status-${trip.status}`}>{trip.status}</span>
                    </div>
                    <p className="trip-destination">
                      <MapPin size={16} /> {trip.destination || 'Destination not set'}
                    </p>
                    <p className="trip-dates">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                    <div className="trip-card-footer">
                      <span className="trip-budget">{trip.currency} ${trip.budget.toLocaleString()}</span>
                      <span className="trip-members">{trip.members.length} member{trip.members.length !== 1 ? 's' : ''}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Pending Balances - Empty State */}
          <section className="balances-section">
            <h2>Pending Balances</h2>
            <div className="empty-state glass-card">
              <div className="empty-icon">
                <Wallet size={64} strokeWidth={1.5} />
              </div>
              <h3>No pending balances</h3>
              <p>Your expense tracking will appear here</p>
            </div>
          </section>

          {/* Recent Activity - Empty State */}
          <section className="activity-section">
            <h2>Recent Activity</h2>
            <div className="empty-state glass-card">
              <div className="empty-icon">
                <Activity size={64} strokeWidth={1.5} />
              </div>
              <h3>No activity yet</h3>
              <p>Your trip updates will show up here</p>
            </div>
          </section>
        </div>
      </div>

      <CreateTripModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadTrips}
      />

      <AITripPlannerModal
        isOpen={showAIPlannerModal}
        onClose={() => setShowAIPlannerModal(false)}
      />
    </div>
  );
}
