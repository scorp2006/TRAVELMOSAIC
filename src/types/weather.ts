// Weather-related TypeScript interfaces

export interface WeatherData {
  date: Date;
  temperature: {
    min: number;
    max: number;
    current: number;
  };
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherForecast {
  location: string;
  forecasts: WeatherData[];
  timezone: string;
}

export interface PackingListItem {
  id: string;
  item: string;
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'other';
  packed: boolean;
  quantity?: number;
  notes?: string;
}

export interface PackingList {
  id: string;
  tripId: string;
  items: PackingListItem[];
  createdAt: Date;
  updatedAt: Date;
}
