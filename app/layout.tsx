import "./globals.css";
import { notFound } from 'next/navigation';
import { langs } from '@/i18n/request';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}