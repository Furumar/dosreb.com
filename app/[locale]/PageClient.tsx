// app/[locale]/PageClient.tsx
export default function PageClient() {
  let text = "Welcome"; // fallback
  try {
    const translated = ("welcome");
    if (typeof translated === "string" && translated.length) text = translated;
  } catch (e) {
    console.error("Missing translation for 'welcome'", e);
  }
  return <div>{text}</div>;
}
