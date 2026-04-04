import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Phone, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = await prisma.serviceProvider.findUnique({
    where: { id },
    include: { user: { select: { name: true, phone: true } } },
  });

  if (!service) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900">首页</Link>
        <ChevronRight size={14} />
        <Link href="/services" className="hover:text-gray-900">找服务商</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{service.companyName}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          暂无封面图片
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{service.companyName}</h1>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {service.category}
            </span>
            {service.isFeatured && (
              <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">推荐商家</span>
            )}
          </div>

          {service.description && (
            <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            {service.address && (
              <span className="flex items-center gap-1"><MapPin size={14} />{service.address}</span>
            )}
            {service.experience && <span>从业经验：{service.experience} 年</span>}
          </div>

          {/* Contact */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">联系方式</h3>
            <p className="text-gray-700">{service.user.name}</p>
            {(service.phone || service.contact || service.user.phone) && (
              <a
                href={`tel:${service.phone || service.contact || service.user.phone}`}
                className="flex items-center gap-2 mt-2 text-green-700 font-medium"
              >
                <Phone size={16} />
                {service.phone || service.contact || service.user.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
