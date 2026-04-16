import Link from "next/link";
import Image from "next/image";
import { Hammer, Sofa, Zap, HardHat, ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n/server";
import HeroVideoBackground from "@/components/HeroVideoBackground";

const CAT_ICONS = { materialsBtp: Hammer, furniture: Sofa, energy: Zap, providers: HardHat, postDemand: ClipboardList };
const CAT_HREFS = {
  materialsBtp: "/products?main=Matériaux BTP",
  furniture: "/products?main=Meubles %26 Déco",
  energy: "/products?main=Énergie %26 Stockage",
  providers: "/services",
  postDemand: "/demand/new",
} as const;
const CAT_COLORS = {
  materialsBtp: "bg-orange-100 text-orange-600",
  furniture: "bg-blue-100 text-blue-600",
  energy: "bg-yellow-100 text-yellow-600",
  providers: "bg-green-100 text-green-600",
  postDemand: "bg-purple-100 text-purple-600",
} as const;
const CAT_KEYS = ["materialsBtp", "furniture", "energy", "providers", "postDemand"] as const;

async function getLatestProducts() {
  return prisma.product.findMany({
    where: { status: "active" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
}
async function getLatestServices() {
  return prisma.serviceProvider.findMany({
    where: { status: "active" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 2,
  });
}
async function getStats() {
  const [vendors, products] = await Promise.all([
    prisma.user.count({ where: { status: "approved" } }),
    prisma.product.count({ where: { status: "active" } }),
  ]);
  return { vendors, products };
}

export default async function HomePage() {
  const [dict, products, services, stats] = await Promise.all([
    getDict(),
    getLatestProducts(),
    getLatestServices(),
    getStats(),
  ]);
  const t = dict.home;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 py-16 overflow-hidden">
        <HeroVideoBackground />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow">{t.heroSubtitle}</p>
          <form action="/products" method="get" className="flex max-w-xl mx-auto mb-10 shadow-lg rounded-xl overflow-hidden">
            <input
              name="q"
              type="text"
              placeholder={t.searchPlaceholder}
              autoComplete="off"
              className="flex-1 px-4 py-4 text-gray-900 text-base bg-white focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className="px-5 sm:px-7 py-4 bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors text-sm shrink-0 min-h-[48px]"
            >
              {dict.common.search}
            </button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {CAT_KEYS.map((k) => {
              const Icon = CAT_ICONS[k];
              return (
                <Link
                  key={k}
                  href={CAT_HREFS[k]}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`p-3 rounded-lg ${CAT_COLORS[k]}`}>
                    <Icon size={22} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                      {t.cat[k].title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.cat[k].desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t.latestProducts}</h2>
          <Link href="/products" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
            {dict.common.viewAll} →
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
            {t.noProducts}{" "}
            <Link href="/merchant/register" className="text-yellow-600 hover:underline">
              {t.signupToPublish}
            </Link>{" "}
            {t.signupSuffix}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="relative h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                  {p.images ? (
                    <Image
                      src={JSON.parse(p.images)[0]}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    dict.common.noImage
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    {dict.categories.productSub[p.category as keyof typeof dict.categories.productSub] ?? p.category}
                  </span>
                  <h3 className="font-medium text-gray-900 mt-2 line-clamp-2">{p.title}</h3>
                  {p.price && (
                    <p className="text-yellow-600 font-semibold mt-1">
                      ${p.price} {p.priceUnit}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {p.inventoryType === "local" ? `📦 ${t.inStock}` : `🚢 ${t.fromChina}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Project Bidding */}
      <section className="bg-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t.ownersTitle}</h2>
              <p className="text-gray-600 mt-1">{t.biddingHall}</p>
            </div>
            <Link
              href="/projects/new"
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              + {t.publishProject}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-4">{t.publishYourProject}</h3>
              <form action="/projects/new" className="space-y-3">
                <input
                  name="title"
                  placeholder={t.projectForm.titlePlaceholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <select
                  name="category"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"
                  defaultValue=""
                >
                  <option value="">{t.projectForm.categoryPlaceholder}</option>
                  <option value="Construction">{dict.projects.cat.construction}</option>
                  <option value="Rénovation">{dict.projects.cat.renovation}</option>
                  <option value="Route">{dict.projects.cat.road}</option>
                  <option value="Autre">{dict.projects.cat.other}</option>
                </select>
                <input
                  name="budget"
                  placeholder={t.projectForm.budgetPlaceholder}
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <textarea
                  name="description"
                  placeholder={t.projectForm.descriptionPlaceholder}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  name="location"
                  placeholder={t.projectForm.locationPlaceholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  name="contact"
                  placeholder={t.projectForm.contactPlaceholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Link
                  href="/projects/new"
                  className="block w-full text-center py-2.5 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                >
                  {t.projectForm.submit}
                </Link>
              </form>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t.currentProjects}</h3>
              <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-orange-100">
                <Link href="/projects" className="text-yellow-600 hover:underline text-sm">
                  {t.viewAllBids}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Section */}
      <section className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">{t.vendorTitle}</h2>
              <p className="text-gray-300 mb-4">{t.vendorStats(stats.vendors, stats.products)}</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ {t.vendorFeature1}</li>
                <li>✓ {t.vendorFeature2}</li>
                <li>✓ {t.vendorFeature3}</li>
              </ul>
              <Link
                href="/merchant/register"
                className="inline-block px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                {t.signupFree}
              </Link>
            </div>
            {services.length > 0 && (
              <div className="space-y-3">
                {services.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.id}`}
                    className="flex items-center gap-4 bg-gray-700 p-4 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">
                      {s.companyName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white truncate">{s.companyName}</p>
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full shrink-0">
                          {dict.categories.service[s.category as keyof typeof dict.categories.service] ?? s.category}
                        </span>
                        {s.isFeatured && (
                          <span className="text-xs bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full shrink-0">
                            {t.recommended}
                          </span>
                        )}
                      </div>
                      {s.phone && (
                        <p className="text-sm text-gray-300 mt-0.5">{s.phone}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.premiumTitle}</h2>
        <p className="text-gray-500 mb-8">{t.premiumSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.premium.map((svc) => (
            <div key={svc.title} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{svc.title}</h3>
              <p className="text-yellow-600 font-semibold text-xl mb-3">{svc.price}</p>
              <p className="text-sm text-gray-500 mb-4">{svc.desc}</p>
              <ul className="space-y-1 mb-5">
                {svc.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/243823170887"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                {t.whatsappContact}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
