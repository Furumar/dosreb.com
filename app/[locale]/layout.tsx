import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import Header from "./components/header";
import dynamic from "next/dynamic";
import "../globals.css";

const LumiChat = dynamic(() => import("./components/LumiChat"), { ssr: false });

export const metadata: Metadata = {
  title: "DOSREB LTD",
  description: "Clarity, structure, and intelligent workflow guidance.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="page-transition-wrapper">
            {children}
          </main>
          <LumiChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
