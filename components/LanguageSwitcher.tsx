"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { LOCALES, LOCALE_LABEL } from "@/lib/i18n/types";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  return (
    <div
      className={`inline-flex items-center text-xs font-medium border rounded-md overflow-hidden ${
        compact ? "border-white/40" : "border-gray-700"
      }`}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-2 py-1 transition ${
            locale === l
              ? "bg-gray-900 text-white"
              : compact
                ? "text-white/80 hover:bg-white/10"
                : "text-gray-700 hover:bg-yellow-400"
          }`}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
