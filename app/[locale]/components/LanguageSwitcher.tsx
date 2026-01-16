"use client";

import { uselang } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { langs } from '@/i18n/request';

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
  const lang = uselang();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newlang: string) => {
    // Remove the current lang from the pathname
    const pathWithoutlang = pathname.replace(/^\/[a-z]{2,3}/, '');
    // Navigate to the new lang
    router.push(`/${newlang}${pathWithoutlang}`);
  };

  return (
    <div className="language-switcher">
      <select
        value={lang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        {langs.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
