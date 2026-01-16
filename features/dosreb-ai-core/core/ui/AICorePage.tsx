"use client";

import { useState } from "react";
import type { ProjectMap } from "../project-map";
import { dosrebAICore } from "../ai-orchestrator";

export default function AICorePage() {
  const [projectMapJson, setProjectMapJson] = useState("");
  const [analysis, setAnalysis] = useState<any | null>(null);

  function handleAnalyze() {
    try {
      const parsed: ProjectMap = JSON.parse(projectMapJson);
      const result = dosrebAICore.analyzeProjectMap(parsed);
      setAnalysis(result);
    } catch (e: any) {
      alert("Invalid JSON: " + e.message);
    }
  }

  const persona = dosrebAICore.describePersona();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">DOSREB AI Core</h1>
      <section className="border p-4 rounded space-y-2">
        <h2 className="text-xl font-semibold">Persona</h2>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(persona, null, 2)}
        </pre>
      </section>

      <section className="border p-4 rounded space-y-2">
        <h2 className="text-xl font-semibold">Project Map Analyzer</h2>
        <textarea
          className="w-full h-48 border p-2 font-mono text-xs"
          placeholder='Paste ProjectMap JSON here'
          value={projectMapJson}
          onChange={(e) => setProjectMapJson(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={handleAnalyze}
        >
          Analyze
        </button>
        {analysis && (
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto mt-2">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}