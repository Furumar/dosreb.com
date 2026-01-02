// app/real-estates/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function RealEstatesPage() {
  const t = await getTranslations('realEstatesPage');
  
  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('portfolioTitle')}</h2>
        <p>
          {t('portfolioText')}
        </p>
        <p className="lumi-comment">
          {t('lumiQuote')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('comingSoonTitle')}</h2>
        <p>
          {t('comingSoonText')}
        </p>
      </section>
    </div>
  );
}
