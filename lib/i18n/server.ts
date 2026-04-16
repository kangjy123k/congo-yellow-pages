import "server-only";
import { cookies } from "next/headers";
import fr from "./dictionaries/fr";
import en from "./dictionaries/en";
import zh from "./dictionaries/zh";
import type { Dict } from "./dictionaries/fr";
import { LOCALE_COOKIE, resolveLocale, type Locale } from "./types";

const DICTS: Record<Locale, Dict> = { fr, en, zh };

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return resolveLocale(store.get(LOCALE_COOKIE)?.value);
}

export async function getDict(): Promise<Dict> {
  const l = await getLocale();
  return DICTS[l];
}
