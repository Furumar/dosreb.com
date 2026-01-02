"use client";
// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="dosbre-footer">
      <div>© Dosreb Ltd</div>

      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/lumi">Lumi</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/real-estates">Real Estates</Link>
        <Link href="/contact">Contact</Link>
        <span>EN / FI</span>
      </div>
    </footer>
  );
}
