// i18n/request.ts
export const langs = ['en','sv','fi','no','da','es','pt','fr','de','zh','ru','lt','lv','ltg','sgs','lumi'] as const;
export const locales = langs;
export type Locale = (typeof langs)[number];

type GetRequestConfigParams = { lang?: string | Promise<string> | undefined };

export default async function getRequestConfig(params: GetRequestConfigParams = {}) {
  let lang = await params.lang;
  if (typeof lang === "string") lang = lang.toLowerCase();
  if (!lang || !langs.includes(lang as Locale)) lang = "en";

  let messages: Record<string, any> = {};
  try {
    messages = (await import(`./messages/${lang}.json`)).default;
  } catch {
    try {
      messages = (await import(`./messages/en.json`)).default;
    } catch {
      messages = {};
    }
  }

  return { lang, messages };
}
