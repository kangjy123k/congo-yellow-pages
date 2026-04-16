export const PRODUCT_CATEGORIES: Record<string, string[]> = {
  "Matériaux BTP": ["Matériaux", "Outils", "Équipements électriques", "Engins"],
  "Meubles & Déco": ["Matériaux de finition", "Meubles"],
  "Énergie & Stockage": ["Panneaux solaires", "Batteries de stockage", "Onduleurs"],
};

export const SERVICE_CATEGORIES = ["Construction", "Rénovation", "Route", "Travaux spéciaux"];

export const INVENTORY_TYPES = [
  { value: "local", label: "Stock local" },
  { value: "china", label: "Livraison depuis la Chine" },
];

export const LISTING_TYPES = [
  { value: "sell", label: "Vente" },
  { value: "rent", label: "Location" },
  { value: "both", label: "Vente & Location" },
];

export const RENTAL_TYPES = [
  { value: "lessor", label: "Bailleur" },
  { value: "lessee", label: "Locataire" },
];

export const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/products?main=Matériaux BTP", label: "Matériaux" },
  { href: "/products?main=Meubles %26 Déco", label: "Meubles" },
  { href: "/products?main=Énergie %26 Stockage", label: "Énergie" },
  { href: "/services", label: "Prestataires" },
  { href: "/rental", label: "Immobilier" },
  { href: "/prices", label: "Prix immobilier" },
  { href: "/projects", label: "Appels d'offres" },
];

export const DEMAND_CATEGORIES = [
  "Matériaux BTP",
  "Matériaux déco",
  "Meubles & Déco",
  "Équipements énergétiques",
  "Services travaux",
  "Location d'équipements",
  "Autre",
];
