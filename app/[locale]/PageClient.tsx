// app/[locale]/PageClient.tsx (uusi tiedosto)
"use client";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PageClient() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(null);

  return <div>{t("welcome")}</div>;
}
