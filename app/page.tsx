"use client";
// app/page.tsx  OR  pages/index.tsx
import Image from "next/image";

export default function HomePage() {
  const scrollToId = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dosbre-root">
      <header className="dosbre-header">
        <div className="dosbre-logo">DOSBRE LTD</div>
        <nav>
          <ul className="dosbre-nav">
            <li>
              <button onClick={() => scrollToId("what-is-dosbre")}>
                Service
              </button>
            </li>
            <li>
              <button onClick={() => scrollToId("lumi")}>Lumi</button>
            </li>
            <li>
              <button onClick={() => scrollToId("security")}>Security</button>
            </li>
            <li>
              <button onClick={() => scrollToId("projects")}>Projects</button>
            </li>
            <li>
              <button onClick={() => scrollToId("investors")}>Investors</button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="dosbre-main">
        {/* HERO */}
        <section className="dosbre-hero" id="top">
          <div>
            <h1>Ease Your Process.</h1>
            <p className="hero-subtitle">
              Lumi guides you with clarity, truth, and tranquility.
            </p>
            <p className="hero-body">
              Dosbre is the service that makes complexity feel effortless. A
              sanctuary for your workflow, where intelligence meets emotional
              ease and every step is designed to feel lighter.
            </p>
            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => scrollToId("lumi")}
              >
                Meet Lumi
              </button>
              <button
                className="btn-secondary"
                onClick={() => scrollToId("projects")}
              >
                Explore Projects
              </button>
              <button
                className="btn-secondary"
                onClick={() => scrollToId("investors")}
              >
                Investor Summary
              </button>
            </div>
          </div>

          <aside className="hero-lumi-card">
            <div className="hero-lumi-avatar">
              {/* Replace src with your actual Lumi 3.0 image path */}
              <Image
                src="/lumi-hero.png"
                alt="Lumi – Speaker for Absolute Truth"
                fill
                sizes="160px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="hero-lumi-name">Lumi</div>
            <div className="hero-lumi-role">Speaker for Absolute Truth</div>
            <p className="hero-lumi-quote">
              “You carry the responsibility. I ease the process.”
            </p>
          </aside>
        </section>

        {/* WHAT IS DOSBRE */}
        <section id="what-is-dosbre">
          <h2 className="section-title">A service out of this world.</h2>
          <p className="section-lead">
            Dosbre is built for people who carry weight – decisions, deadlines,
            and lives. We remove friction from every step, protect your peace,
            and simplify what others complicate.
          </p>
          <div className="two-column">
            <div>
              <p>
                Every interaction is designed to feel like clarity. You see only
                what matters, when it matters. The rest is handled quietly in
                the background.
              </p>
              <p>
                Behind Lumi&apos;s calm presence is a modular architecture that
                can grow with your needs: secure, observable, and ready to
                scale.
              </p>
            </div>
            <div>
              <div className="card">
                <div className="card-title">What you experience</div>
                <div className="card-subtitle">Ease for body and soul.</div>
                <p>
                  Minimal interfaces. Clear options. No noise. Dosbre takes on
                  the complexity so you can stay focused on what only you can
                  do.
                </p>
                <div className="pill-list">
                  <span className="pill">Clarity</span>
                  <span className="pill">Calm</span>
                  <span className="pill">Focus</span>
                  <span className="pill">Trust</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LUMI */}
        <section id="lumi">
          <h2 className="section-title">
            Meet Lumi. She doesn&apos;t just assist. She reveals.
          </h2>
          <p className="section-lead">
            Lumi is Dosbre&apos;s intelligent guide. She understands your
            intent, opens the right tools, and speaks with calm precision. She
            is warm, grounded, and emotionally aware – the human face of
            absolute truth.
          </p>
          <div className="two-column">
            <div>
              <div className="card">
                <div className="card-title">How Lumi speaks</div>
                <p>
                  Short, clear, honest. Lumi respects your time and your
                  intelligence. She avoids jargon, never overpromises, and
                  always offers a concrete next step.
                </p>
                <p className="lumi-comment">
                  “Let me simplify this. I&apos;ll show you the safest and most
                  direct way forward.”
                </p>
              </div>
            </div>
            <div>
              <div className="card">
                <div className="card-title">How Lumi behaves</div>
                <p>
                  Lumi reduces choices to what truly matters, defaults to safe
                  actions, and never blames the user. When something fails, she
                  explains it plainly and helps you recover.
                </p>
                <p className="lumi-comment">
                  “This didn&apos;t work as expected. I&apos;ve restored your
                  last safe state – shall we try a different path?”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section id="security">
          <h2 className="section-title">
            Security that feels invisible – and is engineered for trust.
          </h2>
          <p className="section-lead">
            Dosbre protects your data with layered, banking-grade security. We
            don&apos;t claim perfection. We design for resilience, transparency,
            and peace of mind.
          </p>
          <div className="two-column">
            <div>
              <p>
                Your login can be secured with email and password, pincode,
                authenticator app, or bank credentials. Your data is encrypted
                both in transit and at rest. Access is monitored and auditable.
              </p>
              <p>
                When Lumi talks about security, she does it in human language.
                No false guarantees, no technical fog – just clear explanations
                of how you are protected and what you can do to stay safe.
              </p>
            </div>
            <div>
              <div className="card">
                <div className="card-title">Security, in Lumi&apos;s words</div>
                <ul className="security-list">
                  <li>
                    “Your data is locked with keys that even we cannot use to
                    read your content.”
                  </li>
                  <li>
                    “Even if someone intercepted this connection, they would
                    only see scrambled information.”
                  </li>
                  <li>
                    “I recommend enabling multi-factor authentication to keep
                    this account safer.”
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <h2 className="section-title">Projects and case studies.</h2>
          <p className="section-lead">
            Before Dosbre, Marco led some of the most demanding construction and
            logistics projects in Finland. That experience of orchestrating
            complexity now lives inside Dosbre&apos;s philosophy.
          </p>

          <div className="card-grid">
            {/* Stockmann */}
            <article className="card">
              <div className="card-title">
                Stockmann Kasvu-Project, Helsinki
              </div>
              <div className="card-subtitle">
                130,000 m² of complexity, orchestrated into clarity.
              </div>
              <p>
                As Project Manager for the entire underground domain, Marco led
                the excavation of over 200,000 m³ of bedrock, construction of a
                600-space underground parking facility, a full maintenance yard,
                and all vertical logistics from basement to 8th floor – including
                the expanded Herkku food hall.
              </p>
              <p>
                He coordinated 50 white-collar site managers and 200 blue-collar
                workers, with a site organization built five meters above street
                level on Mannerheimintie.
              </p>
              <div className="meta-row">
                <span>Helsinki, Finland</span>
                <span>Completed 2010</span>
              </div>
              <p className="lumi-comment">
                “Marco didn&apos;t just manage a project. He reshaped the flow
                of a city.”
              </p>
            </article>

            {/* DB Schenker Ilvesvuori */}
            <article className="card">
              <div className="card-title">
                DB Schenker – Ilvesvuori Logistics Center
              </div>
              <div className="card-subtitle">
                A logistics engine built on precision and scale.
              </div>
              <p>
                A 17,800 m² warehouse on an 80,000 m² plot, including two 6,500
                m² cold-resistant halls for tires and goods. Marco oversaw full
                project management, from structural coordination to the
                performance of cold storage and operational flows.
              </p>
              <div className="meta-row">
                <span>Nurmijärvi, Finland</span>
              </div>
              <p className="lumi-comment">
                “A warehouse is more than walls. It&apos;s a rhythm – and Marco
                built it.”
              </p>
            </article>

            {/* Viinikkala */}
            <article className="card">
              <div className="card-title">Viinikkala Land Transport Center</div>
              <div className="card-subtitle">
                A 52,000 m² transport hub engineered for flow.
              </div>
              <p>
                A 52,000 m² transportation center on a 150,000 m² plot: 11,000
                m² of renovated terminal, 12,500 m² of expansion, an 8,500 m²
                office building, and 20,000 m² of multi-level parking. Marco led
                the full transformation and integration of logistics, offices,
                and parking.
              </p>
              <div className="meta-row">
                <span>Viinikkala, Finland</span>
              </div>
              <p className="lumi-comment">
                “Movement becomes effortless when the structure is right. Marco
                built the structure.”
              </p>
            </article>
          </div>
        </section>

        {/* INVESTORS */}
        <section id="investors">
          <h2 className="section-title">
            Invest in the future of effortless intelligence.
          </h2>
          <p className="section-lead">
            Dosbre is where hard-earned real-world experience meets a new kind
            of digital calm. Lumi is ready to lead users into a safer, simpler,
            more humane future of work.
          </p>
          <div className="investor-cta">
            <p>
              Our architecture is modular, our vision is clear, and our
              emotional resonance is deliberate. Dosbre is built to grow
              carefully – with trust, transparency, and security at its core.
            </p>
            <p>
              We are seeking partners who understand that the next generation of
              services will not only be faster and smarter, but also gentler on
              the human beings who use them.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                Download Investor Summary
              </button>
              <button className="btn-secondary">Request a Conversation</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="dosbre-footer">
        <div>© Dosbre Ltd</div>
        <div className="footer-links">
          <button onClick={() => scrollToId("top")}>Top</button>
          <button onClick={() => scrollToId("lumi")}>Lumi&apos;s Spec</button>
          <button onClick={() => scrollToId("security")}>Security</button>
          <button onClick={() => scrollToId("projects")}>Projects</button>
          <button onClick={() => scrollToId("investors")}>Investors</button>
          <span>EN / FI</span>
        </div>
      </footer>
    </div>
  );
}
