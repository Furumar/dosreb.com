// i18n/request.ts
// Kopioitavaksi: vie sekä 'langs' että 'locales' ja default-exportin getRequestConfig

export const langs = ['en', 'sg'] as const;
export const locales = langs; // alias, jotta molemmat import‑nimet toimivat
export type Locale = (typeof langs)[number];

type GetRequestConfigParams = {
  lang?: string | Promise<string> | undefined;
};

export default async function getRequestConfig(params: GetRequestConfigParams) {
  // Resolvoi mahdollinen Promise<string>
  let lang = await params?.lang;

  // Normalisoi ja validoi
  if (typeof lang === 'string') {
    lang = lang.toLowerCase();
  }

  if (!lang || !langs.includes(lang as Locale)) {
    lang = 'en';
  }

  // Lataa kielitiedosto turvallisesti, fallback englantiin tai tyhjään objektiin
  let messages: Record<string, any> = {};
  try {
    messages = (await import(`./messages/${lang}.json`)).default;
  } catch (err) {
    try {
      messages = (await import(`./messages/en.json`)).default;
    } catch {
      messages = {};
    }
  }

  return {
    lang,
    messages
  };
}
