"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const lang = useLocale();
  const t = useTranslations('nav');

  const isActive = (path: string) => {
    // Extract lang from pathname to check active state correctly
    const pathWithoutlang = pathname.replace(/^\/[a-z]{2,3}/, '');
    return pathWithoutlang === path || pathWithoutlang === '' && path === '/' ? "nav-active" : "nav-link";
  };

  return (
    <header className="dosreb-header">
      <div className="dosreb-logo">
        <Link href={`/${lang}`}>DOSREB LTD</Link>
      </div>

      <nav>
        <ul className="dosreb-nav">
          <li><Link className={isActive("/")} href={`/${lang}`}>{t('home')}</Link></li>
          <li><Link className={isActive("/about")} href={`/${lang}/about`}>{t('about')}</Link></li>
          <li><Link className={isActive("/lumi")} href={`/${lang}/lumi`}>{t('lumi')}</Link></li>
          <li><Link className={isActive("/projects")} href={`/${lang}/projects`}>{t('projects')}</Link></li>
          <li><Link className={isActive("/real-estates")} href={`/${lang}/real-estates`}>{t('realEstates')}</Link></li>
          <li><Link className={isActive("/contact")} href={`/${lang}/contact`}>{t('contact')}</Link></li>
          <li><LanguageSwitcher /></li>
        </ul>
      </nav>
    </header>
  );
}
