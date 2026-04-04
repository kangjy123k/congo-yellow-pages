import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const main = searchParams.get("main");
  const cat = searchParams.get("cat");

  const products = await prisma.product.findMany({
    where: {
      status: "active",
      ...(main ? { mainCategory: main } : {}),
      ...(cat ? { category: cat } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { title, description, price, priceUnit, category, mainCategory, listingType, inventoryType, contact, location } = data;

    if (!title || !category || !mainCategory || !listingType || !inventoryType) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title, description, price: price ? Number(price) : null,
        priceUnit, category, mainCategory, listingType, inventoryType,
        contact, location, userId: session.user.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
