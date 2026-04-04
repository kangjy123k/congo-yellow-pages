import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");

  const services = await prisma.serviceProvider.findMany({
    where: {
      status: "active",
      ...(cat ? { category: cat } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { companyName, description, category, contact, phone, address, experience } = data;

    if (!companyName || !category) {
      return NextResponse.json({ error: "公司名称和分类为必填项" }, { status: 400 });
    }

    const service = await prisma.serviceProvider.create({
      data: {
        companyName, description, category, contact, phone, address,
        experience: experience ? Number(experience) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
