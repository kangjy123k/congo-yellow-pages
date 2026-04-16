import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Phone, MapPin } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 300;

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [dict, product] = await Promise.all([
    getDict(),
    prisma.product.findUnique({
      where: { id },
      include: { user: { select: { name: true, phone: true } } },
    }),
  ]);

  if (!product) notFound();

  const images = product.images ? (JSON.parse(product.images) as string[]) : [];
  const t = dict.productDetail;
  const tMain = dict.categories.productMain[product.mainCategory as keyof typeof dict.categories.productMain] ?? product.mainCategory;
  const tSub = dict.categories.productSub[product.category as keyof typeof dict.categories.productSub] ?? product.category;
  const listingLabel = product.listingType === "sell" ? dict.categories.listing.sell : product.listingType === "rent" ? dict.categories.listing.rent : dict.categories.listing.both;
  const inventoryLabel = product.inventoryType === "local" ? dict.categories.inventory.local : dict.categories.inventory.china;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">{dict.nav.home}</Link>
        <ChevronRight size={14} />
        <Link
          href={`/products?main=${encodeURIComponent(product.mainCategory)}`}
          className="hover:text-gray-900"
        >
          {tMain}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative bg-gray-100 rounded-xl h-72 flex items-center justify-center text-gray-400 overflow-hidden">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            t.noImage
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{tSub}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{listingLabel}</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              {product.inventoryType === "local" ? `📦 ${inventoryLabel}` : `🚢 ${inventoryLabel}`}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>

          {product.price ? (
            <p className="text-3xl font-black text-yellow-600 mb-4">
              ${product.price}
              {product.priceUnit && (
                <span className="text-base font-normal text-gray-500"> / {product.priceUnit}</span>
              )}
            </p>
          ) : (
            <p className="text-lg text-gray-500 mb-4">{t.priceOnDemand}</p>
          )}

          {product.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
          )}

          {product.location && (
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <MapPin size={14} />
              {product.location}
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">{t.contactSeller}</h3>
            <p className="text-gray-700">{product.user.name}</p>
            {(product.contact || product.user.phone) && (
              <a
                href={`tel:${product.contact || product.user.phone}`}
                className="flex items-center gap-2 mt-2 text-yellow-700 font-medium"
              >
                <Phone size={16} />
                {product.contact || product.user.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
