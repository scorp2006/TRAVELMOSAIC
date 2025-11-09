// Trip-related TypeScript interfaces

export interface Trip {
  id: string;
  name: string;
  destination?: string; // Optional - can be decided collaboratively after creation
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  description?: string;
  coverImage?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: TripMember[];
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
}

export interface TripMember {
  userId: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Activity {
  id: string;
  tripId: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  lat?: number; // Latitude coordinate for map display
  lng?: number; // Longitude coordinate for map display
  cost?: number;
  category: 'accommodation' | 'transport' | 'food' | 'activity' | 'other';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface TripInvite {
  id: string;
  tripId: string;
  tripName: string;
  invitedBy: string;
  invitedByName: string;
  invitedEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  expiresAt: Date;
}

export interface CreateTripData {
  name: string;
  destination?: string; // Optional - can be added later collaboratively
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  description?: string;
  coverImage?: string;
}

export interface UpdateTripData {
  name?: string;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  currency?: string;
  description?: string;
  coverImage?: string;
}
