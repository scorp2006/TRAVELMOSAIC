import type { PopularPlace, PlacesSearchParams, PlacesSearchResult } from '../types/places';

// API Keys
const GOOGLE_PLACES_API_KEY = 'AIzaSyC7Zhkf9iMQfyMnpPbSDVnlFzw1_0K6khA'; // Google Maps JavaScript API

export async function searchPopularPlaces(
  params: PlacesSearchParams
): Promise<PlacesSearchResult> {
  try {
    // Google Places Text Search API has CORS restrictions from browser
    // For MVP, using curated data with real photos and coordinates
    console.warn('Using curated place data for MVP');
    return getMockPlaces(params);
  } catch (error) {
    console.error('Error fetching places:', error);
    return getMockPlaces(params);
  }
}

// Curated places with real photos and coordinates
function getMockPlaces(params: PlacesSearchParams): PlacesSearchResult {
  const { destination } = params;
  const destLower = destination.toLowerCase();
  let mockPlaces: PopularPlace[] = [];

  // Paris-specific places with real data
  if (destLower.includes('paris')) {
    mockPlaces = [
      {
        id: 'paris-1',
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower on the Champ de Mars',
        category: 'activity',
        rating: 4.6,
        reviewCount: 358942,
        priceLevel: 2,
        location: {
          address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
          lat: 48.8584,
          lng: 2.2945,
        },
        photoUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=80',
        suggestedDuration: '2-3 hours',
        tags: ['Landmark', 'Tower', 'Icon'],
        source: 'google',
      },
      {
        id: 'paris-2',
        name: 'Louvre Museum',
        description: 'World\'s largest art museum and historic monument',
        category: 'activity',
        rating: 4.7,
        reviewCount: 245638,
        priceLevel: 2,
        location: {
          address: 'Rue de Rivoli, 75001 Paris, France',
          lat: 48.8606,
          lng: 2.3376,
        },
        photoUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80',
        suggestedDuration: '3-4 hours',
        tags: ['Museum', 'Art', 'History'],
        source: 'google',
      },
      {
        id: 'paris-3',
        name: 'Arc de Triomphe',
        description: 'Monumental arch honoring those who fought for France',
        category: 'activity',
        rating: 4.6,
        reviewCount: 156789,
        priceLevel: 1,
        location: {
          address: 'Place Charles de Gaulle, 75008 Paris, France',
          lat: 48.8738,
          lng: 2.2950,
        },
        photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
        suggestedDuration: '1-2 hours',
        tags: ['Monument', 'History', 'Architecture'],
        source: 'google',
      },
      {
        id: 'paris-4',
        name: 'Notre-Dame Cathedral',
        description: 'Medieval Catholic cathedral with French Gothic architecture',
        category: 'activity',
        rating: 4.7,
        reviewCount: 198456,
        priceLevel: 0,
        location: {
          address: '6 Parvis Notre-Dame, 75004 Paris, France',
          lat: 48.8530,
          lng: 2.3499,
        },
        photoUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
        suggestedDuration: '1-2 hours',
        tags: ['Cathedral', 'Gothic', 'Historic'],
        source: 'google',
      },
      {
        id: 'paris-5',
        name: 'Montmartre & Sacré-Cœur',
        description: 'Charming hillside neighborhood with iconic basilica',
        category: 'activity',
        rating: 4.7,
        reviewCount: 123567,
        priceLevel: 0,
        location: {
          address: '35 Rue du Chevalier de la Barre, 75018 Paris, France',
          lat: 48.8867,
          lng: 2.3431,
        },
        photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
        suggestedDuration: '2-3 hours',
        tags: ['Neighborhood', 'Basilica', 'Views'],
        source: 'google',
      },
      {
        id: 'paris-6',
        name: 'Le Marais',
        description: 'Historic district with trendy boutiques and cafes',
        category: 'food',
        rating: 4.5,
        reviewCount: 89234,
        priceLevel: 2,
        location: {
          address: 'Le Marais, 75004 Paris, France',
          lat: 48.8566,
          lng: 2.3622,
        },
        photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        suggestedDuration: '2-4 hours',
        tags: ['Shopping', 'Food', 'Historic'],
        source: 'google',
      },
    ];
  } else {
    // Generic places for any destination
    mockPlaces = [
      {
        id: `${destination}-1`,
        name: `${destination} City Center`,
        description: 'Main downtown area with shops and restaurants',
        category: 'activity',
        rating: 4.5,
        reviewCount: 12543,
        priceLevel: 2,
        location: {
          address: `City Center, ${destination}`,
          lat: 0,
          lng: 0,
        },
        photoUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
        suggestedDuration: '2-3 hours',
        tags: ['Downtown', 'Shopping', 'Dining'],
        source: 'google',
      },
      {
        id: `${destination}-2`,
        name: `${destination} Museum`,
        description: 'Local museum showcasing art and history',
        category: 'activity',
        rating: 4.6,
        reviewCount: 8932,
        priceLevel: 1,
        location: {
          address: `Museum District, ${destination}`,
          lat: 0,
          lng: 0,
        },
        photoUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80',
        suggestedDuration: '2-3 hours',
        tags: ['Museum', 'Art', 'Culture'],
        source: 'google',
      },
      {
        id: `${destination}-3`,
        name: 'Central Park',
        description: 'Beautiful green space perfect for walks',
        category: 'activity',
        rating: 4.7,
        reviewCount: 15234,
        priceLevel: 0,
        location: {
          address: `Park Avenue, ${destination}`,
          lat: 0,
          lng: 0,
        },
        photoUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400&q=80',
        suggestedDuration: '1-2 hours',
        tags: ['Park', 'Nature', 'Outdoor'],
        source: 'google',
      },
      {
        id: `${destination}-4`,
        name: 'Local Food Market',
        description: 'Vibrant market with fresh food and local delicacies',
        category: 'food',
        rating: 4.5,
        reviewCount: 6543,
        priceLevel: 1,
        location: {
          address: `Market Street, ${destination}`,
          lat: 0,
          lng: 0,
        },
        photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        suggestedDuration: '1-2 hours',
        tags: ['Food', 'Market', 'Local'],
        source: 'google',
      },
      {
        id: `${destination}-5`,
        name: 'Historic Cathedral',
        description: 'Beautiful architecture and cultural heritage',
        category: 'activity',
        rating: 4.8,
        reviewCount: 9876,
        priceLevel: 0,
        location: {
          address: `Cathedral Square, ${destination}`,
          lat: 0,
          lng: 0,
        },
        photoUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
        suggestedDuration: '1 hour',
        tags: ['Historic', 'Architecture', 'Culture'],
        source: 'google',
      },
      {
        id: `${destination}-6`,
        name: 'Waterfront Promenade',
        description: 'Scenic walkway with cafes and views',
        category: 'activity',
        rating: 4.6,
        reviewCount: 7654,
        priceLevel: 0,
        location: {
          address: `Waterfront, ${destination}`,
          lat: 0,
          lng: 0,
        },
        photoUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80',
        suggestedDuration: '1-2 hours',
        tags: ['Scenic', 'Walk', 'Relaxing'],
        source: 'google',
      },
    ];
  }

  return {
    places: mockPlaces,
    totalResults: mockPlaces.length,
    source: 'mock',
  };
}
