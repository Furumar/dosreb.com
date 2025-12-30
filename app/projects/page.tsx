// app/projects/page.tsx

export default function ProjectsPage() {
  return (
    <div className="dosbre-page">
      <section className="page-hero">
        <h1>Projects & Case Studies</h1>
        <p className="page-lead">
          Before Dosbre, Marco led some of Finland’s most demanding construction
          and logistics projects. These case studies demonstrate the discipline,
          clarity, and calm that now shape Dosbre’s philosophy.
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
      </section>

      <section className="page-section">
        <h2 className="section-title">Viinikkala Land Transport Center</h2>
        <p>
          A 52,000 m² transportation hub on a 150,000 m² plot: 11,000 m² renovated
          terminal, 12,500 m² expansion, 8,500 m² office building, and 20,000 m²
          multi-level parking. Marco led the full transformation.
        </p>
        <p className="lumi-comment">
          “Movement becomes effortless when the structure is right. Marco built the structure.”
        </p>
      </section>
    </div>
  );
}
