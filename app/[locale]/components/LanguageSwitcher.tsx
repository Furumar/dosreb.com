"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n/request';

const languageNames: Record<string, string> = {
  en: 'English',
  sv: 'Svenska',
  fi: 'Suomi',
  no: 'Norsk',
  da: 'Dansk',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ru: 'Русский',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  ltg: 'Latgalīšu',
  sgs: 'Žemaitėška',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2,3}/, '');
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="language-switcher">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
