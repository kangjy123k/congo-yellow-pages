"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useDict } from "@/lib/i18n/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dict = useDict();

  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/products?main=Matériaux BTP", label: dict.nav.materials },
    { href: "/products?main=Meubles %26 Déco", label: dict.nav.furniture },
    { href: "/products?main=Énergie %26 Stockage", label: dict.nav.energy },
    { href: "/services", label: dict.nav.providers },
    { href: "/rental", label: dict.nav.rental },
    { href: "/prices", label: dict.nav.prices },
    { href: "/projects", label: dict.nav.projects },
  ];

  return (
    <header className="bg-yellow-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Congo BTP Directory
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-900 hover:bg-yellow-400 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/demand/new"
              className="px-3 py-2 text-sm font-medium bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              {dict.nav.postDemand}
            </Link>
            <Link
              href="/merchant/register"
              className="px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {dict.nav.registerVendor}
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-900"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-900 hover:bg-yellow-400 rounded-md"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 mt-2 px-1">
              <LanguageSwitcher />
            </div>
            <div className="flex gap-2 mt-2">
              <Link
                href="/demand/new"
                className="flex-1 text-center px-3 py-2 text-sm font-medium bg-white text-gray-900 rounded-md"
                onClick={() => setOpen(false)}
              >
                {dict.nav.postDemand}
              </Link>
              <Link
                href="/merchant/register"
                className="flex-1 text-center px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-md"
                onClick={() => setOpen(false)}
              >
                {dict.nav.registerVendor}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
