import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dailyHash(ip: string, ua: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${ua}|${day}`).digest("hex").slice(0, 24);
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const path: string = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
    const locale: string | null = typeof body.locale === "string" ? body.locale.slice(0, 8) : null;

    if (path.startsWith("/api") || path.startsWith("/_next")) {
      return NextResponse.json({ skipped: true });
    }

    const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);
    if (/bot|crawler|spider|preview|fetch|monitor/i.test(ua)) {
      return NextResponse.json({ skipped: "bot" });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "0.0.0.0";
    const country = req.headers.get("x-vercel-ip-country") ?? null;
    const region = req.headers.get("x-vercel-ip-country-region") ?? null;
    const cityRaw = req.headers.get("x-vercel-ip-city") ?? null;
    const city = cityRaw ? safeDecode(cityRaw) : null;
    const postalCode = req.headers.get("x-vercel-ip-postal-code") ?? null;
    const lat = req.headers.get("x-vercel-ip-latitude");
    const lng = req.headers.get("x-vercel-ip-longitude");
    const latitude = lat ? Number(lat) : null;
    const longitude = lng ? Number(lng) : null;
    const referrer = req.headers.get("referer") ?? null;
    const sessionId = dailyHash(ip, ua);

    await prisma.pageView.create({
      data: {
        path,
        locale,
        referrer: referrer?.slice(0, 200),
        country,
        region,
        city,
        postalCode,
        latitude: Number.isFinite(latitude) ? latitude : null,
        longitude: Number.isFinite(longitude) ? longitude : null,
        ip,
        sessionId,
        userAgent: ua,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("track error", e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
