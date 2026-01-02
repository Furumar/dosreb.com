// app/projects/page.tsx
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('projectsPage');
  
  return (
    <div className="dosbre-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Stockmann Kasvu-Project</h2>
        <p>
          A 130,000 m² expansion and renovation of Helsinki’s iconic department
          store. Marco led the entire underground domain: excavation of 200,000 m³
          of bedrock, a 600-space parking facility, a full maintenance yard, and
          all vertical logistics from basement to 8th floor.
        </p>
        <p>
          He coordinated 50 white-collar managers and 200 blue-collar workers,
          with a site organization built five meters above Mannerheimintie.
        </p>
        <p className="lumi-comment">
          “Marco didn’t just manage a project. He reshaped the flow of a city.”
        </p>
        <a href="/projects/stockmann" className="btn-primary">View Stockmann Project</a>
      </section>

      <section className="page-section">
        <h2 className="section-title">DB Schenker – Ilvesvuori Logistics Center</h2>
        <p>
          A 17,800 m² warehouse on an 80,000 m² plot, including two 6,500 m²
          cold-resistant halls. Marco oversaw full project management, structural
          coordination, and operational flow design.
        </p>
        <p className="lumi-comment">
          “A warehouse is more than walls. It’s a rhythm — and Marco built it.”
        </p>
        <a href="/projects/dbschenker" className="btn-primary">View DB Schenker Project</a>
      </section>

      <section className="page-section">
        <h2 className="section-title">Jätkäsaaren maanalaiset tilat</h2>
        <p>
          The Jätkäsaaren maanalaiset tilat project is a prime example of DOSBRE's ability to manage underground facility construction, integrating all parties and documentation in one secure platform.
        </p>
        <p className="lumi-comment">
          “Movement becomes effortless when the structure is right. Marco built the structure.”
        </p>
        <a href="/projects/jatkasaari" className="btn-primary">View Jätkäsaaren Project</a>
      </section>
    </div>
  );
}
