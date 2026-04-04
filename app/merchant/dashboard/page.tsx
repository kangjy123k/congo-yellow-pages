import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, HardHat, Wrench, ClipboardList } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/merchant/login");

  const [products, services, rentals, projects] = await Promise.all([
    prisma.product.count({ where: { userId: session.user.id } }),
    prisma.serviceProvider.count({ where: { userId: session.user.id } }),
    prisma.rental.count({ where: { userId: session.user.id } }),
    prisma.project.count({ where: { userId: session.user.id } }),
  ]);

  const isPending = session.user.status === "pending";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商家中心</h1>
          <p className="text-gray-500">欢迎，{session.user.name}</p>
        </div>
        {isPending && (
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            账号审核中
          </span>
        )}
      </div>

      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          您的账号正在审核中，审核通过后即可发布内容。请耐心等待。
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "产品", count: products, icon: Package, color: "text-orange-500", href: "/merchant/dashboard/products" },
          { label: "服务", count: services, icon: HardHat, color: "text-green-500", href: "/merchant/dashboard/services" },
          { label: "租赁", count: rentals, icon: Wrench, color: "text-purple-500", href: "/merchant/dashboard/rentals" },
          { label: "项目", count: projects, icon: ClipboardList, color: "text-red-500", href: "/merchant/dashboard/projects" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <item.icon size={24} className={item.color} />
            <p className="text-2xl font-bold text-gray-900 mt-2">{item.count}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">快速发布</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/merchant/dashboard/products/new"
            className="text-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
          >
            + 发布产品
          </Link>
          <Link
            href="/merchant/dashboard/services/new"
            className="text-center px-4 py-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
          >
            + 发布服务
          </Link>
          <Link
            href="/merchant/dashboard/rentals/new"
            className="text-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            + 发布租赁
          </Link>
          <Link
            href="/merchant/dashboard/projects/new"
            className="text-center px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            + 发布项目
          </Link>
        </div>
      </div>
    </div>
  );
}
