import Link from "next/link";

export default function JatkasaariProject() {
  return (
    <div className="project-page">
      <h1>Jätkäsaaren maanalaiset tilat</h1>
      <p>
        The Jätkäsaaren maanalaiset tilat project is a prime example of DOSBRE's ability to manage underground facility construction, integrating all parties and documentation in one secure platform.
      </p>
      <a href="/downloads/jatkasaari-project.pdf" download className="btn-primary">Download Project PDF</a>
      <p style={{marginTop: '2rem'}}>
        <Link href="/projects">← Back to Projects</Link>
      </p>
    </div>
  );
}
