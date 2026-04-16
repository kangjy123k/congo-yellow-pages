"use client";

import Link from "next/link";
import { useDict } from "@/lib/i18n/I18nProvider";

export default function Footer() {
  const dict = useDict();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-3">Congo BTP Directory</h3>
          <p className="text-sm text-gray-400">{dict.footer.description}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">{dict.footer.findProducts}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products?main=Matériaux BTP&cat=Matériaux" className="hover:text-white">{dict.footer.link.materials}</Link></li>
            <li><Link href="/products?main=Matériaux BTP&cat=Outils" className="hover:text-white">{dict.footer.link.tools}</Link></li>
            <li><Link href="/products?main=Matériaux BTP&cat=Engins" className="hover:text-white">{dict.footer.link.machinery}</Link></li>
            <li><Link href="/products?main=Meubles %26 Déco&cat=Meubles" className="hover:text-white">{dict.footer.link.furniture}</Link></li>
            <li><Link href="/products?main=Énergie %26 Stockage&cat=Panneaux solaires" className="hover:text-white">{dict.footer.link.solar}</Link></li>
            <li><Link href="/products?main=Énergie %26 Stockage&cat=Batteries de stockage" className="hover:text-white">{dict.footer.link.batteries}</Link></li>
            <li><Link href="/products?main=Énergie %26 Stockage&cat=Onduleurs" className="hover:text-white">{dict.footer.link.inverters}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">{dict.footer.findServices}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services?cat=Construction" className="hover:text-white">{dict.footer.link.construction}</Link></li>
            <li><Link href="/services?cat=Rénovation" className="hover:text-white">{dict.footer.link.renovation}</Link></li>
            <li><Link href="/services?cat=Route" className="hover:text-white">{dict.footer.link.road}</Link></li>
            <li><Link href="/rental" className="hover:text-white">{dict.footer.link.rental}</Link></li>
            <li><Link href="/projects" className="hover:text-white">{dict.footer.link.bidding}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">{dict.footer.vendorSpace}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/merchant/register" className="hover:text-white">{dict.nav.registerVendor}</Link></li>
            <li><Link href="/merchant/login" className="hover:text-white">{dict.nav.loginVendor}</Link></li>
            <li><Link href="/demand/new" className="hover:text-white">{dict.nav.postDemand}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} {dict.footer.copyright}
      </div>
    </footer>
  );
}
