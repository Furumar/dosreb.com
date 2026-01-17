// app/[locale]/page.tsx (server)
// jos PageClient.tsx on samassa kansiossa app/[locale]
import PageClient from "./PageClient";
import React from "react";

export default function HomePageServer() {
  return <PageClient />;
}
