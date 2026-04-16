import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function imgs(tags: string, lock: number, count = 1): string {
  const urls = Array.from({ length: count }).map((_, i) =>
    `https://loremflickr.com/800/600/${encodeURIComponent(tags)}?lock=${lock + i}`
  );
  return JSON.stringify(urls);
}

async function main() {
  console.log("→ seed: wiping existing data");
  await prisma.demand.deleteMany();
  await prisma.project.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const pwd = await bcrypt.hash("demo1234", 10);

  console.log("→ seed: creating users");
  const [admin, u1, u2, u3, u4, u5, u6] = await Promise.all([
    prisma.user.create({ data: { name: "Admin", email: "admin@demo.cd", phone: "+243 810 000 001", password: pwd, role: "admin", status: "approved" } }),
    prisma.user.create({ data: { name: "Kin Matériaux Pro", email: "kinmat@demo.cd", phone: "+243 810 111 111", password: pwd, role: "merchant", status: "approved" } }),
    prisma.user.create({ data: { name: "Gombe Furniture Store", email: "gombe@demo.cd", phone: "+243 810 222 222", password: pwd, role: "merchant", status: "approved" } }),
    prisma.user.create({ data: { name: "Solaire Congo", email: "solar@demo.cd", phone: "+243 810 333 333", password: pwd, role: "merchant", status: "approved" } }),
    prisma.user.create({ data: { name: "BTP Ngaliema", email: "btpng@demo.cd", phone: "+243 810 444 444", password: pwd, role: "merchant", status: "approved" } }),
    prisma.user.create({ data: { name: "Sun Yat Logistics", email: "logistics@demo.cd", phone: "+243 810 555 555", password: pwd, role: "merchant", status: "approved" } }),
    prisma.user.create({ data: { name: "En attente Ltd", email: "pending@demo.cd", phone: "+243 810 666 666", password: pwd, role: "merchant", status: "pending" } }),
  ]);
  void admin;
  void u6;

  console.log("→ seed: creating products");
  const products: Array<Parameters<typeof prisma.product.create>[0]["data"]> = [
    { title: "Ciment Simba 42.5R (sac 50kg)", description: "Ciment portland haute résistance, palette de 40 sacs.", price: 14, priceUnit: "sac", category: "Matériaux", mainCategory: "Matériaux BTP", listingType: "sell", inventoryType: "local", contact: "+243 810 111 111", location: "Gombe", isFeatured: true, images: imgs("cement,bag", 101, 2), userId: u1.id },
    { title: "Fer à béton Ø12mm (barre 12m)", description: "Fer tor HA400, origine Turquie/Chine.", price: 9.5, priceUnit: "barre", category: "Matériaux", mainCategory: "Matériaux BTP", listingType: "sell", inventoryType: "local", contact: "+243 810 111 111", location: "Limete", images: imgs("rebar,steel", 110, 1), userId: u1.id },
    { title: "Brique creuse 20×20×40", description: "Brique standard construction mur porteur.", price: 0.6, priceUnit: "pièce", category: "Matériaux", mainCategory: "Matériaux BTP", listingType: "sell", inventoryType: "local", contact: "+243 810 111 111", location: "Kinshasa", images: imgs("brick,wall", 115, 1), userId: u1.id },
    { title: "Perceuse à percussion Bosch GSB 550W", description: "Perceuse filaire professionnelle, avec mandrin auto.", price: 85, priceUnit: "unité", category: "Outils", mainCategory: "Matériaux BTP", listingType: "sell", inventoryType: "china", contact: "+243 810 111 111", isFeatured: true, images: imgs("drill,tool", 120, 2), userId: u1.id },
    { title: "Échafaudage modulaire 2×3m", description: "Jeu complet avec plateforme, location journalière.", price: 25, priceUnit: "jour", category: "Outils", mainCategory: "Matériaux BTP", listingType: "rent", inventoryType: "local", contact: "+243 810 111 111", images: imgs("scaffolding,construction", 130, 1), userId: u4.id },
    { title: "Générateur diesel Cummins 100kVA", description: "Groupe électrogène triphasé, insonorisé, état neuf.", price: 18500, priceUnit: "unité", category: "Équipements électriques", mainCategory: "Matériaux BTP", listingType: "both", inventoryType: "local", contact: "+243 810 444 444", location: "Ngaliema", images: imgs("generator,diesel", 135, 2), userId: u4.id },
    { title: "Pelle hydraulique Komatsu PC200", description: "Excavatrice 20t, 3500h, entretien récent.", price: 75000, priceUnit: "unité", category: "Engins", mainCategory: "Matériaux BTP", listingType: "sell", inventoryType: "local", contact: "+243 810 444 444", isFeatured: true, images: imgs("excavator,heavy-machinery", 140, 3), userId: u4.id },
    { title: "Bétonnière 350L", description: "Bétonnière électrique sur roues, 380V.", price: 65, priceUnit: "jour", category: "Engins", mainCategory: "Matériaux BTP", listingType: "rent", inventoryType: "local", contact: "+243 810 444 444", images: imgs("concrete-mixer", 145, 1), userId: u4.id },
    { title: "Carrelage grès cérame 60×60", description: "Carrelage intérieur/extérieur, rectifié, finition mate.", price: 12, priceUnit: "m²", category: "Matériaux de finition", mainCategory: "Meubles & Déco", listingType: "sell", inventoryType: "china", contact: "+243 810 222 222", images: imgs("tile,floor", 150, 1), userId: u2.id },
    { title: "Peinture murale acrylique 20L (blanc)", description: "Peinture haute couverture, lavable, sans odeur.", price: 48, priceUnit: "seau", category: "Matériaux de finition", mainCategory: "Meubles & Déco", listingType: "sell", inventoryType: "local", contact: "+243 810 222 222", images: imgs("paint,bucket", 155, 1), userId: u2.id },
    { title: "Canapé cuir 3 places (noir)", description: "Canapé moderne importé, cuir véritable, livraison Kinshasa.", price: 720, priceUnit: "unité", category: "Meubles", mainCategory: "Meubles & Déco", listingType: "sell", inventoryType: "china", contact: "+243 810 222 222", isFeatured: true, images: imgs("sofa,leather", 160, 2), userId: u2.id },
    { title: "Table à manger en bois massif 6 personnes", description: "Bois tropical, finition vernie, avec 6 chaises.", price: 450, priceUnit: "ensemble", category: "Meubles", mainCategory: "Meubles & Déco", listingType: "sell", inventoryType: "local", contact: "+243 810 222 222", images: imgs("dining-table,wood", 165, 1), userId: u2.id },
    { title: "Armoire 3 portes miroir", description: "Armoire blanche moderne, structure MDF, 240cm.", price: 320, priceUnit: "unité", category: "Meubles", mainCategory: "Meubles & Déco", listingType: "sell", inventoryType: "china", contact: "+243 810 222 222", images: imgs("wardrobe,closet", 170, 1), userId: u2.id },
    { title: "Panneau solaire 550W Longi mono", description: "Panneau monocristallin Tier 1, 25 ans garantie.", price: 135, priceUnit: "unité", category: "Panneaux solaires", mainCategory: "Énergie & Stockage", listingType: "sell", inventoryType: "china", contact: "+243 810 333 333", isFeatured: true, images: imgs("solar-panel", 175, 2), userId: u3.id },
    { title: "Batterie LiFePO4 200Ah 12V", description: "Batterie stockage solaire, 6000 cycles, BMS intégré.", price: 620, priceUnit: "unité", category: "Batteries de stockage", mainCategory: "Énergie & Stockage", listingType: "sell", inventoryType: "china", contact: "+243 810 333 333", images: imgs("battery,lithium", 180, 1), userId: u3.id },
    { title: "Onduleur hybride 5kW Deye", description: "Onduleur solaire hybride, réseau + batterie + PV.", price: 1250, priceUnit: "unité", category: "Onduleurs", mainCategory: "Énergie & Stockage", listingType: "sell", inventoryType: "china", contact: "+243 810 333 333", images: imgs("inverter,solar", 185, 1), userId: u3.id },
    { title: "Onduleur 3kW pur sinus", description: "Onduleur off-grid résidentiel, sortie 220V.", price: 580, priceUnit: "unité", category: "Onduleurs", mainCategory: "Énergie & Stockage", listingType: "sell", inventoryType: "local", contact: "+243 810 333 333", images: imgs("inverter,electronics", 190, 1), userId: u3.id },
  ];
  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log("→ seed: creating service providers");
  const services: Array<Parameters<typeof prisma.serviceProvider.create>[0]["data"]> = [
    { companyName: "BTP Kinshasa Construction", description: "Construction clé en main : villas, immeubles R+3, entrepôts. Équipe 40+ ouvriers qualifiés.", category: "Construction", phone: "+243 810 444 444", address: "Ngaliema, Av. Ma Campagne", experience: 12, isFeatured: true, images: imgs("construction-site,building", 200, 2), userId: u4.id },
    { companyName: "Finitions Pro Congo", description: "Rénovation intérieure haut de gamme : carrelage, peinture, plâtrerie, plomberie.", category: "Rénovation", phone: "+243 810 555 555", address: "Gombe", experience: 8, images: imgs("interior-renovation", 205, 1), userId: u5.id },
    { companyName: "Route & Terrassement SARL", description: "Travaux routiers, terrassement, assainissement. Parc d'engins : pelles, bulldozers, compacteurs.", category: "Route", phone: "+243 810 444 444", address: "Limete Industriel", experience: 15, isFeatured: true, images: imgs("road-construction,asphalt", 210, 2), userId: u4.id },
    { companyName: "Solaire Congo Installation", description: "Études, fourniture et pose de systèmes solaires résidentiels et commerciaux.", category: "Travaux spéciaux", phone: "+243 810 333 333", address: "Gombe, Bd du 30 Juin", experience: 6, images: imgs("solar-installation,roof", 215, 1), userId: u3.id },
    { companyName: "Kin Clim & Froid", description: "Installation et maintenance climatisation, chambres froides, ventilation.", category: "Travaux spéciaux", phone: "+243 810 555 555", address: "Bandalungwa", experience: 9, images: imgs("air-conditioning,hvac", 220, 1), userId: u5.id },
    { companyName: "Gombe Design Studio", description: "Architecture d'intérieur et décoration sur mesure.", category: "Rénovation", phone: "+243 810 222 222", address: "Gombe", experience: 5, images: imgs("interior-design,modern", 225, 1), userId: u2.id },
  ];
  for (const s of services) {
    await prisma.serviceProvider.create({ data: s });
  }

  console.log("→ seed: creating rentals");
  const rentals: Array<Parameters<typeof prisma.rental.create>[0]["data"]> = [
    { title: "Villa 4 chambres Gombe (meublée)", description: "Villa haut standing, piscine, générateur, 2 parkings. Quartier sécurisé.", type: "lessor", category: "Villa", price: 4500, priceUnit: "mois", contact: "+243 810 444 444", location: "Gombe, Av. Batetela", isFeatured: true, images: imgs("luxury-villa,pool", 300, 3), userId: u4.id },
    { title: "Appartement 2 chambres Ngaliema", description: "Appartement rénové, cuisine équipée, vue fleuve.", type: "lessor", category: "Appartement", price: 1800, priceUnit: "mois", contact: "+243 810 222 222", location: "Ngaliema, Ma Campagne", images: imgs("apartment,interior", 305, 2), userId: u2.id },
    { title: "Entrepôt 500m² Limete Industriel", description: "Entrepôt avec accès camion, bureaux, surface clôturée.", type: "lessor", category: "Entrepôt", price: 2800, priceUnit: "mois", contact: "+243 810 555 555", location: "Limete Industriel", images: imgs("warehouse,industrial", 310, 1), userId: u5.id },
    { title: "Recherche local commercial Gombe", description: "Entreprise chinoise cherche local 80-150m² en rez-de-chaussée pour showroom.", type: "lessee", category: "Local commercial", contact: "+243 810 111 111", location: "Gombe / Bd 30 Juin", images: imgs("shopfront,storefront", 315, 1), userId: u1.id },
    { title: "Studio meublé Bandalungwa", description: "Studio 35m² meublé, Wi-Fi inclus, court ou long terme.", type: "lessor", category: "Studio", price: 450, priceUnit: "mois", contact: "+243 810 555 555", location: "Bandalungwa", images: imgs("studio-apartment", 320, 1), userId: u5.id },
    { title: "Recherche villa 3+ chambres Ngaliema", description: "Famille expatriée cherche villa meublée avec jardin.", type: "lessee", category: "Villa", contact: "+243 810 333 333", location: "Ngaliema / Mont Fleury", images: imgs("house,garden", 325, 1), userId: u3.id },
  ];
  for (const r of rentals) {
    await prisma.rental.create({ data: r });
  }

  console.log("→ seed: creating projects");
  const projects: Array<Parameters<typeof prisma.project.create>[0]["data"]> = [
    { title: "Construction entrepôt 1200m² à Kinshasa", description: "Entrepôt logistique à Limete. Structure métallique, dalle béton, 6m hauteur.", category: "Construction", budget: 180000, budgetUnit: "USD", location: "Limete Industriel", deadline: "2026-09-30", contact: "+243 810 111 111", userId: u1.id },
    { title: "Rénovation villa R+1 Gombe", description: "Rénovation complète : carrelage, peinture, plomberie, électricité, cuisine, salles de bain.", category: "Rénovation", budget: 45000, budgetUnit: "USD", location: "Gombe", deadline: "2026-07-15", contact: "+243 810 444 444", userId: u4.id },
    { title: "Réfection route d'accès 2km", description: "Terrassement et bitumage d'une route d'accès à site minier.", category: "Route", budget: 350000, budgetUnit: "USD", location: "Lualaba", deadline: "2026-12-31", contact: "+243 810 555 555", userId: u5.id },
    { title: "Installation solaire 30kW hôtel", description: "Système hybride 30kW avec 40kWh batteries pour hôtel boutique.", category: "Autre", budget: 42000, budgetUnit: "USD", location: "Kinshasa Gombe", deadline: "2026-06-01", contact: "+243 810 333 333", userId: u3.id },
    { title: "Construction mur de clôture 180ml", description: "Mur 2.5m hauteur en parpaing, avec portail coulissant métallique.", category: "Construction", budget: 22000, budgetUnit: "USD", location: "Ngaliema", deadline: "2026-05-20", contact: "+243 810 222 222", userId: u2.id },
  ];
  for (const p of projects) {
    await prisma.project.create({ data: p });
  }

  console.log("→ seed: creating demands");
  const demands: Array<Parameters<typeof prisma.demand.create>[0]["data"]> = [
    { name: "Jean-Pierre Mukendi", phone: "+243 820 111 222", description: "Je cherche 500 sacs de ciment Simba 42.5R livrés à Matete, semaine prochaine.", category: "Matériaux BTP", budget: 7500, status: "new" },
    { name: "Patrick Ngoma", phone: "+243 820 333 444", description: "Recherche un électricien pour installation complète d'une maison R+1 à Lemba.", category: "Services travaux", budget: 3500, status: "contacted" },
    { name: "Marie Kabila", phone: "+243 820 555 666", description: "Devis pour 10 panneaux solaires 550W + onduleur hybride + batteries pour villa.", category: "Équipements énergétiques", budget: 6000, status: "new" },
    { name: "Chen Wei", phone: "+243 820 777 888", description: "Meubles complets pour appartement 3 chambres Gombe : chambres, salon, salle à manger.", category: "Meubles & Déco", budget: 4500, status: "new" },
    { name: "Aminata Bisengo", phone: "+243 820 999 000", description: "Location d'un compacteur pour 2 semaines, chantier à Masina.", category: "Location d'équipements", budget: 800, status: "resolved" },
    { name: "Didier Kalombo", phone: "+243 820 121 212", description: "Quelques mètres cubes de sable et gravier pour petite dalle.", category: "Matériaux BTP", budget: 400, status: "new" },
  ];
  for (const d of demands) {
    await prisma.demand.create({ data: d });
  }

  console.log("✓ seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
