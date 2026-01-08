"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
const LumiChat = dynamic(() => import("./components/LumiChat"), { ssr: false });

type FeatureType = 'propertyManagement' | 'constructionProjects' | 'digitalDocumentation' | 'collaboration' | 'security' | null;

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);
  
  const scrollToId = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featureDetails: Record<string, { title: string; description: string; points: string[] }> = {
    propertyManagement: {
      title: t('about.propertyManagement'),
      description: "Comprehensive property management solutions covering all aspects of real estate operations.",
      points: [
        "Legal documentation and compliance tracking",
        "Financial management and reporting",
        "Sales process coordination",
        "Maintenance and service management",
        "Tenant and stakeholder communication",
        "Property portfolio overview"
      ]
    },
    constructionProjects: {
      title: t('about.constructionProjects'),
      description: "End-to-end construction project management for all project phases and stakeholders.",
      points: [
        "Designer collaboration and coordination",
        "Contractor management and scheduling",
        "Authority approvals and compliance",
        "Plan and blueprint management",
        "Progress tracking and reporting",
        "Quality control and inspections"
      ]
    },
    digitalDocumentation: {
      title: t('about.digitalDocumentation'),
      description: "Centralized, secure, and transparent document management system.",
      points: [
        "Cloud-based storage with version control",
        "Organized file structure and categorization",
        "Advanced search and filtering",
        "Access permissions and security",
        "Document sharing and collaboration",
        "Audit trail and history tracking"
      ]
    },
    collaboration: {
      title: t('about.collaboration'),
      description: "Seamless collaboration tools for all project stakeholders.",
      points: [
        "Real-time updates and notifications",
        "Team communication channels",
        "Task assignment and tracking",
        "Shared calendars and schedules",
        "Comment and feedback systems",
        "Multi-user document editing"
      ]
    },
    security: {
      title: t('about.security'),
      description: "Enterprise-grade security protecting your sensitive project data.",
      points: [
        "End-to-end encryption",
        "Role-based access control",
        "Two-factor authentication",
        "Regular security audits",
        "GDPR compliance",
        "Automated backups and disaster recovery"
      ]
    }
  };

  const openFeatureModal = (feature: FeatureType) => {
    setActiveFeature(feature);
  };

  const closeFeatureModal = () => {
    setActiveFeature(null);
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
            <div className="feature-card" onClick={() => openFeatureModal('propertyManagement')} style={{ cursor: 'pointer' }}>
              {t('about.propertyManagement')}
            </div>
            <div className="feature-card" onClick={() => openFeatureModal('constructionProjects')} style={{ cursor: 'pointer' }}>
              {t('about.constructionProjects')}
            </div>
            <div className="feature-card" onClick={() => openFeatureModal('digitalDocumentation')} style={{ cursor: 'pointer' }}>
              {t('about.digitalDocumentation')}
            </div>
            <div className="feature-card" onClick={() => openFeatureModal('collaboration')} style={{ cursor: 'pointer' }}>
              {t('about.collaboration')}
            </div>
            <div className="feature-card" onClick={() => openFeatureModal('security')} style={{ cursor: 'pointer' }}>
              {t('about.security')}
            </div>
          </div>
        </section>

        {/* PROJECTS & CASE STUDIES */}
        <section id="projects" className="section-block">
          <h2>{t('projects.title')}</h2>
          <div className="project-cards">
            <div className="project-card">
              <h3>Stockmann</h3>
              <p>{t('projects.stockmannDescription')}</p>
              <Link href={`/${locale}/projects/stockmann`} className="btn-primary">{t('projects.viewProject')}</Link>
            </div>
            <div className="project-card">
              <h3>DB Schenker</h3>
              <p>{t('projects.dbschenkerDescription')}</p>
              <Link href={`/${locale}/projects/dbschenker`} className="btn-primary">{t('projects.viewProject')}</Link>
            </div>
            <div className="project-card">
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
      
      {/* FEATURE MODAL */}
      {activeFeature && featureDetails[activeFeature] && (
        <div className="modal-overlay" onClick={closeFeatureModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeFeatureModal} aria-label="Close">×</button>
            <h2 className="modal-title">{featureDetails[activeFeature].title}</h2>
            <p className="modal-description">{featureDetails[activeFeature].description}</p>
            <ul className="modal-points">
              {featureDetails[activeFeature].points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
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
