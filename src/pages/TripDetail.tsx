import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
  Navigation,
  Receipt,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTrip, subscribeToTrip, subscribeToActivities, createActivity, deleteActivity } from '../services/tripService';
import { subscribeToExpenses, calculateExpenseSummary, calculateSettlements } from '../services/expenseService';
import AddActivityModal from '../components/AddActivityModal';
import AddExpenseModal from '../components/AddExpenseModal';
import AIItineraryPanel from '../components/AIItineraryPanel';
import WeatherPackingPanel from '../components/WeatherPackingPanel';
import InviteMembersModal from '../components/InviteMembersModal';
import PopularPlacesPanel from '../components/PopularPlacesPanel';
import SetDestinationModal from '../components/SetDestinationModal';
import type { Trip, Activity } from '../types/trip';
import type { Expense } from '../types/expense';
import './TripDetail.css';

// Google Maps JavaScript API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyC7Zhkf9iMQfyMnpPbSDVnlFzw1_0K6khA';

export default function TripDetail() {
  const { tripId } = useParams<{ tripId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showInviteMembers, setShowInviteMembers] = useState(false);
  const [showSetDestination, setShowSetDestination] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    setLoading(true);

    // Set up real-time listeners
    const unsubscribeTrip = subscribeToTrip(
      tripId,
      (tripData) => {
        setTrip(tripData);
        setLoading(false);
      },
      (error) => console.error('Trip subscription error:', error)
    );

    const unsubscribeActivities = subscribeToActivities(
      tripId,
      (activitiesData) => {
        setActivities(activitiesData);
      },
      (error) => console.error('Activities subscription error:', error)
    );

    const unsubscribeExpenses = subscribeToExpenses(
      tripId,
      (expensesData) => {
        setExpenses(expensesData);
      },
      (error) => console.error('Expenses subscription error:', error)
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeTrip();
      unsubscribeActivities();
      unsubscribeExpenses();
    };
  }, [tripId]);

  // Function to manually refresh (for backward compatibility)
  async function loadTripData() {
    // This is now handled by real-time listeners
    // Kept for backward compatibility with existing code
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getTripDuration(): number {
    if (!trip) return 0;
    const diff = trip.endDate.getTime() - trip.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Calculate map center from activities with coordinates
  const activitiesWithCoords = activities.filter(a => a.lat && a.lng);
  const mapCenter = activitiesWithCoords.length > 0
    ? {
        lat: activitiesWithCoords.reduce((sum, a) => sum + a.lat!, 0) / activitiesWithCoords.length,
        lng: activitiesWithCoords.reduce((sum, a) => sum + a.lng!, 0) / activitiesWithCoords.length,
      }
    : { lat: 20, lng: 0 }; // World view if no coordinates

  const mapZoom = activitiesWithCoords.length > 0 ? 12 : 3;

  if (loading) {
    return (
      <div className="trip-detail-page">
        <div className="loading-container">
          <p>Loading trip...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-detail-page">
        <div className="error-container">
          <p>Trip not found</p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-detail-page">
      {/* Header */}
      <nav className="glass-nav">
        <Link to="/dashboard" className="nav-back">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        <div className="nav-actions">
          <button className="btn btn-glass" onClick={() => setShowInviteMembers(true)}>
            <Users size={20} />
            Invite
          </button>
          <button className="btn btn-glass">
            <Edit size={20} />
            Edit
          </button>
        </div>
      </nav>

      <div className="trip-detail-container">
        <div className="container">
          {/* Trip Header */}
          <section className="trip-header">
            <div className="trip-header-content">
              <h1>{trip.name}</h1>
              <div className="trip-meta">
                {trip.destination ? (
                  <span className="trip-meta-item">
                    <MapPin size={18} />
                    {trip.destination}
                    <button
                      className="btn-link"
                      onClick={() => setShowSetDestination(true)}
                      title="Change destination"
                    >
                      <Edit size={14} />
                    </button>
                  </span>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowSetDestination(true)}
                  >
                    <MapPin size={16} />
                    Set Destination
                  </button>
                )}
                <span className="trip-meta-item">
                  <Calendar size={18} />
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({getTripDuration()} days)
                </span>
                <span className="trip-meta-item">
                  <DollarSign size={18} />
                  {trip.currency} ${trip.budget.toLocaleString()}
                </span>
              </div>
              {trip.description && (
                <p className="trip-description">{trip.description}</p>
              )}
            </div>
            <span className={`trip-status-badge status-${trip.status}`}>
              {trip.status}
            </span>
          </section>

          {/* No Destination Set - Call to Action */}
          {!trip.destination && (
            <div className="destination-cta glass-card">
              <div className="cta-content">
                <MapPin size={48} className="cta-icon" />
                <h3>Where are you going?</h3>
                <p>Set your destination to unlock popular places, weather forecasts, and smart recommendations</p>
                <button className="btn btn-primary" onClick={() => setShowSetDestination(true)}>
                  <MapPin size={18} />
                  Set Destination
                </button>
              </div>
            </div>
          )}

          {/* Popular Places Discovery - Only show when destination is set */}
          {trip.destination && <PopularPlacesPanel trip={trip} onPlaceAdded={loadTripData} />}

          {/* AI Itinerary Panel - Only show when destination is set */}
          {trip.destination && <AIItineraryPanel trip={trip} onActivityAdded={loadTripData} />}

          {/* Weather & Packing Panel - Only show when destination is set */}
          {trip.destination && <WeatherPackingPanel trip={trip} />}

          {/* Map and Itinerary Grid */}
          <div className="trip-content-grid">
            {/* Map Section */}
            <section className="map-section glass-card">
              <div className="section-header">
                <h2>Map</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAddLocation(true)}>
                  <Plus size={16} />
                  Add Location
                </button>
              </div>

              <div className="map-container">
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                  <Map
                    defaultCenter={mapCenter}
                    defaultZoom={mapZoom}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Only render markers for activities with coordinates */}
                    {activities
                      .filter(activity => activity.lat && activity.lng)
                      .map((activity) => (
                        <Marker
                          key={activity.id}
                          position={{ lat: activity.lat!, lng: activity.lng! }}
                          onClick={() => setSelectedActivity(activity)}
                        />
                      ))}

                    {selectedActivity && selectedActivity.lat && selectedActivity.lng && (
                      <InfoWindow
                        position={{ lat: selectedActivity.lat, lng: selectedActivity.lng }}
                        onCloseClick={() => setSelectedActivity(null)}
                      >
                        <div className="map-info-window">
                          <h3>{selectedActivity.title}</h3>
                          <p>{selectedActivity.location}</p>
                          {selectedActivity.cost && (
                            <p className="activity-cost">
                              ${selectedActivity.cost}
                            </p>
                          )}
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              </div>

              {activities.length === 0 && (
                <div className="map-empty-state">
                  <Navigation size={48} />
                  <p>No locations added yet</p>
                  <button className="btn btn-primary" onClick={() => setShowAddLocation(true)}>
                    Add Your First Location
                  </button>
                </div>
              )}
            </section>

            {/* Itinerary Section */}
            <section className="itinerary-section">
              <div className="section-header">
                <h2>Itinerary</h2>
              </div>

              {activities.length === 0 ? (
                <div className="empty-state glass-card">
                  <p>No activities planned yet</p>
                  <button className="btn btn-secondary" onClick={() => setShowAddLocation(true)}>
                    Start Planning
                  </button>
                </div>
              ) : (
                <div className="activities-list">
                  {activities.map((activity) => (
                    <div key={activity.id} className="activity-card glass-card">
                      <div className="activity-header">
                        <h3>{activity.title}</h3>
                        <span className={`activity-category category-${activity.category}`}>
                          {activity.category}
                        </span>
                      </div>

                      {activity.description && (
                        <p className="activity-description">{activity.description}</p>
                      )}

                      <div className="activity-details">
                        {activity.location && (
                          <span className="activity-detail">
                            <MapPin size={14} />
                            {activity.location}
                          </span>
                        )}
                        {activity.startTime && (
                          <span className="activity-detail">
                            <Calendar size={14} />
                            {activity.startTime}
                            {activity.endTime && ` - ${activity.endTime}`}
                          </span>
                        )}
                        {activity.cost && (
                          <span className="activity-detail">
                            <DollarSign size={14} />
                            ${activity.cost}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Members Section */}
          <section className="members-section">
            <div className="section-header">
              <h2>Trip Members ({trip.members.length})</h2>
              <button className="btn btn-secondary" onClick={() => setShowInviteMembers(true)}>
                <Plus size={16} />
                Invite Member
              </button>
            </div>

            <div className="members-grid">
              {trip.members.map((member) => (
                <div key={member.userId} className="member-card glass-card">
                  <div className="member-avatar">
                    {member.displayName?.[0]?.toUpperCase() || member.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="member-info">
                    <p className="member-name">{member.displayName || member.email || 'User'}</p>
                    <p className="member-role">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Expenses Section */}
          <section className="expenses-section">
            <div className="section-header">
              <h2>Expenses & Budget</h2>
              <button className="btn btn-primary" onClick={() => setShowAddExpense(true)}>
                <Plus size={16} />
                Add Expense
              </button>
            </div>

            {/* Budget Summary */}
            {trip && (() => {
              const summary = calculateExpenseSummary(expenses, trip.budget);
              const settlements = calculateSettlements(summary.byMember);

              return (
                <>
                  <div className="budget-summary glass-card">
                    <div className="budget-stats">
                      <div className="budget-stat">
                        <span className="budget-label">Total Spent</span>
                        <span className="budget-value">
                          {trip.currency} {summary.totalSpent.toFixed(2)}
                        </span>
                      </div>
                      <div className="budget-stat">
                        <span className="budget-label">Budget</span>
                        <span className="budget-value">
                          {trip.currency} {trip.budget.toFixed(2)}
                        </span>
                      </div>
                      <div className="budget-stat">
                        <span className="budget-label">Remaining</span>
                        <span className={`budget-value ${summary.budgetRemaining < 0 ? 'over-budget' : ''}`}>
                          {trip.currency} {summary.budgetRemaining.toFixed(2)}
                        </span>
                      </div>
                      <div className="budget-stat">
                        <span className="budget-label">Used</span>
                        <span className="budget-value">
                          {summary.percentageUsed.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="budget-progress">
                      <div
                        className="budget-progress-bar"
                        style={{
                          width: `${Math.min(summary.percentageUsed, 100)}%`,
                          backgroundColor: summary.percentageUsed > 100 ? '#ef4444' : summary.percentageUsed > 80 ? '#f59e0b' : '#10b981'
                        }}
                      />
                    </div>
                  </div>

                  {/* Expenses List */}
                  <div className="expenses-list">
                    <h3>Recent Expenses</h3>
                    {expenses.length === 0 ? (
                      <div className="empty-state glass-card">
                        <Receipt size={48} />
                        <p>No expenses yet</p>
                        <button className="btn btn-primary" onClick={() => setShowAddExpense(true)}>
                          Add First Expense
                        </button>
                      </div>
                    ) : (
                      expenses.map((expense) => (
                        <div key={expense.id} className="expense-card glass-card">
                          <div className="expense-header">
                            <div className="expense-main">
                              <h4>{expense.title}</h4>
                              <span className={`expense-category category-${expense.category}`}>
                                {expense.category}
                              </span>
                            </div>
                            <div className="expense-amount">
                              <span className="amount">
                                {expense.currency} {expense.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="expense-details">
                            <span className="expense-detail">
                              <Calendar size={14} />
                              {formatDate(expense.date)}
                            </span>
                            <span className="expense-detail">
                              Paid by {expense.paidByName}
                            </span>
                            <span className="expense-detail">
                              Split among {expense.splitAmong.length} {expense.splitAmong.length === 1 ? 'person' : 'people'}
                            </span>
                          </div>
                          {expense.description && (
                            <p className="expense-description">{expense.description}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Settlements */}
                  {settlements.length > 0 && (
                    <div className="settlements-section">
                      <h3>Settlements</h3>
                      <div className="settlements-list">
                        {settlements.map((settlement, idx) => (
                          <div key={idx} className="settlement-card glass-card">
                            <div className="settlement-flow">
                              <div className="settlement-person">
                                <div className="settlement-avatar">
                                  {settlement.fromName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span>{settlement.fromName}</span>
                              </div>
                              <div className="settlement-arrow">
                                <TrendingUp size={20} />
                                <span className="settlement-amount">
                                  {trip.currency} {settlement.amount.toFixed(2)}
                                </span>
                              </div>
                              <div className="settlement-person">
                                <div className="settlement-avatar">
                                  {settlement.toName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span>{settlement.toName}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Balance Summary */}
                  {summary.byMember.length > 0 && (
                    <div className="balance-section">
                      <h3>Member Balances</h3>
                      <div className="balance-list">
                        {summary.byMember.map((member) => (
                          <div key={member.userId} className="balance-card glass-card">
                            <div className="balance-info">
                              <div className="balance-avatar">
                                {member.userName?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div className="balance-details">
                                <span className="balance-name">{member.userName}</span>
                                <span className="balance-stats">
                                  Paid {trip.currency} {member.totalPaid.toFixed(2)} • Owes {trip.currency} {member.totalOwed.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className={`balance-amount ${member.balance >= 0 ? 'positive' : 'negative'}`}>
                              {member.balance >= 0 ? (
                                <TrendingUp size={16} />
                              ) : (
                                <TrendingDown size={16} />
                              )}
                              <span>
                                {trip.currency} {Math.abs(member.balance).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </section>
        </div>
      </div>

      <AddActivityModal
        isOpen={showAddLocation}
        onClose={() => setShowAddLocation(false)}
        onSuccess={loadTripData}
        tripId={tripId || ''}
      />

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSuccess={loadTripData}
        tripId={tripId || ''}
        members={trip?.members || []}
        currency={trip?.currency || 'USD'}
      />

      <InviteMembersModal
        isOpen={showInviteMembers}
        onClose={() => setShowInviteMembers(false)}
        onSuccess={loadTripData}
        trip={trip || ({} as Trip)}
      />

      <SetDestinationModal
        isOpen={showSetDestination}
        onClose={() => setShowSetDestination(false)}
        tripId={tripId || ''}
        currentDestination={trip?.destination}
      />
    </div>
  );
}
