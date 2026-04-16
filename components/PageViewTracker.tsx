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

    const send = () => {
      const body = JSON.stringify({ path: pathname, locale });
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
        return;
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const handle = ric ? ric(send, { timeout: 3000 }) : window.setTimeout(send, 1200);
    return () => {
      const cancel = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cancel) cancel(handle as number);
      else clearTimeout(handle as number);
    };
  }, [pathname, locale]);

  return null;
}
