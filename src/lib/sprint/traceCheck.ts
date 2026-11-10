import type { QuizQuestion } from "@/app/build/types";
import { cellId, keyCells, traceLayout } from "./trace";
import type { TraceCheck, TraceLayout, TraceMismatch } from "./types";

/** Cell text as a list of values: quotes dropped, split on commas and spaces, True/False ignore case. */
const tokens = (cell: string) =>
  cell
    .replace(/["'`]/g, "")
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((t) => (/^(?:true|false)$/i.test(t) ? t.toLowerCase() : t));

const sameValues = (a: string, b: string) => {
  const [x, y] = [tokens(a), tokens(b)];
  return x.length === y.length && x.every((t, i) => t === y[i]);
};

/** Compares the student's mat with the trace key, one key cell at a time. Other cells are not checked. */
export function compareTrace(layout: TraceLayout, traceKey: Record<string, string>, mat: string[][]): TraceCheck {
  const mismatches: TraceMismatch[] = [];
  let checked = 0;
  for (const { row, variable } of keyCells(layout)) {
    const expected = traceKey[cellId(row, variable)];
    if (expected === undefined) continue;
    checked++;
    const got = (mat[row - 1]?.[layout.variables.indexOf(variable)] ?? "").trim();
    if (!sameValues(expected, got)) mismatches.push({ row, variable, expected, got });
  }
  return { checked, matched: checked - mismatches.length, mismatches };
}

/** Trace check for a story's saved mat, or null when the story has no key or the mat no longer fits its code. */
export function checkStoryTrace(question: QuizQuestion, mat: string[][]): TraceCheck | null {
  if (!question.code || !question.traceKey) return null;
  const layout = traceLayout(question.code);
  return mat.length === layout.lines.length ? compareTrace(layout, question.traceKey, mat) : null;
}
