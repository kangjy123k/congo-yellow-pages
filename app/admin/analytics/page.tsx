import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import VisitMapLoader from "@/components/VisitMapLoader";
import type { VisitPoint } from "@/components/VisitMap";

const LOCALE_DATE: Record<string, string> = { fr: "fr-FR", en: "en-US", zh: "zh-CN" };

type Range = "d7" | "d30" | "all";
type Device = "mobile" | "tablet" | "desktop";

function classifyDevice(ua: string | null | undefined): Device {
  if (!ua) return "desktop";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android.+Mobile|Opera Mini|BlackBerry|IEMobile|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

function rangeStart(r: Range): Date | null {
  const now = new Date();
  if (r === "d7") return new Date(now.getTime() - 7 * 86400_000);
  if (r === "d30") return new Date(now.getTime() - 30 * 86400_000);
  return null;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/");

  const sp = await searchParams;
  const range: Range = sp.range === "d30" || sp.range === "all" ? sp.range : "d7";

  const [dict, locale] = await Promise.all([getDict(), getLocale()]);
  const t = dict.analytics;
  const dateLocale = LOCALE_DATE[locale] ?? "fr-FR";

  const since = rangeStart(range);
  const where = since ? { createdAt: { gte: since } } : {};

  const [views, visitors, pages, perPage, perLocale, perCountry, dailyRaw, recent, geoRows, uaRows] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView
      .findMany({ where, select: { sessionId: true }, distinct: ["sessionId"] })
      .then((r) => r.length),
    prisma.pageView
      .findMany({ where, select: { path: true }, distinct: ["path"] })
      .then((r) => r.length),
    prisma.pageView.groupBy({
      by: ["path"],
      where,
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ["locale"],
      where,
      _count: { _all: true },
      orderBy: { _count: { locale: "desc" } },
    }),
    prisma.pageView.groupBy({
      by: ["country"],
      where,
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 8,
    }),
    prisma.pageView.findMany({
      where,
      select: { createdAt: true, sessionId: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.pageView.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        path: true,
        locale: true,
        ip: true,
        city: true,
        region: true,
        country: true,
        postalCode: true,
        createdAt: true,
      },
    }),
    prisma.pageView.findMany({
      where: { ...where, latitude: { not: null }, longitude: { not: null } },
      select: { id: true, latitude: true, longitude: true, city: true, country: true, ip: true },
      take: 500,
    }),
    prisma.pageView.findMany({ where, select: { userAgent: true } }),
  ]);

  const deviceCount: Record<Device, number> = { mobile: 0, tablet: 0, desktop: 0 };
  for (const r of uaRows) deviceCount[classifyDevice(r.userAgent)]++;
  const deviceTotal = Math.max(1, deviceCount.mobile + deviceCount.tablet + deviceCount.desktop);

  const pointMap = new Map<string, VisitPoint>();
  for (const r of geoRows) {
    if (r.latitude == null || r.longitude == null) continue;
    const key = `${r.latitude.toFixed(2)},${r.longitude.toFixed(2)}`;
    const existing = pointMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      pointMap.set(key, {
        id: r.id,
        lat: r.latitude,
        lng: r.longitude,
        city: r.city,
        country: r.country,
        ip: r.ip,
        count: 1,
      });
    }
  }
  const points = Array.from(pointMap.values());

  const days = since ? 7 : 14;
  const start = since ?? new Date(Date.now() - 14 * 86400_000);
  const dayBuckets: Map<string, { views: number; visitors: Set<string> }> = new Map();
  const numDays = range === "d30" ? 30 : range === "d7" ? 7 : Math.ceil((Date.now() - start.getTime()) / 86400_000) || 14;
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000);
    const key = d.toISOString().slice(0, 10);
    dayBuckets.set(key, { views: 0, visitors: new Set() });
  }
  for (const r of dailyRaw) {
    const key = r.createdAt.toISOString().slice(0, 10);
    const b = dayBuckets.get(key);
    if (b) {
      b.views++;
      if (r.sessionId) b.visitors.add(r.sessionId);
    }
  }
  const daily = Array.from(dayBuckets.entries()).map(([day, v]) => ({
    day,
    views: v.views,
    visitors: v.visitors.size,
  }));
  const dailyMax = Math.max(1, ...daily.map((d) => d.views));
  const totalLocale = Math.max(1, perLocale.reduce((s, r) => s + r._count._all, 0));
  const totalCountry = Math.max(1, perCountry.reduce((s, r) => s + r._count._all, 0));
  const topPagesMax = Math.max(1, ...perPage.map((p) => p._count._all));
  const avgPerVisitor = visitors === 0 ? 0 : Math.round((views / visitors) * 10) / 10;

  void days;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-900">
            {t.backToAdmin}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t.subtitle}</p>
        </div>
        <div className="flex gap-1 text-sm bg-gray-100 rounded-lg p-1">
          {(["d7", "d30", "all"] as Range[]).map((r) => (
            <Link
              key={r}
              href={`/admin/analytics?range=${r}`}
              className={`px-3 py-1.5 rounded-md transition ${
                range === r ? "bg-white shadow-sm font-semibold text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t.range[r]}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label={t.stat.views} value={views.toLocaleString(dateLocale)} accent="bg-blue-500" />
        <Stat label={t.stat.visitors} value={visitors.toLocaleString(dateLocale)} accent="bg-green-500" />
        <Stat label={t.stat.pages} value={pages.toLocaleString(dateLocale)} accent="bg-amber-500" />
        <Stat label={t.stat.avgPerVisitor} value={avgPerVisitor.toString()} accent="bg-purple-500" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t.daily}</h2>
        <div className="flex items-end gap-1.5 h-40">
          {daily.map((d) => {
            const h = (d.views / dailyMax) * 100;
            const date = new Date(d.day);
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-1 group" title={`${d.day}: ${d.views} views, ${d.visitors} visitors`}>
                <div className="w-full bg-gray-100 rounded-md overflow-hidden flex items-end" style={{ height: "120px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-md transition-all group-hover:from-blue-600 group-hover:to-blue-500"
                    style={{ height: `${Math.max(h, d.views > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-500 tabular-nums leading-none">
                  {date.toLocaleDateString(dateLocale, { month: "numeric", day: "numeric" })}
                </div>
                <div className="text-[10px] font-semibold text-gray-700 tabular-nums leading-none">{d.views}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">{t.topPages}</h2>
          {perPage.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t.topPagesEmpty}</p>
          ) : (
            <ul className="space-y-3">
              {perPage.map((p) => {
                const pct = (p._count._all / topPagesMax) * 100;
                return (
                  <li key={p.path}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900 truncate">{p.path}</span>
                      <span className="text-gray-700 font-semibold tabular-nums">{p._count._all}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.max(4, pct)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">{t.byLocale}</h2>
          {perLocale.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t.topPagesEmpty}</p>
          ) : (
            <ul className="space-y-3">
              {perLocale.map((l) => {
                const pct = (l._count._all / totalLocale) * 100;
                const label = l.locale === "fr" ? "Français" : l.locale === "en" ? "English" : l.locale === "zh" ? "中文" : t.unknown;
                const color = l.locale === "fr" ? "bg-blue-500" : l.locale === "en" ? "bg-green-500" : l.locale === "zh" ? "bg-red-500" : "bg-gray-400";
                return (
                  <li key={l.locale ?? "null"}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{label}</span>
                      <span className="text-gray-700 tabular-nums">
                        {l._count._all} <span className="text-gray-400 text-xs">({pct.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(4, pct)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t.byDevice}</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <DeviceStat
            label={t.device.mobile}
            count={deviceCount.mobile}
            pct={(deviceCount.mobile / deviceTotal) * 100}
            accent="bg-emerald-500"
            icon="📱"
          />
          <DeviceStat
            label={t.device.tablet}
            count={deviceCount.tablet}
            pct={(deviceCount.tablet / deviceTotal) * 100}
            accent="bg-amber-500"
            icon="📟"
          />
          <DeviceStat
            label={t.device.desktop}
            count={deviceCount.desktop}
            pct={(deviceCount.desktop / deviceTotal) * 100}
            accent="bg-sky-500"
            icon="💻"
          />
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden bg-gray-100 flex">
          <div className="h-full bg-emerald-500" style={{ width: `${(deviceCount.mobile / deviceTotal) * 100}%` }} />
          <div className="h-full bg-amber-500" style={{ width: `${(deviceCount.tablet / deviceTotal) * 100}%` }} />
          <div className="h-full bg-sky-500" style={{ width: `${(deviceCount.desktop / deviceTotal) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t.map}</h2>
        {points.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t.mapEmpty}</p>
        ) : (
          <VisitMapLoader points={points} />
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-gray-900">{t.recentVisits}</h2>
        </div>
        <p className="text-xs text-gray-500 mb-3">{t.recentNote}</p>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t.topPagesEmpty}</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-left text-[10px] uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">{t.cols.time}</th>
                  <th className="px-4 py-2 whitespace-nowrap">{t.cols.ip}</th>
                  <th className="px-4 py-2">{t.cols.location}</th>
                  <th className="px-4 py-2">{t.cols.page}</th>
                  <th className="px-4 py-2">{t.cols.lang}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map((r) => {
                  const loc = [r.city, r.region, r.country].filter(Boolean).join(", ");
                  const postal = r.postalCode ? ` · ${r.postalCode}` : "";
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700 whitespace-nowrap tabular-nums">
                        {r.createdAt.toLocaleString(dateLocale, { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-2 text-gray-700 font-mono text-[11px]">{r.ip ?? t.unknown}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {loc || t.unknown}
                        {postal && <span className="text-gray-400">{postal}</span>}
                      </td>
                      <td className="px-4 py-2 text-gray-900 font-medium truncate max-w-[200px]">{r.path}</td>
                      <td className="px-4 py-2 text-gray-700">{r.locale ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t.byCountry}</h2>
        {perCountry.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t.topPagesEmpty}</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {perCountry.map((c) => {
              const pct = (c._count._all / totalCountry) * 100;
              return (
                <li key={c.country ?? "null"} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="font-medium text-gray-900 text-sm">{c.country ?? t.unknown}</span>
                  <span className="text-gray-700 text-sm tabular-nums">
                    {c._count._all}
                    <span className="text-gray-400 text-xs ml-1">{pct.toFixed(0)}%</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{value}</div>
    </div>
  );
}

function DeviceStat({
  label,
  count,
  pct,
  accent,
  icon,
}: {
  label: string;
  count: number;
  pct: number;
  accent: string;
  icon: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</div>
      <div className="text-lg font-bold text-gray-900 tabular-nums mt-0.5">{count}</div>
      <div className={`text-[11px] font-semibold mt-0.5 tabular-nums text-white inline-block px-2 py-0.5 rounded-full ${accent}`}>
        {pct.toFixed(1)}%
      </div>
    </div>
  );
}
