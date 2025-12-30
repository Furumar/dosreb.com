// app/contact/page.tsx

export default function ContactPage() {
  return (
    <div className="dosbre-page">
      <section className="page-hero">
        <h1>Contact</h1>
        <p className="page-lead">
          If you want to reach Dosbre, collaborate, invest, or simply ask a question,
          Lumi will guide your message to the right place.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Get in touch</h2>
        <p>
          You can contact us directly by email. We respond calmly, clearly, and with
          respect for your time.
        </p>

        <div className="contact-box">
          <p><strong>Email:</strong> info@dosbre.com</p>
          <p><strong>Founder:</strong> marco@dosbre.com</p>
          <p><strong>Business ID:</strong> (add when ready)</p>
        </div>

        <p className="lumi-comment">
          “Tell me what you need. I’ll make sure it reaches the right hands.”
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Location</h2>
        <p>
          Dosbre Ltd is based in Finland. We work globally, digitally, and with
          intention.
        </p>
      </section>
    </div>
  );
}
