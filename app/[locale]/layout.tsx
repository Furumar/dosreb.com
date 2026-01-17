// app/[locale]/layout.tsx
import React from "react";
import type { Metadata } from "next";
import getRequestConfig, { locales } from "@/i18n/request";
import ClientIntlProvider from "./components/ClientIntlProvider";

export const metadata: Metadata = {
  title: "DOSREB LTD",
  description: "Clarity, structure, and intelligent workflow guidance."
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params?: { locale?: string };
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Varmista, että locale on merkkijono; fallback 'en'
  const locale = (params && params.locale) ? String(params.locale) : "en";

  // Hae messages serverissä; getRequestConfig palauttaa { lang, messages }
  const cfg = await getRequestConfig({ lang: locale });
  const messages = cfg?.messages ?? {};

  return (
    <html lang={locale}>
      <body>
        <ClientIntlProvider locale={locale} messages={messages}>
          {children}
        </ClientIntlProvider>
      </body>
    </html>
  );
}
