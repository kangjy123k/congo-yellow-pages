"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SOURCES = ["/videos/hero-1.mp4", "/videos/hero-2.mp4", "/videos/hero-3.mp4", "/videos/hero-4.mp4"];

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % SOURCES.length);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {});
  }, [index]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        key={SOURCES[index]}
        src={SOURCES[index]}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={advance}
        onError={advance}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
