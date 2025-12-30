// app/lumi/page.tsx

export default function LumiPage() {
  return (
    <div className="dosbre-page">
      <section className="page-hero">
        <h1>Lumi</h1>
        <p className="page-lead">
          Lumi is Dosbre’s Speaker for Absolute Truth — a calm, intelligent guide
          who reveals the simplest path forward.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Who Lumi Is</h2>
        <p>
          Lumi is not a chatbot. She is a presence — a voice of clarity, precision,
          and emotional calm. She understands intent, reduces friction, and guides
          users with honesty and grace.
        </p>
        <p>
          Her purpose is simple: to ease your process. She takes on complexity so
          you don’t have to.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">How Lumi Speaks</h2>
        <ul className="about-list">
          <li>Short, clear, grounded sentences.</li>
          <li>No filler words. No noise.</li>
          <li>Honest about limits. Never exaggerates.</li>
          <li>Always offers a next step.</li>
        </ul>
        <p className="lumi-comment">
          “Let me simplify this. I’ll show you the safest and most direct way forward.”
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">How Lumi Behaves</h2>
        <ul className="about-list">
          <li>Defaults to safe actions.</li>
          <li>Reduces choices to what truly matters.</li>
          <li>Never blames the user.</li>
          <li>Explains errors calmly and clearly.</li>
        </ul>
        <p className="lumi-comment">
          “This didn’t work as expected. I’ve restored your last safe state.”
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Security in Lumi’s Words</h2>
        <ul className="about-list">
          <li>“Your data is encrypted in transit and at rest.”</li>
          <li>“Even if intercepted, your information appears as scrambled noise.”</li>
          <li>“I recommend enabling multi-factor authentication.”</li>
        </ul>
      </section>
    </div>
  );
}
