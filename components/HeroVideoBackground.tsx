"use client";

import { useEffect, useRef, useState } from "react";

const SOURCES = ["/videos/hero-1.mp4", "/videos/hero-2.mp4", "/videos/hero-3.mp4", "/videos/hero-4.mp4"];

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handleEnded = () => setIndex((i) => (i + 1) % SOURCES.length);
    el.addEventListener("ended", handleEnded);
    return () => el.removeEventListener("ended", handleEnded);
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
        src={SOURCES[index]}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
