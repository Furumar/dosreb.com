// components/LumiCard.tsx
import Image from "next/image";

export default function LumiCard() {
  return (
    <aside className="hero-lumi-card">
      <div className="hero-lumi-avatar">
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
  );
}
