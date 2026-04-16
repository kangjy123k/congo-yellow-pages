"use client";

import dynamic from "next/dynamic";
import type { VisitPoint } from "./VisitMap";

const VisitMap = dynamic(() => import("./VisitMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
      …
    </div>
  ),
});

export default function VisitMapLoader({ points }: { points: VisitPoint[] }) {
  return <VisitMap points={points} />;
}
