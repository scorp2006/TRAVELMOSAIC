// Popular Places TypeScript interfaces

export interface PopularPlace {
  id: string;
  name: string;
  description?: string;
  category: 'accommodation' | 'transport' | 'food' | 'activity' | 'shopping' | 'other';
  rating?: number;
  reviewCount?: number;
  priceLevel?: number; // 0-4 ($, $$, $$$, $$$$)
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  photo?: string;
  photoUrl?: string;
  openingHours?: string[];
  suggestedDuration?: string;
  tags?: string[];
  source: 'google' | 'tripadvisor' | 'amadeus';
}

export interface PlacesSearchParams {
  destination: string;
  category?: 'all' | 'attractions' | 'restaurants' | 'hotels' | 'activities';
  limit?: number;
}

export interface PlacesSearchResult {
  places: PopularPlace[];
  totalResults: number;
  source: string;
}
