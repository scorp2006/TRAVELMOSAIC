import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { model } from '../config/gemini';
import type { PackingList, PackingListItem } from '../types/weather';
import type { Trip } from '../types/trip';
import type { WeatherForecast } from '../types/weather';

const PACKING_LISTS_COLLECTION = 'packingLists';

export async function generatePackingList(
  trip: Trip,
  weather?: WeatherForecast
): Promise<PackingListItem[]> {
  const duration = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const weatherInfo = weather
    ? `Weather forecast: ${weather.forecasts
        .map(
          (f) =>
            `${f.condition} (${f.temperature.min}-${f.temperature.max}°C)`
        )
        .join(', ')}`
    : 'Weather forecast not available';

  const prompt = `Generate a comprehensive packing list for a trip with these details:

Destination: ${trip.destination}
Duration: ${duration} days
Budget: ${trip.currency} ${trip.budget}
Group size: ${trip.members.length} ${trip.members.length === 1 ? 'person' : 'people'}
${weatherInfo}

Create a detailed packing list with items categorized as:
- clothing (weather-appropriate clothes, shoes, accessories)
- toiletries (personal care items)
- electronics (chargers, adapters, etc.)
- documents (passport, tickets, insurance, etc.)
- other (medications, travel essentials, etc.)

For each item, provide:
- Item name (concise)
- Category
- Quantity (if relevant)
- Brief note about why it's needed (optional)

Format as JSON array:
[
  {
    "item": "string",
    "category": "clothing|toiletries|electronics|documents|other",
    "quantity": number,
    "notes": "string (optional)"
  }
]

Include 20-30 essential items. Be practical and specific to the destination and weather.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    let jsonText = text;
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      const jsonArrayMatch = text.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        jsonText = jsonArrayMatch[0];
      }
    }

    const parsed = JSON.parse(jsonText);

    // Add IDs and packed status
    const items: PackingListItem[] = parsed.map((item: any, index: number) => ({
      id: `item-${Date.now()}-${index}`,
      item: item.item,
      category: item.category,
      quantity: item.quantity,
      notes: item.notes,
      packed: false,
    }));

    return items;
  } catch (error) {
    console.error('Error generating packing list:', error);
    return getDefaultPackingList(trip, weather);
  }
}

function getDefaultPackingList(
  trip: Trip,
  weather?: WeatherForecast
): PackingListItem[] {
  const duration = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const items: PackingListItem[] = [
    // Documents
    { id: '1', item: 'Passport', category: 'documents', packed: false },
    { id: '2', item: 'Flight tickets', category: 'documents', packed: false },
    { id: '3', item: 'Hotel confirmations', category: 'documents', packed: false },
    { id: '4', item: 'Travel insurance', category: 'documents', packed: false },

    // Clothing
    { id: '5', item: 'T-shirts', category: 'clothing', quantity: duration, packed: false },
    { id: '6', item: 'Pants/Shorts', category: 'clothing', quantity: Math.ceil(duration / 2), packed: false },
    { id: '7', item: 'Underwear', category: 'clothing', quantity: duration + 2, packed: false },
    { id: '8', item: 'Socks', category: 'clothing', quantity: duration, packed: false },
    { id: '9', item: 'Comfortable shoes', category: 'clothing', quantity: 1, packed: false },
    { id: '10', item: 'Jacket/Sweater', category: 'clothing', quantity: 1, packed: false },

    // Toiletries
    { id: '11', item: 'Toothbrush & toothpaste', category: 'toiletries', packed: false },
    { id: '12', item: 'Shampoo & soap', category: 'toiletries', packed: false },
    { id: '13', item: 'Deodorant', category: 'toiletries', packed: false },
    { id: '14', item: 'Sunscreen', category: 'toiletries', packed: false },

    // Electronics
    { id: '15', item: 'Phone charger', category: 'electronics', packed: false },
    { id: '16', item: 'Power adapter', category: 'electronics', packed: false },
    { id: '17', item: 'Camera (optional)', category: 'electronics', packed: false },

    // Other
    { id: '18', item: 'Medications', category: 'other', packed: false },
    { id: '19', item: 'First aid kit', category: 'other', packed: false },
    { id: '20', item: 'Reusable water bottle', category: 'other', packed: false },
  ];

  // Add weather-specific items
  if (weather) {
    const hasRain = weather.forecasts.some((f) => f.condition.includes('Rain'));
    const avgTemp = weather.forecasts.reduce((sum, f) => sum + f.temperature.current, 0) / weather.forecasts.length;

    if (hasRain) {
      items.push({
        id: `weather-${Date.now()}-1`,
        item: 'Umbrella/Rain jacket',
        category: 'clothing',
        packed: false,
        notes: 'Rain expected',
      });
    }

    if (avgTemp < 15) {
      items.push({
        id: `weather-${Date.now()}-2`,
        item: 'Warm coat',
        category: 'clothing',
        packed: false,
        notes: 'Cold weather expected',
      });
    }

    if (avgTemp > 30) {
      items.push({
        id: `weather-${Date.now()}-3`,
        item: 'Hat & sunglasses',
        category: 'clothing',
        packed: false,
        notes: 'Hot weather expected',
      });
    }
  }

  return items;
}

export async function savePackingList(
  tripId: string,
  items: PackingListItem[]
): Promise<string> {
  // Check if packing list already exists for this trip
  const q = query(
    collection(db, PACKING_LISTS_COLLECTION),
    where('tripId', '==', tripId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Update existing packing list
    const docId = querySnapshot.docs[0].id;
    await updateDoc(doc(db, PACKING_LISTS_COLLECTION, docId), {
      items,
      updatedAt: Timestamp.now(),
    });
    return docId;
  } else {
    // Create new packing list
    const packingListData = {
      tripId,
      items,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, PACKING_LISTS_COLLECTION), packingListData);
    return docRef.id;
  }
}

export async function getPackingList(tripId: string): Promise<PackingList | null> {
  const q = query(
    collection(db, PACKING_LISTS_COLLECTION),
    where('tripId', '==', tripId)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    tripId: data.tripId,
    items: data.items,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}

export async function togglePackedItem(
  packingListId: string,
  itemId: string,
  packed: boolean
): Promise<void> {
  const docRef = doc(db, PACKING_LISTS_COLLECTION, packingListId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Packing list not found');
  }

  const data = docSnap.data();
  const updatedItems = data.items.map((item: PackingListItem) =>
    item.id === itemId ? { ...item, packed } : item
  );

  await updateDoc(docRef, {
    items: updatedItems,
    updatedAt: Timestamp.now(),
  });
}

export function getPackingProgress(items: PackingListItem[]): number {
  if (items.length === 0) return 0;
  const packedCount = items.filter((item) => item.packed).length;
  return Math.round((packedCount / items.length) * 100);
}
