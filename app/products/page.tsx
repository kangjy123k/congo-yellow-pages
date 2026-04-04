import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ main?: string; cat?: string; q?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { main, cat, q } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      status: "active",
      ...(main ? { mainCategory: main } : {}),
      ...(cat ? { category: cat } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const activeMain = main || "全部";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">首页</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{activeMain}</span>
        {cat && (
          <>
            <ChevronRight size={14} />
            <span className="text-gray-900">{cat}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-yellow-500 font-semibold text-gray-900">
              产品分类
            </div>
            <nav className="p-2">
              <Link
                href="/products"
                className={`block px-3 py-2 rounded-lg text-sm ${!main ? "bg-yellow-50 text-yellow-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
              >
                全部产品
              </Link>
              {Object.entries(PRODUCT_CATEGORIES).map(([mainCat, subs]) => (
                <div key={mainCat} className="mt-2">
                  <Link
                    href={`/products?main=${mainCat}`}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${main === mainCat && !cat ? "bg-yellow-50 text-yellow-700" : "text-gray-900 hover:bg-gray-50"}`}
                  >
                    {mainCat}
                  </Link>
                  {subs.map((sub) => (
                    <Link
                      key={sub}
                      href={`/products?main=${mainCat}&cat=${sub}`}
                      className={`block px-5 py-1.5 rounded-lg text-sm ${cat === sub ? "text-yellow-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {cat || main || "全部产品"}
              <span className="text-sm font-normal text-gray-500 ml-2">共 {products.length} 件</span>
            </h1>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
              暂无产品
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    暂无图片
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        {p.category}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {p.listingType === "sell" ? "出售" : p.listingType === "rent" ? "出租" : "可售可租"}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mt-2 text-sm line-clamp-2">{p.title}</h3>
                    {p.price && (
                      <p className="text-yellow-600 font-semibold mt-1 text-sm">
                        ¥{p.price} {p.priceUnit}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {p.inventoryType === "local" ? "📦 本地库存" : "🚢 中国发货"}
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
