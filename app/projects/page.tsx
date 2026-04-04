import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChevronRight, MapPin, Calendar } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { cat } = await searchParams;

  const projects = await prisma.project.findMany({
    where: {
      status: "open",
      ...(cat ? { category: cat } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = ["房建", "装修", "道路", "其他"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">首页</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">项目发布</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">工程项目</h1>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          发布项目
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/projects"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${!cat ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
        >
          全部
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/projects?cat=${c}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${cat === c ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          暂无项目，
          <Link href="/projects/new" className="text-red-600 hover:underline">立即发布</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                {p.category && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{p.category}</span>
                )}
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">招募中</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{p.title}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                {p.budget && (
                  <span className="text-red-600 font-semibold">
                    预算：{p.budget} {p.budgetUnit || "USD"}
                  </span>
                )}
                {p.location && (
                  <span className="flex items-center gap-1"><MapPin size={13} />{p.location}</span>
                )}
                {p.deadline && (
                  <span className="flex items-center gap-1"><Calendar size={13} />截止：{p.deadline}</span>
                )}
                {p.contact && (
                  <a href={`tel:${p.contact}`} className="text-red-600 hover:underline ml-auto">
                    联系：{p.contact}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
