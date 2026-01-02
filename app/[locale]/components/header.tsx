"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');

  const isActive = (path: string) => {
    // Extract locale from pathname to check active state correctly
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2,3}/, '');
    return pathWithoutLocale === path || pathWithoutLocale === '' && path === '/' ? "nav-active" : "nav-link";
  };

  return (
    <header className="dosreb-header">
      <div className="dosreb-logo">
        <Link href={`/${locale}`}>DOSREB LTD</Link>
      </div>

      <nav>
        <ul className="dosreb-nav">
          <li><Link className={isActive("/")} href={`/${locale}`}>{t('home')}</Link></li>
          <li><Link className={isActive("/about")} href={`/${locale}/about`}>{t('about')}</Link></li>
          <li><Link className={isActive("/lumi")} href={`/${locale}/lumi`}>{t('lumi')}</Link></li>
          <li><Link className={isActive("/projects")} href={`/${locale}/projects`}>{t('projects')}</Link></li>
          <li><Link className={isActive("/real-estates")} href={`/${locale}/real-estates`}>{t('realEstates')}</Link></li>
          <li><Link className={isActive("/contact")} href={`/${locale}/contact`}>{t('contact')}</Link></li>
          <li><LanguageSwitcher /></li>
        </ul>
      </nav>
    </header>
  );
}
