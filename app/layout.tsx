// app/layout.tsx
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

export const metadata = {
  title: "Dosbre Ltd",
  description: "Ease Your Process",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="dosbre-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
