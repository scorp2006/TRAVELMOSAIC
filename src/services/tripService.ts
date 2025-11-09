import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Trip, TripMember, CreateTripData, UpdateTripData, Activity } from '../types/trip';

const TRIPS_COLLECTION = 'trips';
const ACTIVITIES_COLLECTION = 'activities';

// ==========================================
// TRIP CRUD OPERATIONS
// ==========================================

export async function createTrip(
  userId: string,
  data: CreateTripData,
  userEmail?: string,
  userDisplayName?: string
): Promise<string> {
  const tripData = {
    ...data,
    createdBy: userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    members: [
      {
        userId,
        email: userEmail || '',
        displayName: userDisplayName,
        role: 'admin',
        joinedAt: Timestamp.now(),
        status: 'accepted',
      },
    ] as TripMember[],
    status: 'planning' as const,
  };

  const docRef = await addDoc(collection(db, TRIPS_COLLECTION), tripData);
  return docRef.id;
}

export async function getTrip(tripId: string): Promise<Trip | null> {
  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    startDate: data.startDate.toDate(),
    endDate: data.endDate.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Trip;
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  // Query all trips and filter on client side since array-contains with objects doesn't work
  const q = query(
    collection(db, TRIPS_COLLECTION),
    orderBy('updatedAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const trips: Trip[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    // Check if current user is a member of this trip
    const isMember = data.members?.some((member: any) => member.userId === userId);

    if (isMember) {
      trips.push({
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Trip);
    }
  });

  return trips;
}

export async function updateTrip(tripId: string, data: UpdateTripData): Promise<void> {
  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTrip(tripId: string): Promise<void> {
  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  await deleteDoc(docRef);

  // Also delete all activities for this trip
  const activitiesQuery = query(
    collection(db, ACTIVITIES_COLLECTION),
    where('tripId', '==', tripId)
  );
  const activitiesSnapshot = await getDocs(activitiesQuery);

  const deletePromises = activitiesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

// ==========================================
// MEMBER MANAGEMENT
// ==========================================

export async function addTripMember(
  tripId: string,
  member: TripMember
): Promise<void> {
  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  await updateDoc(docRef, {
    members: arrayUnion(member),
    updatedAt: Timestamp.now(),
  });
}

export async function removeTripMember(
  tripId: string,
  userId: string
): Promise<void> {
  const trip = await getTrip(tripId);
  if (!trip) throw new Error('Trip not found');

  const memberToRemove = trip.members.find((m) => m.userId === userId);
  if (!memberToRemove) throw new Error('Member not found');

  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  await updateDoc(docRef, {
    members: arrayRemove(memberToRemove),
    updatedAt: Timestamp.now(),
  });
}

export async function updateMemberRole(
  tripId: string,
  userId: string,
  newRole: 'admin' | 'member'
): Promise<void> {
  const trip = await getTrip(tripId);
  if (!trip) throw new Error('Trip not found');

  const updatedMembers = trip.members.map((member) =>
    member.userId === userId ? { ...member, role: newRole } : member
  );

  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  await updateDoc(docRef, {
    members: updatedMembers,
    updatedAt: Timestamp.now(),
  });
}

// ==========================================
// ACTIVITY OPERATIONS
// ==========================================

export async function createActivity(
  userId: string,
  activity: Omit<Activity, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  // Remove undefined values to avoid Firestore errors
  const cleanedActivity: any = {
    createdBy: userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  // Only add defined fields
  Object.keys(activity).forEach(key => {
    const value = (activity as any)[key];
    if (value !== undefined) {
      cleanedActivity[key] = value;
    }
  });

  const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), cleanedActivity);
  return docRef.id;
}

export async function getActivitiesByTrip(tripId: string): Promise<Activity[]> {
  // Simplified query - sort on client side to avoid index requirement
  const q = query(
    collection(db, ACTIVITIES_COLLECTION),
    where('tripId', '==', tripId)
  );

  const querySnapshot = await getDocs(q);
  const activities: Activity[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    activities.push({
      id: doc.id,
      ...data,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Activity);
  });

  // Sort on client side
  activities.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.order - b.order;
  });

  return activities;
}

export async function updateActivity(
  activityId: string,
  data: Partial<Activity>
): Promise<void> {
  const docRef = doc(db, ACTIVITIES_COLLECTION, activityId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteActivity(activityId: string): Promise<void> {
  const docRef = doc(db, ACTIVITIES_COLLECTION, activityId);
  await deleteDoc(docRef);
}

// ==========================================
// REAL-TIME LISTENERS FOR COLLABORATION
// ==========================================

export function subscribeToTrip(
  tripId: string,
  onUpdate: (trip: Trip) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const docRef = doc(db, TRIPS_COLLECTION, tripId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const trip: Trip = {
          id: docSnap.id,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Trip;
        onUpdate(trip);
      }
    },
    (error) => {
      console.error('Error in trip subscription:', error);
      if (onError) onError(error);
    }
  );
}

export function subscribeToActivities(
  tripId: string,
  onUpdate: (activities: Activity[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  // Simplified query - sort on client side to avoid index requirement
  const q = query(
    collection(db, ACTIVITIES_COLLECTION),
    where('tripId', '==', tripId)
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const activities: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Activity);
      });
      // Sort on client side
      activities.sort((a, b) => {
        const dateCompare = a.date.getTime() - b.date.getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.order - b.order;
      });
      onUpdate(activities);
    },
    (error) => {
      console.error('Error in activities subscription:', error);
      if (onError) onError(error);
    }
  );
}
