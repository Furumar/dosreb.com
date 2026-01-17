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

type LocaleParams = { locale?: string } | Promise<{ locale?: string }>;

type LocaleLayoutProps = {
  children: React.ReactNode;
  params?: LocaleParams;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const resolvedParams = params ? await params : {};
  const locale = resolvedParams?.locale ? String(resolvedParams.locale) : "en";

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
