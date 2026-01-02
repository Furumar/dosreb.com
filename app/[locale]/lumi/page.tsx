import { getTranslations } from 'next-intl/server';
import Image from "next/image";

export default async function LumiPage() {
  const t = await getTranslations('lumiPage');
  
  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      <section className="page-section">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Image
            src="/lumi-hero.png"
            alt="Lumi"
            width={300}
            height={300}
            style={{ borderRadius: '1rem' }}
          />
        </div>
        
        <h2 className="section-title">{t('whoIsLumiTitle')}</h2>
        <p>
          {t('whoIsLumiText')}
        </p>
        
        <p className="lumi-comment">
          "{t('lumiQuote')}"
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('philosophyTitle')}</h2>
        <p>
          {t('philosophyText')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">{t('howLumiHelpsTitle')}</h2>
        <p>
          {t('howLumiHelpsText')}
        </p>
      </section>
    </div>
  );
}
