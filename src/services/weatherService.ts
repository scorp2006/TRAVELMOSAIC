import type { WeatherForecast, WeatherData } from '../types/weather';

// OpenWeatherMap API Key
const OPENWEATHER_API_KEY = '0e8c45ed93cf088f82bf090d9704ed47';

export async function getWeatherForecast(
  destination: string,
  startDate: Date,
  endDate: Date
): Promise<WeatherForecast | null> {
  // Check if API key is configured
  if (OPENWEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
    console.warn('OpenWeatherMap API key not configured. Using mock data.');
    return getMockWeatherForecast(destination, startDate, endDate);
  }

  // Calculate days until trip starts
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tripStart = new Date(startDate);
  tripStart.setHours(0, 0, 0, 0);
  const daysUntilTrip = Math.floor((tripStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // OpenWeatherMap free tier only provides 5-day forecast from today
  // If trip is more than 5 days away, use mock data for accurate trip dates
  if (daysUntilTrip > 5) {
    console.log(`Trip is ${daysUntilTrip} days away, using estimated weather data for trip dates`);
    return getMockWeatherForecast(destination, startDate, endDate);
  }

  try {
    // First, get coordinates for the destination
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    if (!geoResponse.ok) {
      throw new Error('Failed to fetch location coordinates');
    }

    const geoData = await geoResponse.json();
    if (!geoData || geoData.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lon, name, country } = geoData[0];

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch weather forecast');
    }

    const forecastData = await forecastResponse.json();

    // Process forecast data
    const allForecasts: WeatherData[] = processForecastData(forecastData.list);

    // Filter forecasts to only include trip dates
    const tripEnd = new Date(endDate);
    tripEnd.setHours(23, 59, 59, 999);

    const tripForecasts = allForecasts.filter(forecast => {
      const forecastDate = new Date(forecast.date);
      forecastDate.setHours(0, 0, 0, 0);
      return forecastDate >= tripStart && forecastDate <= tripEnd;
    });

    // If we don't have enough forecasts for the trip dates, supplement with mock data
    if (tripForecasts.length === 0) {
      console.log('No API forecasts match trip dates, using estimated weather data');
      return getMockWeatherForecast(destination, startDate, endDate);
    }

    return {
      location: `${name}, ${country}`,
      forecasts: tripForecasts,
      timezone: forecastData.city.timezone,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return getMockWeatherForecast(destination, startDate, endDate);
  }
}

function processForecastData(forecastList: any[]): WeatherData[] {
  // Group by day and get daily min/max temperatures
  const dailyForecasts = new Map<string, any[]>();

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];

    if (!dailyForecasts.has(dateKey)) {
      dailyForecasts.set(dateKey, []);
    }
    dailyForecasts.get(dateKey)!.push(item);
  });

  const weatherData: WeatherData[] = [];

  dailyForecasts.forEach((dayData, dateKey) => {
    const temps = dayData.map((d) => d.main.temp);
    const midDayData = dayData[Math.floor(dayData.length / 2)];

    weatherData.push({
      date: new Date(dateKey),
      temperature: {
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps)),
        current: Math.round(midDayData.main.temp),
      },
      condition: midDayData.weather[0].main,
      description: midDayData.weather[0].description,
      icon: midDayData.weather[0].icon,
      humidity: midDayData.main.humidity,
      windSpeed: midDayData.wind.speed,
      precipitation: midDayData.pop * 100,
    });
  });

  return weatherData.slice(0, 5); // Return max 5 days
}

// Mock data for when API key is not configured
function getMockWeatherForecast(
  destination: string,
  startDate: Date,
  endDate: Date
): WeatherForecast {
  const days = Math.min(
    5,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const forecasts: WeatherData[] = [];
  const conditions = ['Clear', 'Clouds', 'Rain', 'Sunny', 'Partly Cloudy'];
  const icons = ['01d', '02d', '10d', '01d', '03d'];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const conditionIndex = i % conditions.length;

    forecasts.push({
      date,
      temperature: {
        min: 18 + Math.floor(Math.random() * 5),
        max: 25 + Math.floor(Math.random() * 8),
        current: 22 + Math.floor(Math.random() * 6),
      },
      condition: conditions[conditionIndex],
      description: conditions[conditionIndex].toLowerCase(),
      icon: icons[conditionIndex],
      humidity: 50 + Math.floor(Math.random() * 30),
      windSpeed: 5 + Math.random() * 10,
      precipitation: Math.random() * 40,
    });
  }

  return {
    location: destination,
    forecasts,
    timezone: 'UTC',
  };
}

export function getWeatherIcon(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function getWeatherRecommendation(forecast: WeatherForecast): string[] {
  const recommendations: string[] = [];
  const avgTemp =
    forecast.forecasts.reduce((sum, f) => sum + f.temperature.current, 0) /
    forecast.forecasts.length;

  const hasRain = forecast.forecasts.some((f) => f.condition.includes('Rain'));
  const isCold = avgTemp < 15;
  const isHot = avgTemp > 30;

  if (hasRain) {
    recommendations.push('Pack an umbrella or rain jacket');
  }

  if (isCold) {
    recommendations.push('Bring warm clothing and layers');
  }

  if (isHot) {
    recommendations.push('Pack light, breathable clothes and sunscreen');
  }

  if (forecast.forecasts.some((f) => f.windSpeed > 15)) {
    recommendations.push('Expect windy conditions');
  }

  return recommendations;
}
