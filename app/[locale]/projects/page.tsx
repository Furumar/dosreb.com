// app/projects/page.tsx
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('projectsPage');
  
  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('stockmann.title')}</h2>
        <p>
          {t('stockmann.description1')}
        </p>
        <p>
          {t('stockmann.description2')}
        </p>
        <p className="lumi-comment">
          {t('stockmann.lumiQuote')}
        </p>
        <Link href={`/${locale}/projects/stockmann`} className="btn-primary">{t('viewProject')}</Link>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('dbschenker.title')}</h2>
        <p>
          {t('dbschenker.description')}
        </p>
        <p className="lumi-comment">
          {t('dbschenker.lumiQuote')}
        </p>
        <Link href={`/${locale}/projects/dbschenker`} className="btn-primary">{t('viewProject')}</Link>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('jatkasaari.title')}</h2>
        <p>
          {t('jatkasaari.description')}
        </p>
        <p className="lumi-comment">
          {t('jatkasaari.lumiQuote')}
        </p>
        <Link href={`/${locale}/projects/jatkasaari`} className="btn-primary">{t('viewProject')}</Link>
      </section>
    </div>
  );
}
