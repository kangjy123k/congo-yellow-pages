import * as turf from "@turf/turf";
import { readFileSync, writeFileSync } from "node:fs";

// Hand-crafted Kinshasa "land mass" polygon: south of Congo River +
// Pool Malebo, covering all 24 communes.
// Coordinates [lng, lat] for GeoJSON.
// Northern edge follows the south bank of the Congo River as best as I
// can estimate; a buffer is left to be safe.
// Land mass polygon — counter-clockwise outer ring, south of Congo River.
// Top edge follows the South bank of the river and Pool Malebo.
// Sized to fully contain Maluku (largest commune) which extends to
// lat -5.03 and lng 16.52.
const LAND_MASK = turf.polygon([[
  // SW corner — well south & west of Mont-Ngafula
  [15.130, -5.100],
  // South edge east (well south of Maluku)
  [15.500, -5.100],
  [16.000, -5.100],
  [16.600, -5.100],
  // East edge north (well east of Maluku)
  [16.600, -4.300],
  [16.600, -4.000],
  // NE corner — start following river south bank
  // Maluku river bank approx (eastern stretch)
  [16.300, -4.020],
  [16.000, -4.060],
  [15.850, -4.110],
  // Pool Malebo north reaches around here
  [15.770, -4.180],
  [15.720, -4.180],
  [15.670, -4.185],
  [15.625, -4.195],
  [15.585, -4.210],
  // Pool Malebo central south bank
  [15.555, -4.225],
  [15.525, -4.245],
  [15.500, -4.265],
  [15.475, -4.282],
  [15.450, -4.292],
  [15.425, -4.300],
  [15.400, -4.305],
  [15.375, -4.305],
  [15.350, -4.305],
  [15.330, -4.302],
  // Gombe N edge — river bends sharp here
  [15.315, -4.298],
  [15.300, -4.295],
  [15.285, -4.293],
  // Gombe NW corner — river starts going SW
  [15.272, -4.302],
  [15.262, -4.318],
  // West along river going SW
  [15.250, -4.345],
  [15.235, -4.370],
  [15.215, -4.395],
  [15.195, -4.420],
  [15.175, -4.450],
  // West edge south
  [15.150, -4.700],
  [15.130, -4.900],
  [15.130, -5.100],
]]);

const data = JSON.parse(readFileSync("/tmp/communes_simplified.json", "utf8"));
const out = {};
for (const [name, pts] of Object.entries(data)) {
  // Pts are [lat, lng]; turf needs [lng, lat]
  const ring = pts.map(([lat, lng]) => [lng, lat]);
  // Close ring if not closed
  if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) {
    ring.push(ring[0]);
  }
  let communePoly;
  try {
    communePoly = turf.polygon([ring]);
  } catch (e) {
    console.error(`✗ ${name}: invalid polygon — keeping original`);
    out[name] = pts;
    continue;
  }
  let clipped;
  try {
    clipped = turf.intersect(turf.featureCollection([LAND_MASK, communePoly]));
  } catch (e) {
    console.error(`✗ ${name}: intersect threw — keeping original`, e.message);
    out[name] = pts;
    continue;
  }
  if (!clipped) {
    console.error(`✗ ${name}: clipped is null — keeping original`);
    out[name] = pts;
    continue;
  }
  // Take outer ring of largest polygon
  const geom = clipped.geometry;
  let outerRing;
  if (geom.type === "Polygon") {
    outerRing = geom.coordinates[0];
  } else if (geom.type === "MultiPolygon") {
    // pick largest by area
    outerRing = geom.coordinates
      .map((p) => ({ ring: p[0], area: turf.area(turf.polygon(p)) }))
      .sort((a, b) => b.area - a.area)[0].ring;
  } else {
    out[name] = pts;
    continue;
  }
  // Convert back to [lat, lng], simplify to ~80 points max
  let cleaned = outerRing.map(([lng, lat]) => [lat, lng]);
  // Drop closing duplicate
  if (cleaned.length > 1 && cleaned[0][0] === cleaned[cleaned.length-1][0] && cleaned[0][1] === cleaned[cleaned.length-1][1]) {
    cleaned = cleaned.slice(0, -1);
  }
  if (cleaned.length > 80) {
    const step = (cleaned.length - 1) / 79;
    cleaned = Array.from({ length: 80 }, (_, i) => cleaned[Math.round(i * step)]);
  }
  out[name] = cleaned;
  console.log(`✓ ${name}: ${pts.length} → ${cleaned.length} pts`);
}

writeFileSync("/tmp/communes_clipped.json", JSON.stringify(out, null, 2));
console.log(`\nSaved ${Object.keys(out).length} clipped communes`);
