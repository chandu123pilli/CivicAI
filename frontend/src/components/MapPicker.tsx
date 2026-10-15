import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { pickerIcon } from '../utils/mapIcons';
import { MapPin, Navigation } from 'lucide-react';

interface Props {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194]; // Metro Center default

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    },
  });
  return null;
}

export const MapPicker: React.FC<Props> = ({ latitude, longitude, onChange }) => {
  const currentPos: [number, number] =
    latitude !== null && longitude !== null ? [latitude, longitude] : DEFAULT_CENTER;

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange(
            Number(pos.coords.latitude.toFixed(5)),
            Number(pos.coords.longitude.toFixed(5))
          );
        },
        () => {
          // Fallback default
          onChange(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 font-medium">
          <MapPin className="w-3.5 h-3.5 text-cyan-500" />
          Click anywhere on the map to pinpoint issue location
        </span>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
        >
          <Navigation className="w-3 h-3" />
          <span>My GPS</span>
        </button>
      </div>

      <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
        <MapContainer
          center={currentPos}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          {latitude !== null && longitude !== null && (
            <Marker position={[latitude, longitude]} icon={pickerIcon} />
          )}
        </MapContainer>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
        <span>Lat: <strong className="text-slate-800">{latitude !== null ? latitude : 'Not selected'}</strong></span>
        <span>Lng: <strong className="text-slate-800">{longitude !== null ? longitude : 'Not selected'}</strong></span>
      </div>
    </div>
  );
};
