import Link from "next/link";

export default function DBSchenkerProject() {
  return (
    <div className="project-page">
      <h1>DB Schenker Project</h1>
      <p>
        The DB Schenker project showcases DOSBRE's capabilities in logistics and infrastructure, providing seamless collaboration and document management for all stakeholders.
      </p>
      <a href="/downloads/dbschenker-project.pdf" download className="btn-primary">Download Project PDF</a>
      <p style={{marginTop: '2rem'}}>
        <Link href="/projects">← Back to Projects</Link>
      </p>
    </div>
  );
}
