import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChevronRight, MapPin, Calendar } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

const CATS: Array<{ key: string; value: string }> = [
  { key: "construction", value: "Construction" },
  { key: "renovation", value: "Rénovation" },
  { key: "road", value: "Route" },
  { key: "other", value: "Autre" },
];

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { cat } = await searchParams;
  const dict = await getDict();
  const t = dict.projects;
  const catLabel = (v: string) => {
    const found = CATS.find((c) => c.value === v);
    return found ? t.cat[found.key as keyof typeof t.cat] : v;
  };

  const projects = await prisma.project.findMany({
    where: {
      status: "open",
      ...(cat ? { category: cat } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">{dict.nav.home}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{t.title}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          {dict.home.publishProject}
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/projects"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${!cat ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
        >
          {t.all}
        </Link>
        {CATS.map((c) => (
          <Link
            key={c.value}
            href={`/projects?cat=${encodeURIComponent(c.value)}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${cat === c.value ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
          >
            {t.cat[c.key as keyof typeof t.cat]}
          </Link>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          {t.noResults}{" "}
          <Link href="/projects/new" className="text-red-600 hover:underline">
            {dict.home.publishProject}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                {p.category && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{catLabel(p.category)}</span>
                )}
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{t.inProgress}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{p.title}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                {p.budget && (
                  <span className="text-red-600 font-semibold">
                    {t.budget}: {p.budget} {p.budgetUnit || "USD"}
                  </span>
                )}
                {p.location && (
                  <span className="flex items-center gap-1"><MapPin size={13} />{p.location}</span>
                )}
                {p.deadline && (
                  <span className="flex items-center gap-1"><Calendar size={13} />{t.deadline}: {p.deadline}</span>
                )}
                {p.contact && (
                  <a href={`tel:${p.contact}`} className="text-red-600 hover:underline ml-auto">
                    {t.contact}: {p.contact}
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
