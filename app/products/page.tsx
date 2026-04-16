import Link from "next/link";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const revalidate = 300;

type ProductFilter = {
  main?: string;
  cat?: string;
  q?: string;
  type?: string;
  stock?: string;
  min?: number;
  max?: number;
  sort: "recent" | "priceAsc" | "priceDesc" | "featured";
};

const getProducts = unstable_cache(
  async (f: ProductFilter) => {
    const orderBy =
      f.sort === "priceAsc"
        ? [{ price: "asc" as const }, { createdAt: "desc" as const }]
        : f.sort === "priceDesc"
          ? [{ price: "desc" as const }, { createdAt: "desc" as const }]
          : f.sort === "featured"
            ? [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }]
            : [{ createdAt: "desc" as const }];
    return prisma.product.findMany({
      where: {
        status: "active",
        ...(f.main ? { mainCategory: f.main } : {}),
        ...(f.cat ? { category: f.cat } : {}),
        ...(f.q ? { title: { contains: f.q } } : {}),
        ...(f.type ? { listingType: f.type } : {}),
        ...(f.stock ? { inventoryType: f.stock } : {}),
        ...(f.min !== undefined || f.max !== undefined
          ? { price: { ...(f.min !== undefined ? { gte: f.min } : {}), ...(f.max !== undefined ? { lte: f.max } : {}) } }
          : {}),
      },
      orderBy,
    });
  },
  ["products:list"],
  { revalidate: 300, tags: ["products"] },
);

interface PageProps {
  searchParams: Promise<{
    main?: string;
    cat?: string;
    q?: string;
    sort?: "recent" | "priceAsc" | "priceDesc" | "featured";
    type?: "sell" | "rent" | "both";
    stock?: "local" | "china";
    min?: string;
    max?: string;
  }>;
}

const SORTS = ["recent", "featured", "priceAsc", "priceDesc"] as const;

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { main, cat, q, type, stock } = sp;
  const sort = SORTS.includes(sp.sort as never) ? (sp.sort as (typeof SORTS)[number]) : "recent";
  const min = sp.min ? Number(sp.min) : undefined;
  const max = sp.max ? Number(sp.max) : undefined;

  const dict = await getDict();
  const t = dict.products;
  const tMain = (k: string) =>
    dict.categories.productMain[k as keyof typeof dict.categories.productMain] ?? k;
  const tSub = (k: string) =>
    dict.categories.productSub[k as keyof typeof dict.categories.productSub] ?? k;

  const products = await getProducts({ main, cat, q, type, stock, min, max, sort });

  const activeMain = main ? tMain(main) : dict.common.all;
  const baseParams = new URLSearchParams();
  if (main) baseParams.set("main", main);
  if (cat) baseParams.set("cat", cat);
  if (q) baseParams.set("q", q);

  function paramUrl(extra: Record<string, string | undefined>) {
    const p = new URLSearchParams(baseParams);
    Object.entries(extra).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k);
    });
    if (sort !== "recent") p.set("sort", sort);
    if (type && !("type" in extra)) p.set("type", type);
    if (stock && !("stock" in extra)) p.set("stock", stock);
    if (sp.min && !("min" in extra)) p.set("min", sp.min);
    if (sp.max && !("max" in extra)) p.set("max", sp.max);
    return `/products?${p.toString()}`;
  }

  const hasFilters = type || stock || min !== undefined || max !== undefined || sort !== "recent";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap">
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
          <details className="md:hidden bg-white rounded-xl border border-gray-100 mb-4">
            <summary className="px-4 py-3 bg-yellow-500 font-semibold text-gray-900 cursor-pointer">
              {t.categories}
            </summary>
            <CategoryNav main={main} cat={cat} tMain={tMain} tSub={tSub} t={t} />
          </details>
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-yellow-500 font-semibold text-gray-900">{t.categories}</div>
            <CategoryNav main={main} cat={cat} tMain={tMain} tSub={tSub} t={t} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3 gap-2">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {cat ? tSub(cat) : main ? tMain(main) : t.allProducts}
              <span className="text-sm font-normal text-gray-500 ml-2">{products.length}</span>
            </h1>
          </div>

          {/* Filter row */}
          <form method="get" action="/products" className="bg-white border border-gray-100 rounded-xl p-3 mb-4 flex flex-wrap gap-2 items-center text-sm">
            {main && <input type="hidden" name="main" value={main} />}
            {cat && <input type="hidden" name="cat" value={cat} />}
            {q && <input type="hidden" name="q" value={q} />}
            <select
              name="sort"
              defaultValue={sort}
              className="border border-gray-200 rounded-lg px-2.5 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px]"
            >
              <option value="recent">{t.filter.sort.recent}</option>
              <option value="featured">{t.filter.sort.featured}</option>
              <option value="priceAsc">{t.filter.sort.priceAsc}</option>
              <option value="priceDesc">{t.filter.sort.priceDesc}</option>
            </select>
            <select
              name="type"
              defaultValue={type ?? ""}
              className="border border-gray-200 rounded-lg px-2.5 py-2 bg-gray-50 min-h-[40px]"
            >
              <option value="">{t.filter.type}</option>
              <option value="sell">{t.tag.sell}</option>
              <option value="rent">{t.tag.rent}</option>
              <option value="both">{t.tag.both}</option>
            </select>
            <select
              name="stock"
              defaultValue={stock ?? ""}
              className="border border-gray-200 rounded-lg px-2.5 py-2 bg-gray-50 min-h-[40px]"
            >
              <option value="">{t.filter.stock}</option>
              <option value="local">{dict.categories.inventory.local}</option>
              <option value="china">{dict.categories.inventory.china}</option>
            </select>
            <input
              type="number"
              name="min"
              placeholder={t.filter.priceMin}
              defaultValue={sp.min ?? ""}
              className="border border-gray-200 rounded-lg px-2.5 py-2 w-24 min-h-[40px]"
              min="0"
            />
            <input
              type="number"
              name="max"
              placeholder={t.filter.priceMax}
              defaultValue={sp.max ?? ""}
              className="border border-gray-200 rounded-lg px-2.5 py-2 w-24 min-h-[40px]"
              min="0"
            />
            <button type="submit" className="px-3 py-2 bg-gray-900 text-white rounded-lg font-medium min-h-[40px]">
              {t.filter.apply}
            </button>
            {hasFilters && (
              <Link
                href={paramUrl({ sort: undefined, type: undefined, stock: undefined, min: undefined, max: undefined })}
                className="px-3 py-2 text-gray-500 hover:text-gray-900 min-h-[40px] inline-flex items-center"
              >
                {t.filter.reset}
              </Link>
            )}
          </form>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
              {t.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md active:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="relative h-32 sm:h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                    {p.images ? (
                      <Image
                        src={JSON.parse(p.images)[0]}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                        loading="lazy"
                      />
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

function CategoryNav({
  main,
  cat,
  tMain,
  tSub,
  t,
}: {
  main?: string;
  cat?: string;
  tMain: (k: string) => string;
  tSub: (k: string) => string;
  t: { allProducts: string };
}) {
  return (
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
  );
}
