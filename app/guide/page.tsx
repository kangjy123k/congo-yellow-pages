"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Store,
  Globe,
  ChevronDown,
  ChevronUp,
  Star,
  UtensilsCrossed,
  ShoppingCart,
  Sparkles,
  Truck,
  Wrench,
  GraduationCap,
  Heart,
  Home,
  X,
} from "lucide-react";
import { useDict } from "@/lib/i18n/I18nProvider";

interface Business {
  id: number;
  name: string;
  contactPerson: string;
  wechat: string;
  phone: string;
  area: string;
  mainService: string;
  hasStore: string;
  languages: string;
  serviceScope: string;
  intro: string;
  image: string;
  category: string;
  featured?: boolean;
}

type CategoryKey =
  | "all"
  | "restaurant"
  | "supermarket"
  | "beauty"
  | "logistics"
  | "repair"
  | "education"
  | "medical"
  | "rental";

const CATEGORIES: Array<{ key: CategoryKey; icon: typeof Star; color: string }> = [
  { key: "all", icon: Star, color: "bg-yellow-500" },
  { key: "restaurant", icon: UtensilsCrossed, color: "bg-red-500" },
  { key: "supermarket", icon: ShoppingCart, color: "bg-green-500" },
  { key: "beauty", icon: Sparkles, color: "bg-pink-500" },
  { key: "logistics", icon: Truck, color: "bg-blue-500" },
  { key: "repair", icon: Wrench, color: "bg-orange-500" },
  { key: "education", icon: GraduationCap, color: "bg-purple-500" },
  { key: "medical", icon: Heart, color: "bg-rose-500" },
  { key: "rental", icon: Home, color: "bg-teal-500" },
];

const BUSINESSES: Business[] = [
  {
    id: 1,
    name: "川味坊 Saveur du Sichuan",
    contactPerson: "Li Wei",
    wechat: "liwei_ksv88",
    phone: "+243 81 234 5678",
    area: "Gombe, Kinshasa",
    mainService: "Authentic Sichuan cuisine, Chinese hotpot, stir-fried dishes, takeaway and catering services",
    hasStore: "Yes - Dine-in restaurant, 120 sqm, 15 tables",
    languages: "Chinese, French, Lingala",
    serviceScope: "Gombe, Ngaliema, Ma Campagne areas; delivery via WhatsApp order",
    intro:
      "Established in 2021, Saveur du Sichuan is the go-to Chinese restaurant in Kinshasa's Gombe district. Run by Chef Li Wei from Chengdu, we specialize in authentic Sichuan flavors — from fiery mapo tofu and Chongqing hotpot to classic kung pao chicken. We also offer catering for corporate events, mining camp meal services, and holiday party packages.",
    image: "/images/guide/restaurant1.jpg",
    category: "restaurant",
    featured: true,
  },
  {
    id: 2,
    name: "Golden Dragon Restaurant",
    contactPerson: "Zhang Mei",
    wechat: "zhangmei_gd",
    phone: "+243 82 345 6789",
    area: "Ngaliema, Kinshasa",
    mainService: "Cantonese dim sum, seafood, BBQ, private dining rooms, event catering",
    hasStore: "Yes - Restaurant with private rooms, 200 sqm",
    languages: "Chinese, French, English",
    serviceScope: "All Kinshasa districts; private event catering available",
    intro:
      "Golden Dragon brings premium Cantonese cuisine to Kinshasa. Our dim sum brunch on weekends is the most popular in the Chinese community.",
    image: "/images/guide/restaurant2.jpg",
    category: "restaurant",
  },
  {
    id: 3,
    name: "Asia Supermarket",
    contactPerson: "Chen Jie",
    wechat: "chen_asiamarket",
    phone: "+243 99 876 5432",
    area: "Gombe, Kinshasa",
    mainService: "Chinese groceries, Asian condiments, instant noodles, frozen food, rice, cooking sauces, snacks, beverages",
    hasStore: "Yes - Retail store + warehouse, 300 sqm",
    languages: "Chinese, French",
    serviceScope: "Kinshasa city-wide delivery; bulk orders for restaurants, mining camps, and enterprises",
    intro:
      "Asia Supermarket is the largest Chinese grocery store in Kinshasa. We import directly from China with new shipments arriving every two weeks.",
    image: "/images/guide/supermarket1.jpg",
    category: "supermarket",
    featured: true,
  },
  {
    id: 4,
    name: "Mama Africa Mini-Market",
    contactPerson: "Wang Xia",
    wechat: "wangxia_mama",
    phone: "+243 81 555 7788",
    area: "Limete, Kinshasa",
    mainService: "Daily essentials, household goods, Chinese snacks, beverages, phone accessories",
    hasStore: "Yes - Street-front shop, 80 sqm",
    languages: "Chinese, French, Lingala",
    serviceScope: "Limete and surrounding areas",
    intro: "A friendly neighborhood mini-market catering to both Chinese and local communities.",
    image: "/images/guide/supermarket2.jpg",
    category: "supermarket",
  },
  {
    id: 5,
    name: "Belle Nails Studio",
    contactPerson: "Liu Ying",
    wechat: "liuying_nails",
    phone: "+243 82 666 9900",
    area: "Gombe, Kinshasa",
    mainService: "Manicure, pedicure, gel nails, nail art, eyelash extensions, eyebrow shaping, facial treatments",
    hasStore: "Yes - Boutique studio, 60 sqm, by appointment",
    languages: "Chinese, French, English",
    serviceScope: "In-store services; home service available for groups of 3+",
    intro: "Belle Nails is Kinshasa's premier Chinese nail and beauty studio. Owner Liu Ying brings 8 years of experience from Guangzhou's top nail salons.",
    image: "/images/guide/beauty1.jpg",
    category: "beauty",
    featured: true,
  },
  {
    id: 6,
    name: "Afrique Express Logistics",
    contactPerson: "Zhao Peng",
    wechat: "zhaopeng_logistics",
    phone: "+243 99 111 2233",
    area: "Gombe, Kinshasa (HQ); Guangzhou office",
    mainService: "China-to-Congo shipping (sea & air), customs clearance, door-to-door delivery, warehouse storage",
    hasStore: "Yes - Warehouse in Kinshasa (500 sqm) + Guangzhou consolidation center",
    languages: "Chinese, French, English",
    serviceScope: "Guangzhou/Yiwu to Kinshasa; domestic DRC delivery to Lubumbashi, Kolwezi, Likasi",
    intro: "Afrique Express is your reliable logistics partner between China and DRC — sea freight ~45–55 days, air freight 7–10 days.",
    image: "/images/guide/logistics1.jpg",
    category: "logistics",
    featured: true,
  },
  {
    id: 7,
    name: "TechFix Congo",
    contactPerson: "Sun Hao",
    wechat: "sunhao_techfix",
    phone: "+243 81 777 3344",
    area: "Limete, Kinshasa",
    mainService: "Phone repair, laptop repair, generator maintenance, solar panel installation, CCTV systems",
    hasStore: "Yes - Repair shop + small parts inventory, 100 sqm",
    languages: "Chinese, French",
    serviceScope: "All Kinshasa; on-site service for generators and solar systems",
    intro: "TechFix Congo provides professional electronic equipment repair and installation services.",
    image: "/images/guide/repair1.jpg",
    category: "repair",
  },
  {
    id: 8,
    name: "Little Star Chinese School",
    contactPerson: "Ma Li",
    wechat: "mali_school_ksv",
    phone: "+243 82 888 5566",
    area: "Ngaliema, Kinshasa",
    mainService: "Chinese language classes for expat children, French tutoring, homework help, weekend cultural programs",
    hasStore: "Yes - Classroom facility, 150 sqm, 3 classrooms",
    languages: "Chinese, French, English",
    serviceScope: "Kinshasa-based; online classes also available",
    intro: "Little Star Chinese School provides quality Chinese-language education for expat children in Kinshasa.",
    image: "/images/guide/education1.jpg",
    category: "education",
  },
  {
    id: 9,
    name: "Sante Plus Clinic",
    contactPerson: "Dr. Li Hua",
    wechat: "drlihua_ksv",
    phone: "+243 99 222 4455",
    area: "Gombe, Kinshasa",
    mainService: "General practice, Chinese & Western medicine, health checkups, malaria treatment, vaccination, pharmacy",
    hasStore: "Yes - Clinic with pharmacy, 200 sqm",
    languages: "Chinese, French, English",
    serviceScope: "Kinshasa; emergency house calls available 24/7",
    intro: "Sante Plus Clinic is a Chinese-run medical clinic serving the expat community in Kinshasa.",
    image: "/images/guide/medical1.jpg",
    category: "medical",
    featured: true,
  },
  {
    id: 10,
    name: "Congo Home Rental Agency",
    contactPerson: "Huang Min",
    wechat: "huangmin_rental",
    phone: "+243 81 999 6677",
    area: "Gombe, Kinshasa",
    mainService: "Apartment & villa rental, office space, warehouse rental, airport pickup, move-in assistance",
    hasStore: "No - Mobile office; meetings at property sites or cafes",
    languages: "Chinese, French, Lingala",
    serviceScope: "Kinshasa — Gombe, Ngaliema, Limete, Ma Campagne, Binza",
    intro: "Congo Home helps Chinese expats find the perfect home in Kinshasa. Portfolio of 100+ verified properties.",
    image: "/images/guide/rental1.jpg",
    category: "rental",
  },
];

function BusinessCard({ biz }: { biz: Business }) {
  const dict = useDict();
  const t = dict.guide;
  const [expanded, setExpanded] = useState(false);
  const catMeta = CATEGORIES.find((c) => c.key === biz.category);
  const catLabel = t.cat[biz.category as keyof typeof t.cat] ?? biz.category;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={biz.image}
          alt={biz.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {biz.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1">
            <Star size={12} fill="white" /> {t.featuredTag}
          </span>
        )}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 ${catMeta?.color || "bg-gray-500"} text-white text-xs font-semibold rounded-full shadow`}
        >
          {catLabel}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{biz.name}</h3>

        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={15} className="text-red-400 mt-0.5 shrink-0" />
            <span>{biz.area}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Store size={15} className="text-blue-400 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{biz.mainService}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Globe size={15} className="text-green-400 mt-0.5 shrink-0" />
            <span>{biz.languages}</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm text-yellow-600 font-medium hover:text-yellow-700 transition-colors"
        >
          {expanded ? t.buttons.collapse : t.buttons.viewDetails}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 text-sm">
            <Row label={t.fields.contactPerson} value={biz.contactPerson} />
            <Row label={t.fields.wechat} value={biz.wechat} />
            <Row label={t.fields.phone} value={biz.phone} />
            <Row label={t.fields.store} value={biz.hasStore} />
            <Row label={t.fields.scope} value={biz.serviceScope} />
            <Row label={t.fields.main} value={biz.mainService} />
            <Row label={t.fields.about} value={biz.intro} multiline />

            <div className="flex gap-2 pt-2">
              <a
                href={`https://wa.me/${biz.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                <Phone size={14} /> {t.buttons.whatsapp}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(biz.wechat);
                  alert(t.wechatCopied(biz.wechat));
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={14} /> {t.buttons.wechat}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{label}</p>
      <p className={multiline ? "text-gray-700 leading-relaxed" : "text-gray-800 font-medium"}>{value}</p>
    </div>
  );
}

export default function GuidePage() {
  const dict = useDict();
  const t = dict.guide;
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filtered = BUSINESSES.filter((b) => {
    const matchCat = activeCategory === "all" || b.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.mainService.toLowerCase().includes(q) ||
      b.area.toLowerCase().includes(q) ||
      b.intro.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featuredCount = filtered.filter((b) => b.featured).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-5 right-10 w-48 h-48 rounded-full bg-white" />
          <div className="absolute top-20 right-32 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
            <MapPin size={14} />
            {t.location}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">{t.title}</h1>
          <p className="text-base md:text-lg text-emerald-100 mb-1">{t.subtitleZh}</p>
          <p className="text-sm text-emerald-200 max-w-md mx-auto">{t.subtitle}</p>

          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{BUSINESSES.length}</p>
              <p className="text-xs text-emerald-200">{t.stats.businesses}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{CATEGORIES.length - 1}</p>
              <p className="text-xs text-emerald-200">{t.stats.categories}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{featuredCount}</p>
              <p className="text-xs text-emerald-200">{t.stats.featured}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-3 py-2">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 ml-2 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} aria-label="clear">
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="text-sm text-gray-500 shrink-0"
              >
                {dict.common.cancel}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400"
            >
              <Search size={18} />
              {t.searchPlaceholder}
            </button>
          )}
        </div>
      </div>

      <div className="sticky top-[57px] z-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 px-4 py-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl shrink-0 transition-all text-xs font-medium ${
                    isActive
                      ? `${cat.color} text-white shadow-sm`
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {t.cat[cat.key]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {t.found(filtered.length)}
            {activeCategory !== "all" && (
              <span className="ml-1">
                {t.inCategory}{" "}
                <span className="font-medium text-gray-700">{t.cat[activeCategory]}</span>
              </span>
            )}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered
              .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
              .map((biz) => (
                <BusinessCard key={biz.id} biz={biz} />
              ))}
          </div>
        )}
      </div>

      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-1">{t.listYourBizTitle}</h3>
          <p className="text-sm text-emerald-100 mb-4">{t.listYourBizDesc}</p>
          <a
            href="https://wa.me/243823170887?text=Hi%2C%20I%20want%20to%20list%20my%20business%20on%20Kinshasa%20Life%20Guide"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors text-sm"
          >
            <MessageCircle size={16} /> {t.contactWhatsapp}
          </a>
        </div>
      </section>
    </div>
  );
}
