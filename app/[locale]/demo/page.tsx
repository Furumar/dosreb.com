// app/demo/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function DemoPage() {
  const t = await getTranslations('demoPage');
  
  return (
    <div className="dosbre-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('whyRequestTitle')}</h2>
        <p>
          {t('whyRequestText')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('formTitle')}</h2>
        <form className="contact-form">
          <input type="text" placeholder={t('namePlaceholder')} required />
          <input type="email" placeholder={t('emailPlaceholder')} required />
          <input type="text" placeholder={t('companyPlaceholder')} />
          <textarea placeholder={t('messagePlaceholder')} required />
          <button type="submit" className="btn-primary">{t('submitButton')}</button>
        </form>
        
        <p className="lumi-comment">
          {t('lumiComment')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('whatToExpectTitle')}</h2>
        <p>
          {t('whatToExpectText')}
        </p>
      </section>
    </div>
  );
}
