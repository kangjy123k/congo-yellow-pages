import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, description, category, budget } = await req.json();

    if (!name || !phone || !description) {
      return NextResponse.json({ error: "姓名、电话和需求描述为必填项" }, { status: 400 });
    }

    const demand = await prisma.demand.create({
      data: { name, phone, description, category, budget },
    });

    return NextResponse.json({ id: demand.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function GET() {
  const demands = await prisma.demand.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(demands);
}
