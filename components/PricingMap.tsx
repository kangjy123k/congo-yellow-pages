"use client";

import { MapContainer, TileLayer, Polygon, Polyline, Marker, Tooltip, useMap, CircleMarker } from "react-leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import L, { type LatLngBoundsExpression, type PathOptions } from "leaflet";
import {
  COMMUNES,
  KINSHASA_CENTER,
  organicFromRect,
  priceColor,
  type CommunePrice,
  type LatLng,
  type StreetPrice,
} from "@/lib/pricing-data";
import {
  ROCADE_SEGMENTS,
  ROCADE_NORTH_START,
  ROCADE_SOUTH_JUNCTION,
  ROCADE_RN1_END,
  ROCADE_PONT_NDJILI,
} from "@/lib/rocade-data";
import "leaflet/dist/leaflet.css";

type Props =
  | { mode: "city" }
  | { mode: "commune"; commune: CommunePrice };

const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, bounds]);
  return null;
}

function priceBadgeIcon(price: number, size: "sm" | "md" = "md"): L.DivIcon {
  const color = priceColor(price);
  const scale = size === "sm" ? 0.85 : 1;
  const html = `
    <div class="price-badge" style="--badge-color:${color}; transform: scale(${scale});">
      <span class="price-badge__amount">$${price}</span>
      <span class="price-badge__unit">/m²</span>
    </div>`;
  return L.divIcon({
    className: "price-badge-wrapper",
    html,
    iconSize: [80, 32],
    iconAnchor: [40, 16],
  });
}

function nameLabelIcon(name: string): L.DivIcon {
  return L.divIcon({
    className: "commune-name-wrapper",
    html: `<div class="commune-name">${name}</div>`,
    iconSize: [100, 16],
    iconAnchor: [50, 32],
  });
}

export default function PricingMap(props: Props) {
  const router = useRouter();

  if (props.mode === "commune") {
    return <CommuneView commune={props.commune} />;
  }

  return <CityView onSelect={(slug) => router.push(`/prices/${slug}`)} />;
}

function CityView({ onSelect }: { onSelect: (slug: string) => void }) {
  const shapes = useMemo(
    () =>
      COMMUNES.map((c) => ({
        commune: c,
        polygon: organicFromRect(c.bounds, c.slug),
      })),
    []
  );

  return (
    <MapContainer
      center={KINSHASA_CENTER}
      zoom={11}
      scrollWheelZoom
      className="h-[640px] w-full rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
    >
      <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
      {shapes.map(({ commune: c, polygon }) => {
        const clickable = !!c.streets?.length;
        const color = priceColor(c.pricePerSqm);
        const base: PathOptions = {
          color,
          weight: clickable ? 2.5 : 1.5,
          fillColor: color,
          fillOpacity: clickable ? 0.45 : 0.22,
          opacity: 0.95,
        };
        return (
          <Polygon
            key={c.slug}
            positions={polygon}
            pathOptions={base}
            eventHandlers={{
              mouseover: (e) => {
                (e.target as L.Path).setStyle({
                  fillOpacity: 0.7,
                  weight: 3.5,
                });
                (e.target as L.Path).bringToFront();
              },
              mouseout: (e) => (e.target as L.Path).setStyle(base),
              click: () => {
                if (clickable) onSelect(c.slug);
              },
            }}
          >
            <Tooltip direction="top" sticky className="price-tooltip">
              <div className="ttip">
                <div className="ttip__name">{c.name}</div>
                <div className="ttip__price">
                  <strong>${c.pricePerSqm}</strong>
                  <span>/m²</span>
                </div>
                {clickable && <div className="ttip__hint">Cliquer pour détails →</div>}
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
      {shapes.map(({ commune: c }) => (
        <Marker
          key={`badge-${c.slug}`}
          position={c.center}
          icon={priceBadgeIcon(c.pricePerSqm, c.streets?.length ? "md" : "sm")}
          interactive={false}
        />
      ))}
      <RocadeOverlay />
    </MapContainer>
  );
}

function RocadeOverlay() {
  return (
    <>
      {ROCADE_SEGMENTS.map((seg) => (
        <Polyline
          key={seg.id}
          positions={seg.coords}
          pathOptions={{
            color: seg.color,
            weight: 5,
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round",
          }}
        >
          <Tooltip direction="top" sticky className="price-tooltip">
            <div className="ttip">
              <div className="ttip__name">{seg.name}</div>
              <div className="ttip__hint">Tracé ACGT · ~65 % avancé</div>
            </div>
          </Tooltip>
        </Polyline>
      ))}
      <CircleMarker
        center={ROCADE_NORTH_START}
        radius={6}
        pathOptions={{ color: "#111827", fillColor: "#fbbf24", fillOpacity: 1, weight: 2 }}
      >
        <Tooltip direction="top">Rond-Point Pompage (départ Nord)</Tooltip>
      </CircleMarker>
      <CircleMarker
        center={ROCADE_SOUTH_JUNCTION}
        radius={7}
        pathOptions={{ color: "#111827", fillColor: "#fbbf24", fillOpacity: 1, weight: 2 }}
      >
        <Tooltip direction="top">Mitendi / Maela — jonction SW / SE</Tooltip>
      </CircleMarker>
      <CircleMarker
        center={ROCADE_PONT_NDJILI}
        radius={6}
        pathOptions={{ color: "#111827", fillColor: "#3b82f6", fillOpacity: 1, weight: 2 }}
      >
        <Tooltip direction="top">Pont Ndjili (Route SEROMAF)</Tooltip>
      </CircleMarker>
      <CircleMarker
        center={ROCADE_RN1_END}
        radius={6}
        pathOptions={{ color: "#111827", fillColor: "#22c55e", fillOpacity: 1, weight: 2 }}
      >
        <Tooltip direction="top">Raccordement RN1 (Av. Lumumba)</Tooltip>
      </CircleMarker>
    </>
  );
}

function CommuneView({ commune }: { commune: CommunePrice }) {
  const outline = useMemo(() => organicFromRect(commune.bounds, commune.slug), [commune]);
  const streets = useMemo(
    () =>
      (commune.streets ?? []).map((s) => ({
        street: s,
        polygon: organicFromRect(s.coords, `${commune.slug}-${s.name}`, 12),
        center: polygonCenter(s.coords),
      })),
    [commune]
  );

  return (
    <MapContainer
      center={commune.center}
      zoom={14}
      scrollWheelZoom
      className="h-[640px] w-full rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
    >
      <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
      <FitBounds bounds={outline as LatLngBoundsExpression} />
      <Polygon
        positions={outline}
        pathOptions={{
          color: "#1f2937",
          weight: 3,
          fillOpacity: 0.04,
          dashArray: "6 6",
        }}
      />
      {streets.map(({ street, polygon }) => {
        const color = priceColor(street.pricePerSqm);
        const base: PathOptions = {
          color,
          weight: 2.5,
          fillColor: color,
          fillOpacity: 0.55,
          opacity: 0.95,
        };
        return (
          <Polygon
            key={street.name}
            positions={polygon}
            pathOptions={base}
            eventHandlers={{
              mouseover: (e) =>
                (e.target as L.Path).setStyle({ fillOpacity: 0.8, weight: 3.5 }),
              mouseout: (e) => (e.target as L.Path).setStyle(base),
            }}
          >
            <Tooltip direction="top" sticky className="price-tooltip">
              <div className="ttip">
                <div className="ttip__name">{street.name}</div>
                <div className="ttip__price">
                  <strong>${street.pricePerSqm}</strong>
                  <span>/m²</span>
                </div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
      {streets.map(({ street, center }) => (
        <Marker
          key={`b-${street.name}`}
          position={center}
          icon={priceBadgeIcon(street.pricePerSqm, "sm")}
          interactive={false}
        />
      ))}
      {streets.map(({ street, center }) => (
        <Marker
          key={`n-${street.name}`}
          position={center}
          icon={nameLabelIcon(street.name)}
          interactive={false}
        />
      ))}
    </MapContainer>
  );
}

function polygonCenter(pts: LatLng[]): LatLng {
  const lat = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const lng = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [lat, lng];
}
