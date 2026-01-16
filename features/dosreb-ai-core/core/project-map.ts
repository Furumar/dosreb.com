export type ProjectNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: ProjectNode[];
};

export type ProjectMap = {
  root: string;
  nodes: ProjectNode[];
};

export function createEmptyProjectMap(root: string): ProjectMap {
  return { root, nodes: [] };
}