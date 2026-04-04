"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-yellow-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              刚果金
            </span>
            <span className="text-sm font-semibold text-gray-700 leading-tight">
              建筑装修<br />行业黄页
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-900 hover:bg-yellow-400 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/demand/new"
              className="px-3 py-2 text-sm font-medium bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              登记需求
            </Link>
            <Link
              href="/merchant/register"
              className="px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              商家入驻
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-900"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-900 hover:bg-yellow-400 rounded-md"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              <Link
                href="/demand/new"
                className="flex-1 text-center px-3 py-2 text-sm font-medium bg-white text-gray-900 rounded-md"
                onClick={() => setOpen(false)}
              >
                登记需求
              </Link>
              <Link
                href="/merchant/register"
                className="flex-1 text-center px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-md"
                onClick={() => setOpen(false)}
              >
                商家入驻
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
