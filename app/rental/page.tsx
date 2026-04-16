import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChevronRight, MapPin } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export const revalidate = 300;

export default async function RentalPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const dict = await getDict();
  const t = dict.rental;

  const rentals = await prisma.rental.findMany({
    where: {
      status: "active",
      ...(type ? { type } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">{dict.nav.home}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{t.title}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <div className="flex gap-2">
          <Link
            href="/rental"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${!type ? "bg-purple-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
          >
            {t.filters.all}
          </Link>
          <Link
            href="/rental?type=lessor"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${type === "lessor" ? "bg-purple-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
          >
            {t.filters.lessor}
          </Link>
          <Link
            href="/rental?type=lessee"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${type === "lessee" ? "bg-purple-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
          >
            {t.filters.lessee}
          </Link>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          {t.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rentals.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type === "lessor" ? "bg-purple-100 text-purple-700" : "bg-indigo-100 text-indigo-700"}`}>
                  {r.type === "lessor" ? t.filters.lessor : t.filters.lessee}
                </span>
                {r.category && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.category}</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{r.title}</h3>
              {r.description && (
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{r.description}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                {r.price ? (
                  <span className="text-purple-600 font-semibold">
                    ${r.price}{r.priceUnit ? ` / ${r.priceUnit}` : ""}
                  </span>
                ) : <span />}
                {r.contact && (
                  <a href={`tel:${r.contact}`} className="text-purple-600 hover:underline">
                    {r.contact}
                  </a>
                )}
              </div>
              {r.location && (
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <MapPin size={12} />{r.location}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
