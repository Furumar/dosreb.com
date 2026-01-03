"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from 'next-intl';
const LumiChat = dynamic(() => import("./components/LumiChat"), { ssr: false });

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  
  const scrollToId = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dosreb-root">
      {/* MAIN CONTENT */}
      <main className="dosreb-main">

        {/* HERO SECTION */}
        <section className="dosreb-hero" id="top">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">{t('hero.title')}</h1>
              <p className="hero-subtitle" style={{ color: 'rgba(255, 251, 230, 0.9)' }}>
                {t('hero.subtitle')}
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => scrollToId("projects")}>{t('hero.exploreProjects')}</button>
                <button className="btn-secondary-link" onClick={() => router.push(`/${locale}/lumi`)}>{t('hero.meetLumi')}</button>
                <button className="btn-secondary-link" onClick={() => router.push(`/${locale}/demo`)}>{t('hero.requestDemo')}</button>
              </div>
            </div>
            <aside className="hero-aside">
              <Image src="/lumi-hero.png" alt="Lumi, your guide to clarity and ease" width={320} height={320} className="hero-lumi-img" />
            </aside>
          </div>
        </section>

        {/* ABOUT DOSREB */}
        <section id="about" className="section-block">
          <h2>{t('about.title')}</h2>
          <p>{t('about.description')}</p>
          <div className="feature-cards">
            <div className="feature-card">{t('about.propertyManagement')}</div>
            <div className="feature-card">{t('about.constructionProjects')}</div>
            <div className="feature-card">{t('about.digitalDocumentation')}</div>
            <div className="feature-card">{t('about.collaboration')}</div>
            <div className="feature-card">{t('about.security')}</div>
          </div>
        </section>

        {/* PROJECTS & CASE STUDIES */}
        <section id="projects" className="section-block">
          <h2>{t('projects.title')}</h2>
          <div className="project-cards">
            <div className="project-card">
              <Image src="/lumi-hero.png" alt="Stockmann" width={120} height={120} style={{borderRadius: '1rem'}} />
              <h3>Stockmann</h3>
              <p>{t('projects.stockmannDescription')}</p>
              <Link href={`/${locale}/projects/stockmann`} className="btn-primary">{t('projects.viewProject')}</Link>
            </div>
            <div className="project-card">
              <Image src="/lumi-hero.png" alt="DB Schenker" width={120} height={120} style={{borderRadius: '1rem'}} />
              <h3>DB Schenker</h3>
              <p>{t('projects.dbschenkerDescription')}</p>
              <Link href={`/${locale}/projects/dbschenker`} className="btn-primary">{t('projects.viewProject')}</Link>
            </div>
            <div className="project-card">
              <Image src="/lumi-hero.png" alt="Jätkäsaaren maanalaiset tilat" width={120} height={120} style={{borderRadius: '1rem'}} />
              <h3>Jätkäsaaren maanalaiset tilat</h3>
              <p>{t('projects.jatkasaariDescription')}</p>
              <Link href={`/${locale}/projects/jatkasaari`} className="btn-primary">{t('projects.viewProject')}</Link>
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section id="features" className="section-block">
          <h2>{t('features.title')}</h2>
          <ul className="features-list">
            <li><b>{t('features.propertyManagement')}</b></li>
            <li><b>{t('features.constructionManagement')}</b></li>
            <li><b>{t('features.documentManagement')}</b></li>
            <li><b>{t('features.integrations')}</b></li>
          </ul>
        </section>

        {/* MARKET & VISION */}
        <section id="vision" className="section-block">
          <h2>{t('vision.title')}</h2>
          <p>{t('vision.description')}</p>
        </section>

        {/* TEAM & CONTACT */}
        <section id="team" className="section-block">
          <h2>{t('team.title')}</h2>
          <p>{t('team.description')}</p>
        </section>
        <section id="contact" className="section-block">
          <h2>{t('contact.title')}</h2>
          <form className="contact-form">
            <input type="text" placeholder={t('contact.namePlaceholder')} required />
            <input type="email" placeholder={t('contact.emailPlaceholder')} required />
            <textarea placeholder={t('contact.messagePlaceholder')} required />
            <button type="submit" className="btn-primary">{t('contact.sendButton')}</button>
          </form>
        </section>
      </main>
      <LumiChat />
      
      {/* BACK TO TOP BUTTON */}
      <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
        ↑
      </button>

      {/* FOOTER */}
      <footer className="dosreb-footer">
        <div className="footer-links">
          <Link href="#about">{t('nav.about')}</Link> | <Link href="#projects">{t('nav.projects')}</Link> | <Link href="#contact">{t('nav.contact')}</Link> | <Link href="#">{t('footer.privacyPolicy')}</Link>
        </div>
        <div className="footer-socials">
          <a href="#" aria-label="LinkedIn">{t('footer.linkedin')}</a>
        </div>
        <div className="footer-copy">{t('footer.copyright')}</div>
      </footer>

    </div>
  );
}
