import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

interface PageProps {
  searchParams: Promise<{ main?: string; cat?: string; q?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { main, cat, q } = await searchParams;
  const dict = await getDict();
  const t = dict.products;
  const tMain = (k: string) =>
    dict.categories.productMain[k as keyof typeof dict.categories.productMain] ?? k;
  const tSub = (k: string) =>
    dict.categories.productSub[k as keyof typeof dict.categories.productSub] ?? k;

  const products = await prisma.product.findMany({
    where: {
      status: "active",
      ...(main ? { mainCategory: main } : {}),
      ...(cat ? { category: cat } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const activeMain = main ? tMain(main) : dict.common.all;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">{dict.nav.home}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{activeMain}</span>
        {cat && (
          <>
            <ChevronRight size={14} />
            <span className="text-gray-900">{tSub(cat)}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-yellow-500 font-semibold text-gray-900">
              {t.categories}
            </div>
            <nav className="p-2">
              <Link
                href="/products"
                className={`block px-3 py-2 rounded-lg text-sm ${!main ? "bg-yellow-50 text-yellow-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {t.allProducts}
              </Link>
              {Object.entries(PRODUCT_CATEGORIES).map(([mainCat, subs]) => (
                <div key={mainCat} className="mt-2">
                  <Link
                    href={`/products?main=${encodeURIComponent(mainCat)}`}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${main === mainCat && !cat ? "bg-yellow-50 text-yellow-700" : "text-gray-900 hover:bg-gray-50"}`}
                  >
                    {tMain(mainCat)}
                  </Link>
                  {subs.map((sub) => (
                    <Link
                      key={sub}
                      href={`/products?main=${encodeURIComponent(mainCat)}&cat=${encodeURIComponent(sub)}`}
                      className={`block px-5 py-1.5 rounded-lg text-sm ${cat === sub ? "text-yellow-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {tSub(sub)}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {cat ? tSub(cat) : main ? tMain(main) : t.allProducts}
              <span className="text-sm font-normal text-gray-500 ml-2">{products.length}</span>
            </h1>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
              {t.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                    {p.images ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={JSON.parse(p.images)[0]} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      dict.common.noImage
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        {tSub(p.category)}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {p.listingType === "sell" ? t.tag.sell : p.listingType === "rent" ? t.tag.rent : t.tag.both}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mt-2 text-sm line-clamp-2">{p.title}</h3>
                    {p.price && (
                      <p className="text-yellow-600 font-semibold mt-1 text-sm">
                        ${p.price} {p.priceUnit}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {p.inventoryType === "local"
                        ? `📦 ${dict.categories.inventory.local}`
                        : `🚢 ${dict.categories.inventory.china}`}
                    </p>
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
