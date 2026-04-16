import Link from "next/link";
import { COMMUNES, priceColor } from "@/lib/pricing-data";
import { ROCADE_INFO } from "@/lib/rocade-data";
import PricingMapLoader from "@/components/PricingMapLoader";
import { getDict } from "@/lib/i18n/server";

const LEGEND = [
  { rangeKey: "tier1", from: 2000, to: null, color: "#dc2626" },
  { rangeKey: "tier2", from: 1200, to: 1999, color: "#f97316" },
  { rangeKey: "tier3", from: 800, to: 1199, color: "#f59e0b" },
  { rangeKey: "tier4", from: 500, to: 799, color: "#eab308" },
  { rangeKey: "tier5", from: 300, to: 499, color: "#84cc16" },
  { rangeKey: "tier6", from: 0, to: 299, color: "#22c55e" },
];

function legendLabel(from: number, to: number | null): string {
  if (to === null) return `≥ $${from}/m²`;
  if (from === 0) return `< $${to + 1}`;
  return `$${from}–${to}`;
}

export default async function PricesPage() {
  const dict = await getDict();
  const t = dict.prices;
  const translateName = (slug: string) =>
    t.communeName[slug as keyof typeof t.communeName] ?? slug;

  const sorted = [...COMMUNES].sort((a, b) => b.pricePerSqm - a.pricePerSqm);
  const maxP = sorted[0].pricePerSqm;
  const minP = sorted[sorted.length - 1].pricePerSqm;
  const avgP = Math.round(
    COMMUNES.reduce((s, c) => s + c.pricePerSqm, 0) / COMMUNES.length
  );
  const maxCommune = sorted[0];
  const minCommune = sorted[sorted.length - 1];
  const drillable = COMMUNES.filter((c) => c.streets?.length);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px, 55px 55px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 py-10 relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 mb-3">
            <span className="h-px w-8 bg-amber-300" />
            {t.eyebrow}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            {t.title} <span className="text-amber-300">·</span> {t.city}
          </h1>
          <p className="text-slate-300 max-w-2xl leading-relaxed">{t.subtitle}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl">
            <HeroStat label={t.stat.communes} value={`${COMMUNES.length}`} hint={t.stat.communesHint} />
            <HeroStat label={t.stat.max} value={`$${maxP}`} hint={t.stat.maxHintPattern(translateName(maxCommune.slug))} />
            <HeroStat label={t.stat.min} value={`$${minP}`} hint={t.stat.minHintPattern(translateName(minCommune.slug))} />
            <HeroStat label={t.stat.avg} value={`$${avgP}`} hint={t.stat.avgHint} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <PricingMapLoader mode="city" />

          <aside className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-3">{t.legend}</h2>
              <ul className="space-y-2">
                {LEGEND.map((l) => (
                  <li key={l.rangeKey} className="flex items-center gap-3 text-sm">
                    <span
                      className="inline-block h-4 w-4 rounded-md shadow-sm"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="text-gray-700">{legendLabel(l.from, l.to)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-1">{t.rocade.title}</h2>
              <p className="text-xs text-gray-500 mb-3">{t.rocade.subtitle}</p>
              <dl className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <dt className="text-gray-500">{t.rocade.length}</dt>
                  <dd className="text-gray-900 font-semibold">{ROCADE_INFO.totalKm}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{t.rocade.progress}</dt>
                  <dd className="text-gray-900 font-semibold">{ROCADE_INFO.progress}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500 shrink-0">{t.rocade.communes}</dt>
                  <dd className="text-gray-900 text-right">{ROCADE_INFO.communes.join(", ")}</dd>
                </div>
              </dl>
              <ul className="mt-3 pt-3 border-t border-amber-200 text-[11px] text-gray-600 space-y-1">
                <li className="flex items-center gap-2"><span className="inline-block h-1 w-6 bg-red-600 rounded" />{t.rocade.legendSW}</li>
                <li className="flex items-center gap-2"><span className="inline-block h-1 w-6 bg-green-600 rounded" />{t.rocade.legendSE}</li>
                <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-amber-400 border border-gray-900" />{t.rocade.legendStart}</li>
                <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-blue-500 border border-gray-900" />{t.rocade.legendBridge}</li>
                <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-green-500 border border-gray-900" />{t.rocade.legendEnd}</li>
              </ul>
              <p className="mt-2 text-[10px] text-gray-400 italic leading-snug">{t.rocade.disclaimer}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-3">{t.communesWithDetail}</h2>
              <ul className="space-y-1">
                {drillable.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/prices/${c.slug}`}
                      className="group flex items-center justify-between text-sm py-2 px-2 rounded-lg hover:bg-amber-50 transition"
                    >
                      <span className="flex items-center gap-2 font-medium text-gray-900">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: priceColor(c.pricePerSqm) }}
                        />
                        {translateName(c.slug)}
                      </span>
                      <span className="text-gray-600 group-hover:text-amber-700 transition">
                        ${c.pricePerSqm}
                        <span className="text-xs text-gray-400">/m²</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.allCommunes}</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">{t.tableCols.commune}</th>
                  <th className="px-4 py-3">{t.tableCols.price}</th>
                  <th className="px-4 py-3 w-[40%]">{t.tableCols.level}</th>
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sorted.map((c) => {
                  const pct = ((c.pricePerSqm - minP) / (maxP - minP)) * 100;
                  return (
                    <tr key={c.slug} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{translateName(c.slug)}</td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">
                        ${c.pricePerSqm}
                        <span className="text-xs text-gray-400 font-normal">/m²</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(3, pct)}%`,
                              backgroundColor: priceColor(c.pricePerSqm),
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.streets?.length ? (
                          <Link
                            href={`/prices/${c.slug}`}
                            className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium"
                          >
                            {t.details} <span aria-hidden>→</span>
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-xs">{t.noDetails}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-amber-200/80 font-semibold">
        {label}
      </div>
      <div className="text-2xl font-bold text-white mt-0.5">{value}</div>
      <div className="text-[11px] text-slate-400">{hint}</div>
    </div>
  );
}
