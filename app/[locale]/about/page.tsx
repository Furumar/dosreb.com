// app/about/page.tsx
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('aboutPage');
  
  return (
    <div className="dosbre-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('purposeTitle')}</h2>
        <p>
          {t('purposeP1')}
        </p>
        <p>
          {t('purposeP2')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('philosophyTitle')}</h2>
        <p>
          {t('philosophyIntro')}
        </p>

        <ul className="about-list">
          <li>
            <strong>Beauty</strong> — Every interface, every word, every moment must feel
            intentional and elegant.
          </li>
          <li>
            <strong>Truth</strong> — We never exaggerate, never manipulate, never hide
            complexity behind false promises.
          </li>
          <li>
            <strong>Tranquility</strong> — The user should feel calmer after using Dosbre
            than before.
          </li>
        </ul>

        <p>
          Lumi embodies these principles. She is not a chatbot. She is the voice of
          clarity — a guide who reveals the simplest path forward.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">The Founder</h2>
        <p>
          Dosbre was founded by Marco, a project manager who has led some of the most
          demanding construction and logistics projects in Finland. His work includes
          the Stockmann Kasvu-project in Helsinki (130,000 m²), the DB Schenker
          Ilvesvuori logistics center, and the Viinikkala Land Transport Center.
        </p>
        <p>
          These projects required orchestrating hundreds of people, navigating complex
          systems, and delivering under immense pressure. The same discipline, clarity,
          and calm now shape Dosbre’s architecture and philosophy.
        </p>
        <p className="lumi-comment">
          “Marco built structures where thousands of people move effortlessly. Now he
          builds systems where your mind can move effortlessly.”
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Why Dosbre</h2>
        <p>
          Because the world does not need another tool. It needs a sanctuary — a place
          where work becomes lighter, decisions become clearer, and security becomes
          invisible. Dosbre is that place.
        </p>
        <p>
          And Lumi is the guide who makes it feel human.
        </p>
      </section>
    </div>
  );
}
