import type { LatLng } from "./pricing-data";

/**
 * Principales artères de Kinshasa — coordonnées approximées.
 * Servent uniquement de repères visuels sur la carte des prix.
 */

export type MajorRoad = {
  id: string;
  name: string;
  coords: LatLng[];
};

export const MAJOR_ROADS: MajorRoad[] = [
  {
    id: "bd-30-juin",
    name: "Boulevard du 30 Juin",
    coords: [
      [-4.305, 15.270], // ouest (Limete bord)
      [-4.305, 15.280], // Place de l'Indépendance
      [-4.302, 15.290], // SOZACOM / centre Gombe
      [-4.301, 15.300], // Hôtel du Gouvernement
      [-4.302, 15.310], // est, vers pont
    ],
  },
  {
    id: "av-24-novembre",
    name: "Avenue du 24 Novembre",
    coords: [
      [-4.310, 15.293], // nord, Bandal
      [-4.322, 15.295],
      [-4.335, 15.297],
      [-4.348, 15.299], // sud, Kasa-Vubu
    ],
  },
  {
    id: "bd-lumumba",
    name: "Boulevard Lumumba",
    coords: [
      [-4.320, 15.310], // Gombe est
      [-4.340, 15.330], // Limete
      [-4.360, 15.355], // Matete
      [-4.385, 15.385], // Masina
      [-4.395, 15.420], // Ndjili
      [-4.388, 15.443], // Aéroport
    ],
  },
  {
    id: "av-kasa-vubu",
    name: "Avenue Kasa-Vubu",
    coords: [
      [-4.305, 15.288], // nord
      [-4.325, 15.291],
      [-4.348, 15.295], // Kasa-Vubu
      [-4.365, 15.297],
    ],
  },
  {
    id: "av-tshatshi",
    name: "Avenue Colonel Tshatshi",
    coords: [
      [-4.295, 15.286], // Gombe nord
      [-4.305, 15.290],
      [-4.315, 15.293],
    ],
  },
  {
    id: "av-wagenia",
    name: "Avenue Wagenia",
    coords: [
      [-4.298, 15.293],
      [-4.305, 15.300],
      [-4.312, 15.306],
    ],
  },
  {
    id: "bd-sendwe",
    name: "Boulevard Sendwe",
    coords: [
      [-4.345, 15.305], // Kalamu
      [-4.360, 15.315],
      [-4.378, 15.328], // Lemba
    ],
  },
  {
    id: "av-liberation",
    name: "Avenue de la Libération",
    coords: [
      [-4.340, 15.328], // Limete N
      [-4.358, 15.334],
      [-4.380, 15.338], // Matete
    ],
  },
  {
    id: "av-batetela",
    name: "Avenue Batetela",
    coords: [
      [-4.297, 15.282],
      [-4.302, 15.286],
      [-4.308, 15.290],
    ],
  },
  {
    id: "rn1-matadi",
    name: "Route Nationale 1 (Matadi)",
    coords: [
      [-4.420, 15.215], // Mitendi
      [-4.395, 15.215],
      [-4.380, 15.225],
      [-4.365, 15.245], // Selembao
    ],
  },
];
