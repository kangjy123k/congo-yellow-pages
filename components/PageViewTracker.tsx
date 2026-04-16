"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/i18n/I18nProvider";

export default function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  const sent = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/api") || pathname.startsWith("/admin")) return;
    const key = `${pathname}|${locale}`;
    if (sent.current === key) return;
    sent.current = key;

    const ctrl = new AbortController();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, locale }),
      signal: ctrl.signal,
      keepalive: true,
    }).catch(() => {});
    return () => ctrl.abort();
  }, [pathname, locale]);

  return null;
}
