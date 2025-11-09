// Amadeus Travel API Service

const AMADEUS_API_KEY = 'AuZ2fq9hYGNZJb7sR9821oy2Csdje1FC';
const AMADEUS_API_SECRET = '4303JRq4AcgUdvoG';
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v1'; // Test environment

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
    });

    if (!response.ok) {
      throw new Error('Failed to get Amadeus access token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiry to 30 minutes (1800 seconds) from now
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return accessToken;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw error;
  }
}

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      duration: string;
    }>;
  }>;
}

export interface HotelOffer {
  hotelId: string;
  name: string;
  rating?: string;
  price: {
    total: string;
    currency: string;
  };
  offers: Array<{
    checkInDate: string;
    checkOutDate: string;
    roomQuantity: string;
  }>;
}

export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  adults: number = 1
): Promise<FlightOffer[]> {
  try {
    const token = await getAccessToken();

    const url = `${AMADEUS_BASE_URL}/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&max=10`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search flights');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

export async function searchHotels(cityCode: string): Promise<any[]> {
  try {
    const token = await getAccessToken();

    const url = `${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search hotels');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
}

export async function searchHotelOffers(
  hotelIds: string[],
  checkInDate: string,
  checkOutDate: string,
  adults: number = 1
): Promise<HotelOffer[]> {
  try {
    const token = await getAccessToken();

    const hotelIdParams = hotelIds.slice(0, 5).join(',');
    const url = `${AMADEUS_BASE_URL}/shopping/hotel-offers?hotelIds=${hotelIdParams}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search hotel offers');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching hotel offers:', error);
    return [];
  }
}

// Helper function to get city IATA code
export function getCityCode(cityName: string): string {
  const codes: { [key: string]: string } = {
    'paris': 'PAR',
    'london': 'LON',
    'new york': 'NYC',
    'tokyo': 'TYO',
    'dubai': 'DXB',
    'singapore': 'SIN',
    'bangkok': 'BKK',
    'rome': 'ROM',
    'barcelona': 'BCN',
    'amsterdam': 'AMS',
    'sydney': 'SYD',
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'bangalore': 'BLR',
    'hyderabad': 'HYD',
    'goa': 'GOI',
    'chennai': 'MAA',
  };

  return codes[cityName.toLowerCase()] || 'NYC';
}

export async function getPointsOfInterest(
  latitude: number,
  longitude: number,
  radius: number = 1
): Promise<any[]> {
  try {
    const token = await getAccessToken();

    const url = `${AMADEUS_BASE_URL}/reference-data/locations/pois?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get points of interest');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error getting points of interest:', error);
    return [];
  }
}

export async function getActivities(
  latitude: number,
  longitude: number,
  radius: number = 1
): Promise<any[]> {
  try {
    const token = await getAccessToken();

    const url = `${AMADEUS_BASE_URL}/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get activities');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
}
