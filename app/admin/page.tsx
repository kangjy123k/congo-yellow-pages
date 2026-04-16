import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDict, getLocale } from "@/lib/i18n/server";

const LOCALE_DATE: Record<string, string> = { fr: "fr-FR", en: "en-US", zh: "zh-CN" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/");

  const [dict, locale, pendingMerchants, totalProducts, totalDemands, openProjects] = await Promise.all([
    getDict(),
    getLocale(),
    prisma.user.count({ where: { status: "pending", role: "merchant" } }),
    prisma.product.count(),
    prisma.demand.count({ where: { status: "new" } }),
    prisma.project.count({ where: { status: "open" } }),
  ]);
  const t = dict.admin;
  const dateLocale = LOCALE_DATE[locale] ?? "fr-FR";

  const merchants = await prisma.user.findMany({
    where: { role: "merchant" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const demands = await prisma.demand.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const merchantStatusLabel = (s: string) =>
    s === "approved" ? t.status.approved : s === "rejected" ? t.status.rejected : t.status.pending;
  const demandStatusLabel = (s: string) =>
    s === "new" ? t.status.new : s === "contacted" ? t.status.contacted : t.status.resolved;
  const demandCategoryLabel = (c: string | null) =>
    c ? (dict.categories.demand[c as keyof typeof dict.categories.demand] ?? c) : "-";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-1 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
        >
          {t.analyticsLink}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t.stats.pendingMerchants, count: pendingMerchants, color: "text-yellow-600" },
          { label: t.stats.totalProducts, count: totalProducts, color: "text-orange-600" },
          { label: t.stats.newDemands, count: totalDemands, color: "text-blue-600" },
          { label: t.stats.openProjects, count: openProjects, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t.tabs.merchants}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.name}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.email}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.phone}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.status}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.registeredAt}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-3 text-gray-500">{m.email}</td>
                  <td className="px-6 py-3 text-gray-500">{m.phone || "-"}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : m.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {merchantStatusLabel(m.status)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(m.createdAt).toLocaleDateString(dateLocale)}
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    {m.status === "pending" && (
                      <>
                        <form action={`/api/admin/merchants/${m.id}/approve`} method="POST">
                          <button className="text-xs text-green-600 hover:underline">
                            {t.actions.approve}
                          </button>
                        </form>
                        <form action={`/api/admin/merchants/${m.id}/reject`} method="POST">
                          <button className="text-xs text-red-600 hover:underline">
                            {t.actions.reject}
                          </button>
                        </form>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t.tabs.demands}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.name}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.phone}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{dict.common.category}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{dict.common.description}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{dict.common.budget} (USD)</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.status}</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">{t.columns.registeredAt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demands.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-6 py-3">
                    <a href={`tel:${d.phone}`} className="text-blue-600 hover:underline">
                      {d.phone}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{demandCategoryLabel(d.category)}</td>
                  <td className="px-6 py-3 text-gray-600 max-w-xs truncate">{d.description}</td>
                  <td className="px-6 py-3 text-gray-500">{d.budget || "-"}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        d.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : d.status === "contacted"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {demandStatusLabel(d.status)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString(dateLocale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
