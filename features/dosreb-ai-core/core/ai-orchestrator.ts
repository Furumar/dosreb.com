import { dosrebAICorePersona } from "./persona";
import type { ProjectMap } from "./project-map";

export class DosrebAICore {
  persona = dosrebAICorePersona;

  describePersona() {
    return this.persona;
  }

  analyzeProjectMap(map: ProjectMap) {
    // myöhemmin: oikea analyysi, nyt vain perusrunko
    return {
      root: map.root,
      totalNodes: countNodes(map.nodes),
    };
  }
}

function countNodes(nodes: ProjectMap["nodes"]): number {
  let count = 0;
  for (const n of nodes) {
    count++;
    if (n.children) count += countNodes(n.children);
  }
  return count;
}

export const dosrebAICore = new DosrebAICore();