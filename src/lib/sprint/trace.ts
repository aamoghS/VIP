import type { TraceLayout } from "./types";

const ASSIGN = /^\s*([A-Za-z_]\w*)\s*(?:\*\*|\/\/|<<|>>|[-+*/%&|^@])?=(?!=)/;
const FOR_LOOP = /^\s*for\s+([A-Za-z_]\w*)\s+in\b/;

const stripComment = (line: string) => line.replace(/#.*$/, "").trimEnd();
const assignedVariable = (line: string) => (ASSIGN.exec(line) ?? FOR_LOOP.exec(line))?.[1];

/** Trace mat layout: rows are executable lines, columns are variables assigned in the code. */
export function traceLayout(code: string): TraceLayout {
  const lines: string[] = [];
  const variables: string[] = [];
  for (const raw of code.split(/\r?\n/)) {
    const line = stripComment(raw);
    if (!line.trim()) continue;
    lines.push(raw.trimEnd());
    const name = assignedVariable(line);
    if (name && !variables.includes(name)) variables.push(name);
  }
  return { lines, variables };
}

/** Id of a mat cell in a trace key. `row` is the 1-based line number shown on the mat. */
export const cellId = (row: number, variable: string) => `${row}:${variable}`;

/** Cells where the line assigns the variable: the ones a trace key covers. */
export function keyCells(layout: TraceLayout): { row: number; variable: string }[] {
  return layout.lines.flatMap((line, i) => {
    const variable = assignedVariable(stripComment(line));
    return variable ? [{ row: i + 1, variable }] : [];
  });
}
