import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = [
  'en',
  'sv', // Swedish
  'fi', // Finnish
  'no', // Norwegian
  'da', // Danish
  'es', // Spanish
  'pt', // Portuguese
  'fr', // French
  'de', // German
  'zh', // Chinese
  'ru', // Russian
  'lt', // Lithuanian
  'lv', // Latvian
  'ltg', // Latgalian
  'sgs', // Samogitian
] as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en'; // default fallback
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
