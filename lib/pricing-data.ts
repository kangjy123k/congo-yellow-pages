export type LatLng = [number, number];

export type StreetPrice = {
  name: string;
  pricePerSqm: number;
  coords: LatLng[];
};

export type CommunePrice = {
  slug: string;
  name: string;
  pricePerSqm: number;
  center: LatLng;
  bounds: LatLng[];
  description?: string;
  streets?: StreetPrice[];
};

export const KINSHASA_CENTER: LatLng = [-4.34, 15.32];

function rect(lat: number, lng: number, dLat: number, dLng: number): LatLng[] {
  return [
    [lat - dLat, lng - dLng],
    [lat - dLat, lng + dLng],
    [lat + dLat, lng + dLng],
    [lat + dLat, lng - dLng],
  ];
}

export const COMMUNES: CommunePrice[] = [
  {
    slug: "gombe",
    name: "Gombe",
    pricePerSqm: 2800,
    center: [-4.308, 15.295],
    bounds: rect(-4.308, 15.295, 0.020, 0.035),
    description: "Centre d'affaires et diplomatique, le quartier le plus prisé de Kinshasa.",
    streets: [
      {
        name: "Boulevard du 30 Juin",
        pricePerSqm: 3500,
        coords: rect(-4.308, 15.29, 0.002, 0.012),
      },
      {
        name: "Avenue Batetela",
        pricePerSqm: 3100,
        coords: rect(-4.3, 15.28, 0.003, 0.006),
      },
      {
        name: "Avenue Colonel Mondjiba",
        pricePerSqm: 2600,
        coords: rect(-4.31, 15.275, 0.003, 0.006),
      },
      {
        name: "Avenue Wagenia",
        pricePerSqm: 2400,
        coords: rect(-4.302, 15.298, 0.002, 0.005),
      },
    ],
  },
  {
    slug: "ngaliema",
    name: "Ngaliema",
    pricePerSqm: 1800,
    center: [-4.345, 15.24],
    bounds: rect(-4.345, 15.24, 0.035, 0.04),
    description: "Quartiers résidentiels haut de gamme à l'ouest, avec vue sur le fleuve.",
    streets: [
      {
        name: "Avenue Ma Campagne",
        pricePerSqm: 2200,
        coords: rect(-4.34, 15.255, 0.004, 0.008),
      },
      {
        name: "Avenue des Cliniques (Binza)",
        pricePerSqm: 1900,
        coords: rect(-4.35, 15.23, 0.004, 0.008),
      },
      {
        name: "Avenue Mikonga (Mont-Fleury)",
        pricePerSqm: 1500,
        coords: rect(-4.36, 15.22, 0.004, 0.008),
      },
    ],
  },
  {
    slug: "limete",
    name: "Limete",
    pricePerSqm: 1000,
    center: [-4.355, 15.340],
    bounds: rect(-4.355, 15.340, 0.030, 0.030),
    description: "Zone industrielle et résidentielle mixte à l'est.",
    streets: [
      {
        name: "Boulevard Lumumba",
        pricePerSqm: 1400,
        coords: rect(-4.355, 15.34, 0.005, 0.003),
      },
      {
        name: "Route des Poids Lourds",
        pricePerSqm: 900,
        coords: rect(-4.365, 15.33, 0.004, 0.008),
      },
      {
        name: "7e Rue Limete Industriel",
        pricePerSqm: 800,
        coords: rect(-4.345, 15.325, 0.003, 0.006),
      },
    ],
  },
  {
    slug: "lemba",
    name: "Lemba",
    pricePerSqm: 550,
    center: [-4.385, 15.31],
    bounds: rect(-4.385, 15.31, 0.02, 0.02),
    description: "Quartier universitaire et résidentiel moyen de gamme.",
    streets: [
      {
        name: "Avenue de l'Université",
        pricePerSqm: 750,
        coords: rect(-4.38, 15.305, 0.004, 0.006),
      },
      {
        name: "Avenue Kwango",
        pricePerSqm: 500,
        coords: rect(-4.39, 15.315, 0.003, 0.006),
      },
      {
        name: "Avenue Livulu",
        pricePerSqm: 420,
        coords: rect(-4.395, 15.3, 0.003, 0.005),
      },
    ],
  },
  {
    slug: "masina",
    name: "Masina",
    pricePerSqm: 280,
    center: [-4.405, 15.39],
    bounds: rect(-4.405, 15.39, 0.025, 0.035),
    description: "Grande commune populaire à l'est, forte densité.",
    streets: [
      {
        name: "Boulevard Lumumba (Masina)",
        pricePerSqm: 400,
        coords: rect(-4.4, 15.385, 0.005, 0.004),
      },
      {
        name: "Avenue Mobuto (Sans Fil)",
        pricePerSqm: 250,
        coords: rect(-4.41, 15.395, 0.004, 0.008),
      },
      {
        name: "Quartier Petro-Congo",
        pricePerSqm: 220,
        coords: rect(-4.415, 15.38, 0.004, 0.008),
      },
    ],
  },
  { slug: "kinshasa", name: "Kinshasa", pricePerSqm: 900, center: [-4.322, 15.310], bounds: rect(-4.322, 15.310, 0.012, 0.015) },
  { slug: "barumbu", name: "Barumbu", pricePerSqm: 700, center: [-4.325, 15.320], bounds: rect(-4.325, 15.320, 0.010, 0.012) },
  { slug: "lingwala", name: "Lingwala", pricePerSqm: 800, center: [-4.328, 15.298], bounds: rect(-4.328, 15.298, 0.012, 0.015) },
  { slug: "kintambo", name: "Kintambo", pricePerSqm: 1300, center: [-4.315, 15.270], bounds: rect(-4.315, 15.270, 0.013, 0.018) },
  { slug: "bandalungwa", name: "Bandalungwa", pricePerSqm: 900, center: [-4.335, 15.282], bounds: rect(-4.335, 15.282, 0.010, 0.015) },
  { slug: "kasa-vubu", name: "Kasa-Vubu", pricePerSqm: 750, center: [-4.342, 15.282], bounds: rect(-4.342, 15.282, 0.010, 0.015) },
  { slug: "kalamu", name: "Kalamu", pricePerSqm: 700, center: [-4.351, 15.300], bounds: rect(-4.351, 15.300, 0.012, 0.015) },
  { slug: "ngiri-ngiri", name: "Ngiri-Ngiri", pricePerSqm: 650, center: [-4.355, 15.29], bounds: rect(-4.355, 15.29, 0.008, 0.01) },
  { slug: "bumbu", name: "Bumbu", pricePerSqm: 400, center: [-4.375, 15.285], bounds: rect(-4.375, 15.285, 0.012, 0.012) },
  { slug: "makala", name: "Makala", pricePerSqm: 350, center: [-4.395, 15.285], bounds: rect(-4.395, 15.285, 0.012, 0.012) },
  { slug: "selembao", name: "Selembao", pricePerSqm: 380, center: [-4.385, 15.27], bounds: rect(-4.385, 15.27, 0.015, 0.015) },
  { slug: "mont-ngafula", name: "Mont-Ngafula", pricePerSqm: 600, center: [-4.45, 15.26], bounds: rect(-4.45, 15.26, 0.05, 0.05) },
  { slug: "ngaba", name: "Ngaba", pricePerSqm: 450, center: [-4.4, 15.305], bounds: rect(-4.4, 15.305, 0.008, 0.01) },
  { slug: "matete", name: "Matete", pricePerSqm: 500, center: [-4.385, 15.335], bounds: rect(-4.385, 15.335, 0.01, 0.012) },
  { slug: "kisenso", name: "Kisenso", pricePerSqm: 300, center: [-4.415, 15.335], bounds: rect(-4.415, 15.335, 0.015, 0.015) },
  { slug: "ndjili", name: "Ndjili", pricePerSqm: 400, center: [-4.4, 15.37], bounds: rect(-4.4, 15.37, 0.015, 0.015) },
  { slug: "kimbanseke", name: "Kimbanseke", pricePerSqm: 220, center: [-4.43, 15.43], bounds: rect(-4.43, 15.43, 0.03, 0.04) },
  { slug: "nsele", name: "N'Sele", pricePerSqm: 180, center: [-4.4, 15.55], bounds: rect(-4.4, 15.55, 0.05, 0.08) },
  { slug: "maluku", name: "Maluku", pricePerSqm: 120, center: [-4.45, 15.72], bounds: rect(-4.45, 15.72, 0.08, 0.12) },
];

export function getCommune(slug: string): CommunePrice | undefined {
  return COMMUNES.find((c) => c.slug === slug);
}

export function priceColor(price: number): string {
  if (price >= 2000) return "#dc2626";
  if (price >= 1200) return "#f97316";
  if (price >= 800) return "#f59e0b";
  if (price >= 500) return "#eab308";
  if (price >= 300) return "#84cc16";
  return "#22c55e";
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function bboxFromRect(rect: LatLng[]): {
  center: LatLng;
  dLat: number;
  dLng: number;
} {
  const lats = rect.map((p) => p[0]);
  const lngs = rect.map((p) => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2],
    dLat: (maxLat - minLat) / 2,
    dLng: (maxLng - minLng) / 2,
  };
}

export function organicPolygon(
  center: LatLng,
  dLat: number,
  dLng: number,
  seed: string,
  points = 16
): LatLng[] {
  const rand = mulberry32(hashSeed(seed));
  const [lat, lng] = center;
  const coords: LatLng[] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const jitter = 0.72 + rand() * 0.48;
    coords.push([
      lat + Math.sin(angle) * dLat * jitter,
      lng + Math.cos(angle) * dLng * jitter,
    ]);
  }
  return coords;
}

export function organicFromRect(rect: LatLng[], seed: string, points = 16): LatLng[] {
  const b = bboxFromRect(rect);
  return organicPolygon(b.center, b.dLat, b.dLng, seed, points);
}
