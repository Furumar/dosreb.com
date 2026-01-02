import "./globals.css";
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
