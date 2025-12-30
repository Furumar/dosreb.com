"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? "nav-active" : "nav-link";

  return (
    <header className="dosbre-header">
      <div className="dosbre-logo">
        <Link href="/">DOSBRE LTD</Link>
      </div>

      <nav>
        <ul className="dosbre-nav">
          <li><Link className={isActive("/")} href="/">Home</Link></li>
          <li><Link className={isActive("/about")} href="/about">About</Link></li>
          <li><Link className={isActive("/lumi")} href="/lumi">Lumi</Link></li>
          <li><Link className={isActive("/projects")} href="/projects">Projects</Link></li>
          <li><Link className={isActive("/real-estates")} href="/real-estates">Real Estates</Link></li>
          <li><Link className={isActive("/contact")} href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
