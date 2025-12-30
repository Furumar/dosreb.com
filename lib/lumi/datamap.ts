// ---------------------------------------------
// DataMap for Lumi — Projects & Real Estates
// ---------------------------------------------

export interface LumiProject {
  id: string;
  name: string;
  keywords: string[];
  path: string;
  summary: string;
  realEstateId: string;
}

export interface LumiRealEstate {
  id: string;
  name: string;
  keywords: string[];
  path: string;
  summary: string;
}

// ---------------------------------------------
// REAL ESTATES
// ---------------------------------------------

export const realEstates: LumiRealEstate[] = [
  {
    id: "stockmann-helsinki",
    name: "Stockmann, Helsingin Keskusta",
    keywords: [
      "stockmann",
      "helsinki",
      "keskusta",
      "tavaratalo",
      "historiallinen",
      "uudistus"
    ],
    path: "/real-estates/stockmann-helsinki",
    summary:
      "Helsingin keskustan ikoninen Stockmann-tavaratalo, joka on toiminut useiden kehitys- ja modernisointiprojektien kohteena."
  },

  {
    id: "viinikkala-logistics",
    name: "Viinikkalan Maaliikennekeskus, Vantaa",
    keywords: [
      "viinikkala",
      "vantaa",
      "logistiikka",
      "maaliikennekeskus",
      "db schenker",
      "uudisrakennus"
    ],
    path: "/real-estates/viinikkala-logistics",
    summary:
      "Vantaan Viinikkalan logistiikka-alueelle rakennettu ja saneerattu maaliikennekeskus, joka toimii DB Schenkerin keskeisenä solmukohtana."
  }
];

// ---------------------------------------------
// PROJECTS
// ---------------------------------------------

export const projects: LumiProject[] = [
  {
    id: "stockmann-legacy",
    name: "Kaikkien Aikojen Stockmann",
    keywords: [
      "stockmann",
      "helsinki",
      "tavaratalo",
      "uudistus",
      "modernisointi",
      "keskusta",
      "projekti"
    ],
    path: "/projects/stockmann-legacy",
    summary:
      "Laaja modernisointi- ja kehityshanke Helsingin keskustan Stockmann-tavaratalossa.",
    realEstateId: "stockmann-helsinki"
  },

  {
    id: "dbs-relocation",
    name: "DB Schenker Relocation",
    keywords: [
      "db schenker",
      "relocation",
      "viinikkala",
      "logistiikka",
      "maaliikennekeskus",
      "vantaa",
      "projekti"
    ],
    path: "/projects/dbs-relocation",
    summary:
      "Helsingin maaliikennekeskuksen siirto uuteen, varta vasten rakennettuun logistiikkakeskukseen Viinikkalassa.",
    realEstateId: "viinikkala-logistics"
  }
];

// ---------------------------------------------
// EXPORT ALL
// ---------------------------------------------

export const dataMap = {
  projects,
  realEstates
};
