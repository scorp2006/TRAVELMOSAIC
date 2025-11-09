import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Loader, Package, Check, X } from 'lucide-react';
import { getWeatherForecast, getWeatherRecommendation } from '../services/weatherService';
import {
  generatePackingList,
  getPackingList,
  savePackingList,
  togglePackedItem,
  getPackingProgress,
} from '../services/packingService';
import type { Trip } from '../types/trip';
import type { WeatherForecast } from '../types/weather';
import type { PackingListItem } from '../types/weather';
import './WeatherPackingPanel.css';

interface WeatherPackingPanelProps {
  trip: Trip;
}

export default function WeatherPackingPanel({ trip }: WeatherPackingPanelProps) {
  const [activeTab, setActiveTab] = useState<'weather' | 'packing'>('weather');
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [packingItems, setPackingItems] = useState<PackingListItem[]>([]);
  const [packingListId, setPackingListId] = useState<string | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingPacking, setLoadingPacking] = useState(false);
  const [generatingPacking, setGeneratingPacking] = useState(false);

  useEffect(() => {
    if (trip.destination) {
      loadWeather();
    }
    loadPackingList();
  }, [trip.id, trip.destination]);

  async function loadWeather() {
    if (!trip.destination) return;

    setLoadingWeather(true);
    try {
      const forecast = await getWeatherForecast(
        trip.destination,
        trip.startDate,
        trip.endDate
      );
      setWeather(forecast);
    } catch (error) {
      console.error('Failed to load weather:', error);
    } finally {
      setLoadingWeather(false);
    }
  }

  async function loadPackingList() {
    setLoadingPacking(true);
    try {
      const list = await getPackingList(trip.id);
      if (list) {
        setPackingItems(list.items);
        setPackingListId(list.id);
      }
    } catch (error) {
      console.error('Failed to load packing list:', error);
    } finally {
      setLoadingPacking(false);
    }
  }

  async function handleGeneratePackingList() {
    setGeneratingPacking(true);
    try {
      const items = await generatePackingList(trip, weather || undefined);
      setPackingItems(items);

      const listId = await savePackingList(trip.id, items);
      setPackingListId(listId);
    } catch (error) {
      console.error('Failed to generate packing list:', error);
    } finally {
      setGeneratingPacking(false);
    }
  }

  async function handleToggleItem(itemId: string, packed: boolean) {
    if (!packingListId) return;

    try {
      await togglePackedItem(packingListId, itemId, packed);
      setPackingItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, packed } : item
        )
      );
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  }

  function getWeatherIcon(condition: string) {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun size={24} className="weather-icon sun" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain size={24} className="weather-icon rain" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud size={24} className="weather-icon clouds" />;
      default:
        return <Cloud size={24} className="weather-icon" />;
    }
  }

  const packingProgress = getPackingProgress(packingItems);
  const recommendations = weather ? getWeatherRecommendation(weather) : [];

  return (
    <div className="weather-packing-panel glass-card">
      <div className="panel-tabs">
        <button
          className={`tab-button ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveTab('weather')}
        >
          <Cloud size={18} />
          Weather Forecast
        </button>
        <button
          className={`tab-button ${activeTab === 'packing' ? 'active' : ''}`}
          onClick={() => setActiveTab('packing')}
        >
          <Package size={18} />
          Packing List
          {packingItems.length > 0 && (
            <span className="packing-badge">{packingProgress}%</span>
          )}
        </button>
      </div>

      {activeTab === 'weather' && (
        <div className="weather-content">
          {loadingWeather ? (
            <div className="loading-state">
              <Loader size={32} className="spinner" />
              <p>Loading weather forecast...</p>
            </div>
          ) : weather ? (
            <>
              <div className="weather-header">
                <h3>{weather.location}</h3>
                <p className="weather-subtitle">
                  {weather.forecasts.length}-day forecast
                </p>
              </div>

              <div className="weather-grid">
                {weather.forecasts.map((day, index) => (
                  <div key={index} className="weather-day-card">
                    <div className="day-date">
                      {day.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="day-icon">{getWeatherIcon(day.condition)}</div>
                    <div className="day-condition">{day.condition}</div>
                    <div className="day-temp">
                      <span className="temp-max">{day.temperature.max}°</span>
                      <span className="temp-min">{day.temperature.min}°</span>
                    </div>
                    <div className="day-details">
                      <span className="detail-item">
                        <Droplets size={12} />
                        {day.humidity}%
                      </span>
                      <span className="detail-item">
                        <Wind size={12} />
                        {day.windSpeed.toFixed(1)} m/s
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {recommendations.length > 0 && (
                <div className="weather-recommendations">
                  <h4>Weather Tips</h4>
                  <ul>
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <Cloud size={48} />
              <p>Unable to load weather forecast</p>
              <button className="btn btn-secondary btn-sm" onClick={loadWeather}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'packing' && (
        <div className="packing-content">
          {loadingPacking ? (
            <div className="loading-state">
              <Loader size={32} className="spinner" />
              <p>Loading packing list...</p>
            </div>
          ) : packingItems.length > 0 ? (
            <>
              <div className="packing-header">
                <div className="packing-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${packingProgress}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {packingItems.filter((i) => i.packed).length} of{' '}
                    {packingItems.length} packed
                  </span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleGeneratePackingList}
                  disabled={generatingPacking}
                >
                  {generatingPacking ? (
                    <>
                      <Loader size={16} className="spinner" />
                      Regenerating...
                    </>
                  ) : (
                    'Regenerate List'
                  )}
                </button>
              </div>

              <div className="packing-categories">
                {['clothing', 'toiletries', 'electronics', 'documents', 'other'].map(
                  (category) => {
                    const categoryItems = packingItems.filter(
                      (item) => item.category === category
                    );
                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category} className="packing-category">
                        <h4 className="category-title">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h4>
                        <div className="category-items">
                          {categoryItems.map((item) => (
                            <label key={item.id} className="packing-item">
                              <input
                                type="checkbox"
                                checked={item.packed}
                                onChange={(e) =>
                                  handleToggleItem(item.id, e.target.checked)
                                }
                              />
                              <span
                                className={`item-text ${
                                  item.packed ? 'packed' : ''
                                }`}
                              >
                                {item.item}
                                {item.quantity && ` (x${item.quantity})`}
                              </span>
                              {item.notes && (
                                <span className="item-notes">{item.notes}</span>
                              )}
                              {item.packed && (
                                <Check size={16} className="check-icon" />
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Package size={48} />
              <p>No packing list yet</p>
              <button
                className="btn btn-primary"
                onClick={handleGeneratePackingList}
                disabled={generatingPacking}
              >
                {generatingPacking ? (
                  <>
                    <Loader size={20} className="spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Package size={20} />
                    Generate Packing List
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
