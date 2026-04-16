import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Congo BTP Directory — Pages Jaunes RDC",
    short_name: "Congo BTP",
    description:
      "Pages Jaunes BTP en RDC — Matériaux, Meubles, Énergie, Prestataires, Appels d'offres.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#eab308",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Prix immobilier", short_name: "Prix", url: "/prices" },
      { name: "Déposer un besoin", short_name: "Besoin", url: "/demand/new" },
      { name: "Prestataires", short_name: "Services", url: "/services" },
    ],
  };
}
