import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from './i18n/request';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always use a locale prefix
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Skip middleware for API routes entirely
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return;
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match all paths
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
