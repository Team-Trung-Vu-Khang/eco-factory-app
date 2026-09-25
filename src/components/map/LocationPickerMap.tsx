import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

// Vite doesn't resolve Leaflet's default icon paths
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

export type LatLng = { latitude: number; longitude: number };

const DEFAULT_CENTER: [number, number] = [21.0285, 105.8542]; // Hà Nội

function FollowPosition({ position }: { position?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 15), { animate: true });
  }, [map, position]);
  return null;
}

function ClickToPick({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click: (e) => onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng }),
  });
  return null;
}

interface LocationPickerMapProps {
  value?: LatLng;
  onPick?: (position: LatLng) => void;
  className?: string;
}

/** Leaflet map: shows the marker, click or drag the marker to pick a new position */
export function LocationPickerMap({ value, onPick, className = "h-80" }: LocationPickerMapProps) {
  const position: [number, number] | undefined =
    value && Number.isFinite(value.latitude) && Number.isFinite(value.longitude)
      ? [value.latitude, value.longitude]
      : undefined;

  return (
    <div className={`relative z-0 overflow-hidden rounded-lg border border-slate-200 ${className}`}>
      <MapContainer center={position ?? DEFAULT_CENTER} zoom={position ? 15 : 6} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FollowPosition position={position} />
        {onPick && <ClickToPick onPick={onPick} />}
        {position && (
          <Marker
            position={position}
            draggable={!!onPick}
            eventHandlers={{
              dragend: (e) => {
                const p = (e.target as L.Marker).getLatLng();
                onPick?.({ latitude: p.lat, longitude: p.lng });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
