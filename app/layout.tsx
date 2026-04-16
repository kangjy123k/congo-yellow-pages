import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import PageViewTracker from "@/components/PageViewTracker";
import RegisterSW from "@/components/RegisterSW";
import { getDict } from "@/lib/i18n/server";
import { LOCALE_COOKIE, resolveLocale } from "@/lib/i18n/types";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#eab308",
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    appleWebApp: { capable: true, statusBarStyle: "default", title: "Congo BTP" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const initialLocale = resolveLocale(store.get(LOCALE_COOKIE)?.value);

  return (
    <html lang={initialLocale} className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://loremflickr.com" crossOrigin="" />
        <link rel="preconnect" href="https://live.staticflickr.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://loremflickr.com" />
        <link rel="dns-prefetch" href="https://live.staticflickr.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <NextTopLoader color="#111827" height={2.5} showSpinner={false} shadow="0 0 10px #111827,0 0 5px #111827" />
        <I18nProvider initialLocale={initialLocale}>
          <PageViewTracker />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </I18nProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
