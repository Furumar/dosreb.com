export type LumiIntent =
  | "navigate_about"
  | "navigate_contact"
  | "navigate_projects"
  | "navigate_real_estates"
  | "find_project"
  | "find_real_estate"
  | "general_help"
  | "unknown";

export function detectIntent(input: string): LumiIntent {
  const text = input.toLowerCase();

  // ABOUT / COMPANY
  if (
    text.includes("dosbre") ||
    text.includes("about") ||
    text.includes("mitä te teette") ||
    text.includes("yritys")
  ) {
    return "navigate_about";
  }

  // CONTACT
  if (
    text.includes("ota yhteyttä") ||
    text.includes("yhteys") ||
    text.includes("contact") ||
    text.includes("soittaa") ||
    text.includes("email")
  ) {
    return "navigate_contact";
  }

  // PROJECTS
  if (
    text.includes("projekti") ||
    text.includes("project") ||
    text.includes("case") ||
    text.includes("automaatio") ||
    text.includes("workflow")
  ) {
    return "navigate_projects";
  }

  // REAL ESTATES
  if (
    text.includes("kiinteistö") ||
    text.includes("real estate") ||
    text.includes("real-estates") ||
    text.includes("remontti") ||
    text.includes("saneeraus")
  ) {
    return "navigate_real_estates";
  }

  // SPECIFIC PROJECT SEARCH
  if (
    text.includes("etsi projekti") ||
    text.includes("löydä projekti") ||
    text.includes("missä projekti")
  ) {
    return "find_project";
  }

  // SPECIFIC REAL ESTATE SEARCH
  if (
    text.includes("etsi kiinteistö") ||
    text.includes("löydä kiinteistö") ||
    text.includes("missä kiinteistö")
  ) {
    return "find_real_estate";
  }

  // GENERAL HELP
  if (
    text.includes("en löydä") ||
    text.includes("auta") ||
    text.includes("miten löydän") ||
    text.includes("apua")
  ) {
    return "general_help";
  }

  return "unknown";
}
