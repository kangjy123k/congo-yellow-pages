import Link from "next/link";
import {
  Hammer,
  Sofa,
  HardHat,
  Wrench,
  Package,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

const mainCategories = [
  {
    href: "/products?main=找建筑产品",
    icon: Hammer,
    title: "找建筑产品",
    desc: "建材、工具、电气设备、工程机械",
    color: "bg-orange-100 text-orange-600",
  },
  {
    href: "/products?main=找家具",
    icon: Sofa,
    title: "找家具",
    desc: "装修材料、家具",
    color: "bg-blue-100 text-blue-600",
  },
  {
    href: "/services",
    icon: HardHat,
    title: "找服务商",
    desc: "房建、装修、道路、特殊工程",
    color: "bg-green-100 text-green-600",
  },
  {
    href: "/rental",
    icon: Wrench,
    title: "租赁",
    desc: "设备出租 / 寻找租用",
    color: "bg-purple-100 text-purple-600",
  },
  {
    href: "/projects",
    icon: ClipboardList,
    title: "项目发布",
    desc: "发布工程需求，寻找承包商",
    color: "bg-red-100 text-red-600",
  },
  {
    href: "/demand/new",
    icon: Package,
    title: "登记需求",
    desc: "告诉我们您需要什么",
    color: "bg-yellow-100 text-yellow-600",
  },
];

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
    take: 4,
  });
}

export default async function HomePage() {
  const [products, services] = await Promise.all([
    getLatestProducts(),
    getLatestServices(),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-yellow-400 to-yellow-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            刚果金建筑装修行业黄页
          </h1>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            刚果金领先的建筑装修行业信息平台 — 找产品、找服务商、发布项目，一站式解决工程需求。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/merchant/register"
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              商家快速入驻
            </Link>
            <Link
              href="/demand/new"
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              登记我的需求
            </Link>
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">快速入口</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mainCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className={`p-3 rounded-lg ${cat.color}`}>
                <cat.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最新产品</h2>
          <Link
            href="/products"
            className="flex items-center text-sm text-yellow-600 hover:text-yellow-700 font-medium"
          >
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
            暂无产品，
            <Link href="/merchant/register" className="text-yellow-600 hover:underline">
              立即入驻
            </Link>
            发布您的产品
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  暂无图片
                </div>
                <div className="p-4">
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                  <h3 className="font-medium text-gray-900 mt-2 line-clamp-2">{p.title}</h3>
                  {p.price && (
                    <p className="text-yellow-600 font-semibold mt-1">
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
      </section>

      {/* Latest Services */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">推荐服务商</h2>
            <Link
              href="/services"
              className="flex items-center text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              查看全部 <ChevronRight size={16} />
            </Link>
          </div>
          {services.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
              暂无服务商，
              <Link href="/merchant/register" className="text-yellow-600 hover:underline">
                立即入驻
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">
                    暂无图
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{s.companyName}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                        {s.category}
                      </span>
                    </div>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Merchant CTA */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-yellow-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            您的业务还未上线？
          </h2>
          <p className="text-gray-800 mb-6">
            立即入驻刚果金建筑装修行业黄页，触达更多潜在客户。
          </p>
          <Link
            href="/merchant/register"
            className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            免费入驻
          </Link>
        </div>
      </section>
    </div>
  );
}
