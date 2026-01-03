import "./globals.css";
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Client-side safety: ensure hero subtitle color in browsers when CSS chunks may lag */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          try{
            var set = function(){
              var el = document.querySelector('.hero-subtitle');
              if(el) el.style.color = 'rgba(255, 251, 230, 0.9)';
            };
            if(document.readyState === 'complete' || document.readyState === 'interactive') set(); else document.addEventListener('DOMContentLoaded', set);
          }catch(e){/* ignore */}
        })();
      `}} />
      {children}
    </>
  );
}
