import { useRef, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface PlaceAutocompleteProps {
  value: string;
  onChange: (location: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function PlaceAutocomplete({
  value,
  onChange,
  placeholder = 'Search for a location',
  className = '',
  required = false,
}: PlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      setIsLoaded(true);
    } else {
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'], // Include places and addresses
      fields: ['formatted_address', 'geometry', 'name'], // Only get what we need
    });

    // Listen for place selection
    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();

      if (!place || !place.geometry) {
        console.warn('No place details available');
        return;
      }

      const location = place.formatted_address || place.name || '';
      const lat = place.geometry.location?.lat();
      const lng = place.geometry.location?.lng();

      onChange(location, lat, lng);
    });

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div className="place-autocomplete-wrapper" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)} // Allow manual typing
        required={required}
        autoComplete="off"
      />
      {!isLoaded && (
        <span style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '12px',
          color: '#999'
        }}>
          Loading...
        </span>
      )}
    </div>
  );
}
