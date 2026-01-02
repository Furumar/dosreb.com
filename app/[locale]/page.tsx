"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslations } from 'next-intl';
const LumiChat = dynamic(() => import("./components/LumiChat"), { ssr: false });

export default function HomePage() {
  const t = useTranslations();
  
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
    <div className="dosbre-root">
      {/* MAIN CONTENT */}
      <main className="dosbre-main">

        {/* HERO SECTION */}
        <section className="dosbre-hero" id="top">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">{t('hero.title')}</h1>
              <p className="hero-subtitle">
                {t('hero.subtitle')}
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => scrollToId("projects")}>{t('hero.exploreProjects')}</button>
                <button className="btn-secondary" onClick={() => scrollToId("lumi")}>{t('hero.meetLumi')}</button>
                <button className="btn-secondary" onClick={() => scrollToId("contact")}>{t('hero.requestDemo')}</button>
              </div>
            </div>
            <aside className="hero-aside">
              <Image src="/lumi-hero.png" alt="Lumi, your guide to clarity and ease" width={320} height={320} className="hero-lumi-img" />
            </aside>
          </div>
        </section>

        {/* ABOUT DOSBRE */}
        <section id="about" className="section-block">
          <h2>{t('about.title')}</h2>
          <p>{t('about.description')}</p>
          <div className="feature-cards">
            <div className="feature-card">{t('about.propertyManagement')}</div>
            <div className="feature-card">{t('about.constructionProjects')}</div>
            <div className="feature-card">{t('about.digitalDocumentation')}</div>
            <div className="feature-card">Collaboration</div>
            <div className="feature-card">Security</div>
          </div>
        </section>

        {/* PROJECTS & CASE STUDIES */}
        <section id="projects" className="section-block">
          <h2>{t('projects.title')}</h2>
          <div className="project-cards">
            <div className="project-card">
              <Image src="/lumi-hero.png" alt="Stockmann" width={120} height={120} style={{borderRadius: '1rem'}} />
              <h3>Stockmann</h3>
              <p>Flagship real estate and construction management case for DOSBRE.</p>
              <Link href="/projects/stockmann" className="btn-primary">View Project</Link>
            </div>
            <div className="project-card">
              <Image src="/lumi-hero.png" alt="DB Schenker" width={120} height={120} style={{borderRadius: '1rem'}} />
              <h3>DB Schenker</h3>
              <p>Logistics and infrastructure project, seamless collaboration for all stakeholders.</p>
              <Link href="/projects/dbschenker" className="btn-primary">View Project</Link>
            </div>
            <div className="project-card">
              <Image src="/lumi-hero.png" alt="Jätkäsaaren maanalaiset tilat" width={120} height={120} style={{borderRadius: '1rem'}} />
              <h3>Jätkäsaaren maanalaiset tilat</h3>
              <p>Underground facility construction, integrating all parties and documentation.</p>
              <Link href="/projects/jatkasaari" className="btn-primary">View Project</Link>
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section id="features" className="section-block">
          <h2>Platform Features</h2>
          <ul className="features-list">
            <li><b>Property Management:</b> Legal, Financing, Sales, Services</li>
            <li><b>Construction Project Management:</b> Designers, Contractors, Authorities, Plan Management</li>
            <li><b>Document Management:</b> Centralized, secure, transparent</li>
            <li><b>Integrations:</b> e-signature, maps, payments</li>
          </ul>
        </section>

        {/* MARKET & VISION */}
        <section id="vision" className="section-block">
          <h2>Market & Vision</h2>
          <p>The real estate and construction industry is one of the largest in Finland and Europe. DOSBRE’s vision: One platform for all — from Finland to the world.</p>
        </section>

        {/* TEAM & CONTACT */}
        <section id="team" className="section-block">
          <h2>Our Team</h2>
          <p>Founder, software developers, UI/UX designer, industry experts, and customer service.</p>
        </section>
        <section id="contact" className="section-block">
          <h2>{t('contact.title')}</h2>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Message" required />
            <button type="submit" className="btn-primary">Send</button>
          </form>
        </section>
      </main>
      <LumiChat />
      
      {/* BACK TO TOP BUTTON */}
      <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
        ↑
      </button>

      {/* FOOTER */}
      <footer className="dosbre-footer">
        <div className="footer-links">
          <Link href="#about">{t('nav.about')}</Link> | <Link href="#projects">{t('nav.projects')}</Link> | <Link href="#contact">{t('nav.contact')}</Link> | <Link href="#">Privacy Policy</Link>
        </div>
        <div className="footer-socials">
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </div>
        <div className="footer-copy">{t('footer.copyright')}</div>
      </footer>

    </div>
  );
}
