export type Locale = "fr" | "en" | "zh";

export const LOCALES: Locale[] = ["fr", "en", "zh"];
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "locale";

export const LOCALE_LABEL: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  zh: "中文",
};

export const LOCALE_FULL_NAME: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  zh: "中文",
};

export function isLocale(v: unknown): v is Locale {
  return v === "fr" || v === "en" || v === "zh";
}

export function resolveLocale(v: unknown): Locale {
  return isLocale(v) ? v : DEFAULT_LOCALE;
}
