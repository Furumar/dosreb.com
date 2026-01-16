import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const langs = [
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

export type lang = (typeof langs)[number];

export default getRequestConfig(async ({ requestlang }) => {
  // Typically corresponds to the `[lang]` segment
  let lang = await requestlang;
  
  // Validate that the incoming `lang` parameter is valid
  if (!lang || !langs.includes(lang as lang)) {
    lang = 'en'; // default fallback
  }

  return {
    lang,
    messages: (await import(`./messages/${lang}.json`)).default
  };
});
