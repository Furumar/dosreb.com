import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/header";

export const metadata: Metadata = {
  title: "DOSREB LTD",
  description: "Clarity, structure, and intelligent workflow guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page-transition-wrapper">
          {children}
        </main>
      </body>
    </html>
  );
}
