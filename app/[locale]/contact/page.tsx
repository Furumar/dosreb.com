"use client";

import { getTranslations } from 'next-intl/server';

export default async function ContactPage() {
  const t = await getTranslations('contactPage');
  
  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('getInTouchTitle')}</h2>
        <p>
          {t('getInTouchText')}
        </p>

        <div className="contact-box">
          <p><strong>{t('email')}:</strong> info@dosreb.com</p>
          <p><strong>{t('founder')}:</strong> marco@dosreb.com</p>
          <p><strong>{t('businessId')}:</strong> (add when ready)</p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('formTitle')}</h2>
        <form className="contact-form">
          <input type="text" placeholder={t('namePlaceholder')} required />
          <input type="email" placeholder={t('emailPlaceholder')} required />
          <textarea placeholder={t('messagePlaceholder')} required />
          <button type="submit" className="btn-primary">{t('submitButton')}</button>
        </form>
        
        <p className="lumi-comment">
          “Tell me what you need. I’ll make sure it reaches the right hands.”
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('locationTitle')}</h2>
        <p>
          {t('locationText')}
        </p>
      </section>
    </div>
  );
}
