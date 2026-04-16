import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { ChevronRight, MapPin } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

const getServices = unstable_cache(
  async (cat: string | null) =>
    prisma.serviceProvider.findMany({
      where: { status: "active", ...(cat ? { category: cat } : {}) },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
  ["services:list"],
  { revalidate: 300, tags: ["services"] },
);

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

export const revalidate = 300;

export default async function ServicesPage({ searchParams }: PageProps) {
  const { cat } = await searchParams;
  const dict = await getDict();
  const t = dict.services;
  const tCat = (k: string) =>
    dict.categories.service[k as keyof typeof dict.categories.service] ?? k;

  const services = await getServices(cat ?? null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">{dict.nav.home}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{t.title}</span>
        {cat && (
          <>
            <ChevronRight size={14} />
            <span className="text-gray-900">{tCat(cat)}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-green-500 font-semibold text-white">
              {t.categories}
            </div>
            <nav className="p-2">
              <Link
                href="/services"
                className={`block px-3 py-2 rounded-lg text-sm ${!cat ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {t.allProviders}
              </Link>
              {SERVICE_CATEGORIES.map((c) => (
                <Link
                  key={c}
                  href={`/services?cat=${encodeURIComponent(c)}`}
                  className={`block px-3 py-2 rounded-lg text-sm ${cat === c ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {tCat(c)}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            {cat ? tCat(cat) : t.allProviders}
            <span className="text-sm font-normal text-gray-500 ml-2">{services.length}</span>
          </h1>

          {services.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
              {t.noResults}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">
                    {t.noCover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{s.companyName}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{tCat(s.category)}</span>
                      {s.isFeatured && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{t.recommended}</span>
                      )}
                    </div>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {s.address && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />{s.address}
                        </span>
                      )}
                      {s.experience && <span>{t.experienceYears(s.experience)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
