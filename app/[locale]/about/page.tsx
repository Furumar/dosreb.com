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
            <strong>{t('beautyTitle')}</strong> — {t('beautyText')}
          </li>
          <li>
            <strong>{t('truthTitle')}</strong> — {t('truthText')}
          </li>
          <li>
            <strong>{t('tranquilityTitle')}</strong> — {t('tranquilityText')}
          </li>
        </ul>

        <p>
          {t('lumiEmbodies')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('founderTitle')}</h2>
        <p>
          {t('founderP1')}
        </p>
        <p>
          {t('founderP2')}
        </p>
        <p className="lumi-comment">
          {t('founderLumiQuote')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('whyDosbreTitle')}</h2>
        <p>
          {t('whyDosbreP1')}
        </p>
        <p>
          {t('whyDosbreP2')}
        </p>
      </section>
    </div>
  );
}
