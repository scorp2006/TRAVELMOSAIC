// AI-related TypeScript interfaces

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  category: 'accommodation' | 'transport' | 'food' | 'activity' | 'other';
  location?: string;
  estimatedCost?: number;
  duration?: string;
  bestTimeToVisit?: string;
  tips?: string[];
}

export interface ItineraryGenerationRequest {
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  interests?: string[];
  travelStyle?: 'budget' | 'moderate' | 'luxury';
  groupSize?: number;
}

export interface GeneratedItinerary {
  suggestions: AISuggestion[];
  overview: string;
  budgetBreakdown?: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    other: number;
  };
  tips: string[];
}
