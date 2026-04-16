"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, HardHat, MapPin, ClipboardList } from "lucide-react";
import { useDict } from "@/lib/i18n/I18nProvider";

export default function MobileBottomNav() {
  const dict = useDict();
  const pathname = usePathname() ?? "/";

  const items = [
    { href: "/", label: dict.nav.home, icon: Home, match: (p: string) => p === "/" },
    { href: "/products", label: dict.nav.materials, icon: Package, match: (p: string) => p.startsWith("/products") },
    { href: "/services", label: dict.nav.providers, icon: HardHat, match: (p: string) => p.startsWith("/services") },
    { href: "/prices", label: dict.nav.prices, icon: MapPin, match: (p: string) => p.startsWith("/prices") },
    { href: "/demand/new", label: dict.nav.postDemand, icon: ClipboardList, match: (p: string) => p.startsWith("/demand") },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="bottom navigation"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[10px] font-medium transition ${
                  active ? "text-yellow-600" : "text-gray-500 active:bg-gray-100"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="leading-tight text-center px-1 line-clamp-1">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
