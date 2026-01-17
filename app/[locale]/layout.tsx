// korvaa koko tiedosto: app/[locale]/layout.tsx
import React from "react";
import type { Metadata } from "next";
import getRequestConfig, { locales } from "@/i18n/request";
// korvaa mahdollinen "@/components/ClientIntlProvider" tai muu virheellinen import
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
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;
  const { messages } = await getRequestConfig({ lang: locale });

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
