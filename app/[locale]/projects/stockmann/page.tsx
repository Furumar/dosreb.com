import Link from "next/link";

export default function StockmannProject() {
  return (
    <div className="project-page">
      <h1>Stockmann Project</h1>
      <p>
        The Stockmann project is a flagship real estate and construction management case for DOSBRE, demonstrating the platform's ability to handle complex, high-profile developments.
      </p>
      <a href="/downloads/stockmann-project.pdf" download className="btn-primary">Download Project PDF</a>
      <p style={{marginTop: '2rem'}}>
        <Link href="/projects">← Back to Projects</Link>
      </p>
    </div>
  );
}
