import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, HardHat, Wrench, ClipboardList } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/merchant/login");

  const [dict, products, services, rentals, projects] = await Promise.all([
    getDict(),
    prisma.product.count({ where: { userId: session.user.id } }),
    prisma.serviceProvider.count({ where: { userId: session.user.id } }),
    prisma.rental.count({ where: { userId: session.user.id } }),
    prisma.project.count({ where: { userId: session.user.id } }),
  ]);
  const t = dict.merchantDashboard;
  const isPending = session.user.status === "pending";

  const statsItems = [
    { label: t.stats.products, count: products, icon: Package, color: "text-orange-500", href: "/merchant/dashboard/products" },
    { label: t.stats.services, count: services, icon: HardHat, color: "text-green-500", href: "/merchant/dashboard/services" },
    { label: t.stats.rental, count: rentals, icon: Wrench, color: "text-purple-500", href: "/merchant/dashboard/rentals" },
    { label: t.stats.projects, count: projects, icon: ClipboardList, color: "text-red-500", href: "/merchant/dashboard/projects" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500">{t.welcome(session.user.name ?? "")}</p>
        </div>
        {isPending && (
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            {t.pendingReview}
          </span>
        )}
      </div>

      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          {t.pendingHint}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsItems.map((item) => (
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

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/merchant/dashboard/products/new"
            className="text-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
          >
            + {t.actions.publishProduct}
          </Link>
          <Link
            href="/merchant/dashboard/services/new"
            className="text-center px-4 py-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
          >
            + {t.actions.publishService}
          </Link>
          <Link
            href="/merchant/dashboard/rentals/new"
            className="text-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            + {t.actions.publishRental}
          </Link>
          <Link
            href="/merchant/dashboard/projects/new"
            className="text-center px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            + {t.actions.publishProject}
          </Link>
        </div>
      </div>
    </div>
  );
}
