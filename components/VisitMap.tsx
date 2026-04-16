"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type VisitPoint = {
  id: string;
  lat: number;
  lng: number;
  city?: string | null;
  country?: string | null;
  ip?: string | null;
  count: number;
};

export default function VisitMap({ points }: { points: VisitPoint[] }) {
  if (points.length === 0) return null;
  const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const avgLng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  const maxCount = Math.max(1, ...points.map((p) => p.count));

  return (
    <MapContainer
      center={[avgLat, avgLng]}
      zoom={2}
      scrollWheelZoom={false}
      touchZoom
      doubleClickZoom
      className="h-[420px] w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {points.map((p) => {
        const r = 4 + (p.count / maxCount) * 16;
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={r}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#ef4444",
              fillOpacity: 0.55,
              weight: 1.5,
            }}
          >
            <Tooltip direction="top">
              <div className="text-xs">
                <div className="font-semibold">
                  {[p.city, p.country].filter(Boolean).join(", ") || "—"}
                </div>
                <div>{p.count} visite(s)</div>
                {p.ip && <div className="text-gray-500">{p.ip}</div>}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
