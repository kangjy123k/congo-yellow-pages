import type { LatLng } from "./pricing-data";

/**
 * Rocade de Kinshasa — tracé approximatif basé sur les rapports publics
 * (Radio Okapi, ACGT, Présidence RDC, 2024-2026).
 *
 * IMPORTANT : ce tracé est une approximation pédagogique. Les coordonnées
 * réelles d'ingénierie ne sont pas publiées. Utilisé pour visualisation
 * indicative uniquement.
 *
 * Points de passage publics : Mbudi → Lutendele → Mitendi → Kimwenza Gare
 *   → (échangeur 3 niveaux) → Ndjili Brasserie → Kimbanseke → Av. Ndjoko
 *   → Aéroport N'Djili (RN1)
 *
 * Communes traversées : Mont-Ngafula, Kimbanseke, N'Djili, N'Sele
 * Longueur : ~63–70 km
 * Avancement : ~65 % (avril 2026)
 */

export type RocadeSegment = {
  id: string;
  name: string;
  status: "under_construction" | "planned" | "done";
  coords: LatLng[];
};

export const ROCADE_SW: LatLng[] = [
  [-4.420, 15.183], // Mbudi (départ SW)
  [-4.432, 15.198], // Lutendele
  [-4.448, 15.218], // Mitendi
  [-4.462, 15.245], // Bralima / route Caravane
  [-4.470, 15.275], // Kimwenza Gare (sud)
  [-4.470, 15.305], // virage est, approche du nœud
  [-4.462, 15.328], // arrivée à l'échangeur
];

export const ROCADE_SE: LatLng[] = [
  [-4.462, 15.328], // échangeur 3 niveaux
  [-4.450, 15.355], // Riflar / Rail
  [-4.430, 15.380], // Ndjili Brasserie
  [-4.418, 15.405], // Cecomaf (Kimbanseke)
  [-4.405, 15.428], // Buma / Av. Ndjoko
  [-4.390, 15.440], // approche RN1
  [-4.385, 15.444], // Aéroport N'Djili (RN1)
];

export const ROCADE_INTERCHANGE: LatLng = [-4.462, 15.328];
export const ROCADE_AIRPORT: LatLng = [-4.385, 15.444];
export const ROCADE_MBUDI: LatLng = [-4.420, 15.183];

export const ROCADE_SEGMENTS: RocadeSegment[] = [
  {
    id: "sw",
    name: "Rocade Sud-Ouest",
    status: "under_construction",
    coords: ROCADE_SW,
  },
  {
    id: "se",
    name: "Rocade Sud-Est",
    status: "under_construction",
    coords: ROCADE_SE,
  },
];

export const ROCADE_INFO = {
  totalKm: "~63 km",
  progress: "~65%",
  startedYear: 2024,
  expectedCompletion: "2027–2028",
  communes: ["Mont-Ngafula", "Kimbanseke", "N'Djili", "N'Sele"],
};
