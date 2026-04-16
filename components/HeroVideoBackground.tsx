"use client";

import { useEffect, useRef, useState } from "react";

const SOURCES = ["/videos/hero-1.mp4", "/videos/hero-2.mp4", "/videos/hero-3.mp4", "/videos/hero-4.mp4"];

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) return;

    const start = () => setEnabled(true);
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const handle = ric ? ric(start) : window.setTimeout(start, 1500);
    return () => {
      const cancel = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cancel) cancel(handle as number);
      else clearTimeout(handle as number);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = videoRef.current;
    if (!el) return;
    const handleEnded = () => setIndex((i) => (i + 1) % SOURCES.length);
    el.addEventListener("ended", handleEnded);
    return () => el.removeEventListener("ended", handleEnded);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const el = videoRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {});
  }, [index, enabled]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {enabled && (
        <video
          ref={videoRef}
          src={SOURCES[index]}
          autoPlay
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
