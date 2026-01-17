"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
};

export default function ClientIntlProvider({ children, locale, messages }: Props) {
  // Varmista, että locale on merkkijono ja messages on objekti
  return (
    <NextIntlClientProvider locale={String(locale)} messages={messages ?? {}}>
      {children}
    </NextIntlClientProvider>
  );
}
