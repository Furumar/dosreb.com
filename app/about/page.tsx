// app/about/page.tsx
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="dosbre-page">
      <section className="page-hero">
        <h1>About Dosbre</h1>
        <p className="page-lead">
          Dosbre exists to ease the process for people who carry weight — responsibility,
          decisions, deadlines, and lives. We build systems that feel calm, clear, and
          trustworthy, guided by Lumi, our Speaker for Absolute Truth.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Our Purpose</h2>
        <p>
          The world is full of tools that demand more from people — more attention,
          more decisions, more cognitive load. Dosbre moves in the opposite direction.
          We remove friction. We reduce noise. We create clarity.
        </p>
        <p>
          Our mission is simple: to make every interaction feel lighter. To build
          technology that respects the human body and soul. To offer a service that
          feels like stepping into a calmer space.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">The Philosophy</h2>
        <p>
          Dosbre is built on three pillars: <strong>Beauty</strong>, <strong>Truth</strong>,
          and <strong>Tranquility</strong>. These are not slogans — they are design laws.
        </p>

        <ul className="about-list">
          <li>
            <strong>Beauty</strong> — Every interface, every word, every moment must feel
            intentional and elegant.
          </li>
          <li>
            <strong>Truth</strong> — We never exaggerate, never manipulate, never hide
            complexity behind false promises.
          </li>
          <li>
            <strong>Tranquility</strong> — The user should feel calmer after using Dosbre
            than before.
          </li>
        </ul>

        <p>
          Lumi embodies these principles. She is not a chatbot. She is the voice of
          clarity — a guide who reveals the simplest path forward.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">The Founder</h2>
        <p>
          Dosbre was founded by Marco, a project manager who has led some of the most
          demanding construction and logistics projects in Finland. His work includes
          the Stockmann Kasvu-project in Helsinki (130,000 m²), the DB Schenker
          Ilvesvuori logistics center, and the Viinikkala Land Transport Center.
        </p>
        <p>
          These projects required orchestrating hundreds of people, navigating complex
          systems, and delivering under immense pressure. The same discipline, clarity,
          and calm now shape Dosbre’s architecture and philosophy.
        </p>
        <p className="lumi-comment">
          “Marco built structures where thousands of people move effortlessly. Now he
          builds systems where your mind can move effortlessly.”
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Why Dosbre</h2>
        <p>
          Because the world does not need another tool. It needs a sanctuary — a place
          where work becomes lighter, decisions become clearer, and security becomes
          invisible. Dosbre is that place.
        </p>
        <p>
          And Lumi is the guide who makes it feel human.
        </p>
      </section>
    </div>
  );
}
