import Link from "next/link";
import { notFound } from "next/navigation";
import { COMMUNES, getCommune, priceColor } from "@/lib/pricing-data";
import PricingMapLoader from "@/components/PricingMapLoader";
import { getDict } from "@/lib/i18n/server";

export function generateStaticParams() {
  return COMMUNES.filter((c) => c.streets?.length).map((c) => ({ commune: c.slug }));
}

export default async function CommunePricePage({
  params,
}: {
  params: Promise<{ commune: string }>;
}) {
  const { commune: slug } = await params;
  const commune = getCommune(slug);
  if (!commune || !commune.streets?.length) notFound();

  const dict = await getDict();
  const t = dict.prices;
  const displayName = t.communeName[slug as keyof typeof t.communeName] ?? commune.name;
  const description = t.communeDesc[slug as keyof typeof t.communeDesc] ?? commune.description;

  const sortedStreets = [...commune.streets].sort((a, b) => b.pricePerSqm - a.pricePerSqm);
  const max = sortedStreets[0].pricePerSqm;
  const min = sortedStreets[sortedStreets.length - 1].pricePerSqm;
  const avg = Math.round(
    sortedStreets.reduce((s, x) => s + x.pricePerSqm, 0) / sortedStreets.length
  );
  const accent = priceColor(commune.pricePerSqm);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: `radial-gradient(600px circle at 85% 0%, ${accent}55, transparent 70%)`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 py-10 relative">
          <nav className="text-xs text-slate-300 mb-4 flex items-center gap-2">
            <Link href="/prices" className="hover:text-amber-300 transition">
              {t.breadcrumb}
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-white font-medium">{displayName}</span>
          </nav>

          <div className="flex items-end gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{displayName}</h1>
            <span
              className="inline-block h-3 w-3 rounded-full mb-3"
              style={{ backgroundColor: accent, boxShadow: `0 0 20px ${accent}` }}
            />
          </div>
          {description && (
            <p className="text-slate-300 max-w-2xl leading-relaxed">{description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl">
            <HeroStat label={t.commune.priceAvg} value={`$${commune.pricePerSqm}`} hint={t.commune.priceAvgHint} accent={accent} />
            <HeroStat label={t.commune.maxStreet} value={`$${max}`} hint={t.commune.perSqm} />
            <HeroStat label={t.commune.minStreet} value={`$${min}`} hint={t.commune.perSqm} />
            <HeroStat label={t.commune.avgStreet} value={`$${avg}`} hint={t.commune.perSqm} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <PricingMapLoader mode="commune" commune={commune} />

          <aside>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4">{t.commune.streetsTitle}</h2>
              <ul className="space-y-3">
                {sortedStreets.map((s) => {
                  const pct = ((s.pricePerSqm - min) / Math.max(1, max - min)) * 100;
                  return (
                    <li key={s.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2 font-medium text-gray-900">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: priceColor(s.pricePerSqm) }}
                          />
                          {s.name}
                        </span>
                        <span className="text-gray-700 font-semibold">
                          ${s.pricePerSqm}
                          <span className="text-xs text-gray-400 font-normal">/m²</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(6, pct)}%`,
                            backgroundColor: priceColor(s.pricePerSqm),
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Link
              href="/prices"
              className="inline-flex items-center gap-1 mt-4 text-sm text-amber-700 hover:text-amber-900 font-medium"
            >
              {t.commune.backToCity}
            </Link>
          </aside>
        </div>

        <p className="mt-6 text-xs text-gray-500">{t.commune.disclaimer}</p>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg px-4 py-3 relative overflow-hidden">
      {accent && (
        <div
          className="absolute top-0 left-0 h-full w-1"
          style={{ backgroundColor: accent }}
        />
      )}
      <div className="text-[10px] uppercase tracking-wider text-amber-200/80 font-semibold">
        {label}
      </div>
      <div className="text-2xl font-bold text-white mt-0.5">{value}</div>
      <div className="text-[11px] text-slate-400">{hint}</div>
    </div>
  );
}
