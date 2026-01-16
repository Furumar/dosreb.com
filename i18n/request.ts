export const langs = [
  'en', // English
  'sg'  // Singaporean
] as const;

export type Lang = (typeof langs)[number];

type getRequestConfigParams = {
  lang?: string | Promise<string> | undefined;
};

export default getRequestConfig(async (params: getRequestConfigParams) => {
  // Typically corresponds to the '[lang]' segment
  let lang = await params.lang;

  // Validate that the incoming 'lang' parameter is valid
  if (!lang || !langs.includes(lang as Lang)) {
    lang = 'en'; // default fallback
  }

  const messages = (await import(`./messages/${lang}.json`)).default;

  return {
    lang,
    messages
  };
});
function getRequestConfig(arg0: (params: getRequestConfigParams) => Promise<{ lang: string; messages: any; }>) {
  throw new Error("Function not implemented.");
}

