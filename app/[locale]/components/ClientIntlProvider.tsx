// uusi tiedosto: components/ClientIntlProvider.tsx
"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
};

export default function ClientIntlProvider({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
