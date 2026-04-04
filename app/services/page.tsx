import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { ChevronRight, MapPin } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const { cat } = await searchParams;

  const services = await prisma.serviceProvider.findMany({
    where: {
      status: "active",
      ...(cat ? { category: cat } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">首页</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">找服务商</span>
        {cat && <><ChevronRight size={14} /><span className="text-gray-900">{cat}</span></>}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-green-500 font-semibold text-white">
              服务分类
            </div>
            <nav className="p-2">
              <Link
                href="/services"
                className={`block px-3 py-2 rounded-lg text-sm ${!cat ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
              >
                全部服务商
              </Link>
              {SERVICE_CATEGORIES.map((c) => (
                <Link
                  key={c}
                  href={`/services?cat=${c}`}
                  className={`block px-3 py-2 rounded-lg text-sm ${cat === c ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {c}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* List */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            {cat || "全部服务商"}
            <span className="text-sm font-normal text-gray-500 ml-2">共 {services.length} 家</span>
          </h1>

          {services.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
              暂无服务商
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
                    暂无图
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{s.companyName}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{s.category}</span>
                      {s.isFeatured && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">推荐</span>
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
                      {s.experience && <span>从业 {s.experience} 年</span>}
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
