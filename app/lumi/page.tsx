"use client";
import Image from "next/image";

export default function HomePage() {
  const scrollToId = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dosbre-root">

      {/* MAIN CONTENT */}
      <main className="dosbre-main">
      </header>

      {/* MAIN CONTENT */}
      <main className="dosbre-main">

        {/* HERO SECTION */}
        <section className="dosbre-hero" id="top">
          <div>
            <h1>Ease Your Process.</h1>

            <p className="hero-subtitle">
              Lumi guides you with clarity, truth, and tranquility.
            </p>

            <p className="hero-body">
              Dosbre is the service that makes complexity feel effortless.
              It is a sanctuary for your workflow, where intelligence meets emotional ease
              and every step is designed to feel lighter.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollToId("lumi")}>
                Meet Lumi
              </button>

              <button className="btn-secondary" onClick={() => scrollToId("projects")}>
                Explore Projects
              </button>

              <button className="btn-secondary" onClick={() => scrollToId("investors")}>
                Investor Summary
              </button>
            </div>
          </div>
        </section>

        {/* SERVICE SECTION */}
        <section id="what-is-dosbre" className="section-block">
          <h2>What is Dosbre?</h2>
          <p>
            Dosbre is a clarity engine. It is a system designed to remove friction,
            reduce cognitive load, and make every process feel lighter.
          </p>
        </section>

        {/* LUMI SECTION */}
        <section id="lumi" className="section-block">
          <h2>Meet Lumi</h2>

          <Image
            src="/lumi-hero.png"
            alt="Lumi"
            width={300}
            height={300}
            className="lumi-image"
          />

          <p>
            Lumi is your guide. It is a calm and intelligent presence that helps you
            navigate complexity with ease and confidence.
          </p>
        </section>

        {/* SECURITY SECTION */}
        <section id="security" className="section-block">
          <h2>Security</h2>
          <p>
            Your data is handled with integrity and care. Dosbre is built with safety,
            transparency, and trust at its core.
          </p>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="section-block">
          <h2>Projects</h2>
          <p>
            Dosbre brings clarity to logistics, real estate, infrastructure, and many
            other domains. Every project benefits from a structured and thoughtful approach.
          </p>
        </section>

        {/* INVESTORS SECTION */}
        <section id="investors" className="section-block">
          <h2>Investor Summary</h2>
          <p>
            Here you will find our funding goals, strategic roadmap, and a clear summary
            of our long-term vision.
          </p>
        </section>

      </main>

    </div>
  );
}
