// i18n/request.ts
// Ready-to-copy TypeScript module for locale config and message loading.

export const locales = ['en', 'sg'] as const;
export type Locale = (typeof locales)[number];

type GetRequestConfigParams = {
  lang?: string | Promise<string> | undefined;
};

export default async function getRequestConfig(params: GetRequestConfigParams) {
  // Resolve possible Promise<string> or undefined
  let lang = await params?.lang;

  // Normalize and validate
  if (typeof lang === 'string') {
    lang = lang.toLowerCase();
  }

  if (!lang || !locales.includes(lang as Locale)) {
    lang = 'en';
  }

  // Load messages with graceful fallback
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
