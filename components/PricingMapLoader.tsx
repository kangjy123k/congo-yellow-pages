"use client";

import dynamic from "next/dynamic";
import type { CommunePrice } from "@/lib/pricing-data";

const PricingMap = dynamic(() => import("@/components/PricingMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500">
      Chargement de la carte…
    </div>
  ),
});

type Props =
  | { mode: "city" }
  | { mode: "commune"; commune: CommunePrice };

export default function PricingMapLoader(props: Props) {
  if (props.mode === "commune") {
    return <PricingMap mode="commune" commune={props.commune} />;
  }
  return <PricingMap mode="city" />;
}
