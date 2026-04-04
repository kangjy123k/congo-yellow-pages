import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");

  const projects = await prisma.project.findMany({
    where: {
      status: "open",
      ...(cat ? { category: cat } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { title, description, category, budget, budgetUnit, location, deadline, contact } = data;

    if (!title || !description) {
      return NextResponse.json({ error: "标题和描述为必填项" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title, description, category, budget: budget ? Number(budget) : null,
        budgetUnit, location, deadline, contact, userId: session.user.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
