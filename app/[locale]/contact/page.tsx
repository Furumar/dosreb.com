// app/contact/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function ContactPage() {
  const t = await getTranslations('contactPage');
  
  return (
    <div className="dosbre-page">
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
