import type { LatLng } from "./pricing-data";

/**
 * Rocade de Kinshasa — tracé corrigé d'après la carte officielle ACGT
 * (carte 2025, source utilisateur).
 *
 * Deux branches distinctes :
 *   • Rocade Sud-Ouest (rouge) : Rond-Point Pompage (Nord) → Mitendi (Sud).
 *     Axe nord-sud le long de l'ouest de Kinshasa.
 *   • Rocade Sud-Est (vert) : Mitendi → Kimwenza Gare → Pont Ndjili →
 *     raccordement RN1 (Av. Lumumba à Ndjili).
 *
 * Communes traversées : Mont-Ngafula, Selembao, Kisenso, Kimbanseke, N'Djili.
 * Longueur : ~63 km cumulés.
 * Avancement : ~65 % (avril 2026).
 *
 * Coordonnées approximées à partir de la carte ACGT ; toponymes : Pompage,
 * Lutendele, Kimwala, Bifurcation 1/2/3, Village, Maela, Bemseke,
 * Kimwenza Gare, Pont Ndjili, Route SEROMAF, Av. Lumumba (entrée Ndjoko).
 */

export type RocadeSegment = {
  id: string;
  name: string;
  status: "under_construction" | "planned" | "done";
  color: string;
  coords: LatLng[];
};

// SW — du Nord (Pompage) vers le Sud (Mitendi/Maela), le long du fleuve
export const ROCADE_SW: LatLng[] = [
  [-4.302, 15.258], // Rond-Point Pompage (départ Nord)
  [-4.315, 15.250], // sortie sud du rond-point
  [-4.330, 15.241], // Entrée Lutendele
  [-4.350, 15.232], // Kimwala (Bifurcation 1)
  [-4.370, 15.222], // Bifurcation 2
  [-4.388, 15.215], // Bifurcation 3
  [-4.408, 15.210], // Village 1
  [-4.428, 15.210], // Village 2 (descente sud)
  [-4.443, 15.215], // Sortie Mitendi N1 (Maela)
];

// SE — de Mitendi vers l'est puis nord pour rejoindre la RN1 (Lumumba/Ndjili)
export const ROCADE_SE: LatLng[] = [
  [-4.443, 15.215], // jonction avec SW à Mitendi
  [-4.450, 15.230], // Bemseke
  [-4.458, 15.250], // By-Pass
  [-4.462, 15.272], // Kimwenza Gare
  [-4.455, 15.305], // sud de Kisenso
  [-4.448, 15.345], // sud de Kimbanseke
  [-4.435, 15.385], // Pont Ndjili (Route SEROMAF)
  [-4.420, 15.400], // remontée nord
  [-4.405, 15.405], // Entrée Ndjoko
  [-4.392, 15.408], // raccord RN1 (Av. Lumumba)
];

export const ROCADE_NORTH_START: LatLng = [-4.302, 15.258]; // Rond-Point Pompage
export const ROCADE_SOUTH_JUNCTION: LatLng = [-4.443, 15.215]; // Mitendi (jonction SW/SE)
export const ROCADE_RN1_END: LatLng = [-4.392, 15.408]; // raccordement RN1
export const ROCADE_PONT_NDJILI: LatLng = [-4.435, 15.385];

export const ROCADE_SEGMENTS: RocadeSegment[] = [
  { id: "sw", name: "Rocade Sud-Ouest", status: "under_construction", color: "#dc2626", coords: ROCADE_SW },
  { id: "se", name: "Rocade Sud-Est", status: "under_construction", color: "#16a34a", coords: ROCADE_SE },
];

export const ROCADE_INFO = {
  totalKm: "~63 km",
  progress: "~65%",
  startedYear: 2024,
  expectedCompletion: "2027–2028",
  communes: ["Mont-Ngafula", "Selembao", "Kisenso", "Kimbanseke", "N'Djili"],
};
