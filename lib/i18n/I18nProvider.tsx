"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import fr from "./dictionaries/fr";
import en from "./dictionaries/en";
import zh from "./dictionaries/zh";
import type { Dict } from "./dictionaries/fr";
import { type Locale, LOCALE_COOKIE } from "./types";

const DICTS: Record<Locale, Dict> = { fr, en, zh };

type Ctx = {
  locale: Locale;
  dict: Dict;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l);
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      router.refresh();
    },
    [router]
  );

  const value = useMemo<Ctx>(
    () => ({ locale, dict: DICTS[locale], setLocale }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useDict(): Dict {
  return useI18n().dict;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
