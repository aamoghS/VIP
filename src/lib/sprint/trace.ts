import type { TraceLayout } from "./types";

const ASSIGN = /^\s*([A-Za-z_]\w*)\s*(?:\*\*|\/\/|<<|>>|[-+*/%&|^@])?=(?!=)/;
const FOR_LOOP = /^\s*for\s+([A-Za-z_]\w*)\s+in\b/;

const stripComment = (line: string) => line.replace(/#.*$/, "").trimEnd();

/** Trace mat layout: rows are executable lines, columns are variables assigned in the code. */
export function traceLayout(code: string): TraceLayout {
  const lines: string[] = [];
  const variables: string[] = [];
  for (const raw of code.split(/\r?\n/)) {
    const line = stripComment(raw);
    if (!line.trim()) continue;
    lines.push(raw.trimEnd());
    const name = (ASSIGN.exec(line) ?? FOR_LOOP.exec(line))?.[1];
    if (name && !variables.includes(name)) variables.push(name);
  }
  return { lines, variables };
}
