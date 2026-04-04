import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/");

  const [pendingMerchants, totalProducts, totalDemands, openProjects] = await Promise.all([
    prisma.user.count({ where: { status: "pending", role: "merchant" } }),
    prisma.product.count(),
    prisma.demand.count({ where: { status: "new" } }),
    prisma.project.count({ where: { status: "open" } }),
  ]);

  const merchants = await prisma.user.findMany({
    where: { role: "merchant" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const demands = await prisma.demand.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">后台管理</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "待审核商家", count: pendingMerchants, color: "text-yellow-600" },
          { label: "产品总数", count: totalProducts, color: "text-orange-600" },
          { label: "新需求", count: totalDemands, color: "text-blue-600" },
          { label: "开放项目", count: openProjects, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Merchants */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">
          商家管理
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">名称</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">邮箱</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">电话</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">状态</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">注册时间</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-3 text-gray-500">{m.email}</td>
                  <td className="px-6 py-3 text-gray-500">{m.phone || "-"}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      m.status === "approved" ? "bg-green-100 text-green-700" :
                      m.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {m.status === "approved" ? "已通过" : m.status === "rejected" ? "已拒绝" : "待审核"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(m.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    {m.status === "pending" && (
                      <>
                        <form action={`/api/admin/merchants/${m.id}/approve`} method="POST">
                          <button className="text-xs text-green-600 hover:underline">通过</button>
                        </form>
                        <form action={`/api/admin/merchants/${m.id}/reject`} method="POST">
                          <button className="text-xs text-red-600 hover:underline">拒绝</button>
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

      {/* Demands */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">
          客户需求
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">姓名</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">电话</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">类型</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">需求描述</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">预算(USD)</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">状态</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demands.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-6 py-3">
                    <a href={`tel:${d.phone}`} className="text-blue-600 hover:underline">{d.phone}</a>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{d.category || "-"}</td>
                  <td className="px-6 py-3 text-gray-600 max-w-xs truncate">{d.description}</td>
                  <td className="px-6 py-3 text-gray-500">{d.budget || "-"}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      d.status === "new" ? "bg-blue-100 text-blue-700" :
                      d.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {d.status === "new" ? "新需求" : d.status === "contacted" ? "已联系" : "已解决"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString("zh-CN")}
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
