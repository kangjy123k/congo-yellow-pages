import type { Metadata } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getDict } from "@/lib/i18n/server";
import { LOCALE_COOKIE, resolveLocale } from "@/lib/i18n/types";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
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
      <body className="min-h-full flex flex-col bg-gray-50">
        <NextTopLoader color="#111827" height={2.5} showSpinner={false} shadow="0 0 10px #111827,0 0 5px #111827" />
        <I18nProvider initialLocale={initialLocale}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
