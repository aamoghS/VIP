"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CheckCircle2, Circle, ClipboardCheck, Flag, XCircle } from "lucide-react";
import { api } from "@/trpc/react";
import { ROLE_DUTIES, roleFor } from "@/lib/sprint/roles";
import type { PublicStory, StoryState, TeamId } from "@/lib/sprint/types";
import type { Member } from "./phaseProps";
import { Btn, CodeBlock, ErrorLine, MONO, OBJECTIVE_LABEL, Panel, Tag, fieldStyle, heading, hint, labelStyle } from "./ui";

type Props = {
  code: string;
  team: TeamId;
  story: PublicStory;
  storyState: StoryState;
  total: number;
  estimate?: number;
  members: Member[];
  mySeat: number;
  onChanged: () => void;
};

const MIN_REASON = 10;

// Set when Mark Done succeeds so the next story card focuses its heading on mount.
let focusNextHeading = false;

// Code-looking options: operators/brackets, a trailing colon, a line starting with a
// Python keyword, or a bare literal. Prose that only mentions "print" stays in the prose font.
const CODE_LIKE = /[=()[\]{}<>+*/%]|:\s*$|^\s*(def|while|for|if|elif|else|return|print|del)\b|^(True|False|None|-?\d+(\.\d+)?)$/;
const looksLikeCode = (opt: string) => CODE_LIKE.test(opt);

function emptyMat(story: PublicStory): string[][] {
  const t = story.trace;
  if (!t || t.variables.length === 0) return [];
  return t.lines.map(() => t.variables.map(() => ""));
}

export function StoryCard({ code, team, story, storyState, total, estimate, members, mySeat, onChanged }: Props) {
  const mat = story.trace && story.trace.variables.length > 0 ? story.trace : null;
  const [answer, setAnswer] = useState(storyState.answer ?? "");
  const [reason, setReason] = useState(storyState.reason);
  const [trace, setTrace] = useState<string[][]>(() => {
    const blank = emptyMat(story);
    const saved = storyState.trace;
    return saved.length === blank.length && saved.every((r) => r.length === blank[0]?.length) && saved.length > 0 ? saved : blank;
  });
  const [result, setResult] = useState<{ correct: boolean; explanation: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const justChecked = useRef(false);

  useEffect(() => {
    if (focusNextHeading) {
      focusNextHeading = false;
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "start" });
    }
  }, []);

  useEffect(() => {
    if (result && justChecked.current) {
      justChecked.current = false;
      resultRef.current?.focus();
      resultRef.current?.scrollIntoView({ block: "center" });
    }
  }, [result]);

  const check = api.room.checkAnswer.useMutation({
    onSuccess: (r) => {
      justChecked.current = true;
      setResult({ correct: r.correct, explanation: r.explanation });
      onChanged();
    },
  });
  const complete = api.room.completeStory.useMutation({
    onSuccess: () => {
      focusNextHeading = true;
      onChanged();
    },
  });

  // After a reload the story may already be checked on the server: fetch the explanation again.
  const refetched = useRef(false);
  useEffect(() => {
    if (storyState.answer === null || refetched.current) return;
    refetched.current = true;
    check.mutate({ code, team, storyIndex: story.index, answer: storyState.answer, reason: storyState.reason, trace: storyState.trace });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locked = storyState.answer !== null || result !== null;
  const traceFilled = !mat || (trace.length > 0 && trace.every((r) => r.every((c) => c.trim() !== "")));
  const reasonOk = reason.trim().length >= MIN_REASON;
  const answerPicked = answer !== "";
  const missing = [
    !traceFilled && "trace mat",
    !answerPicked && "an answer",
    !reasonOk && `reason (at least ${MIN_REASON} characters)`,
  ].filter(Boolean) as string[];

  const setCell = (r: number, c: number, v: string) =>
    setTrace((prev) => prev.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? v : cell)) : row)));

  const onCellKey = (e: KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    const dr = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!dr) return;
    e.preventDefault();
    const next = e.currentTarget.closest("table")?.querySelector<HTMLInputElement>(`[data-cell="${r + dr}-${c}"]`);
    next?.focus();
  };

  const dod = [
    { done: traceFilled, label: mat ? "Trace filled" : "Trace not needed (no code)" },
    { done: locked, label: "Answer checked" },
    { done: reasonOk, label: "Reason written" },
  ];

  return (
    <Panel>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <Tag>Story {story.index + 1} of {total}</Tag>
        <Tag>Objective {story.objective}: {OBJECTIVE_LABEL[story.objective]}</Tag>
        <Tag>Our estimate: {estimate ?? story.points} pts</Tag>
      </div>
      <h2 ref={headingRef} tabIndex={-1} style={{ ...heading, margin: "0.5rem 0" }}>{story.title}</h2>
      {story.userStory && story.userStory !== story.prompt ? <p style={{ lineHeight: 1.5, margin: "0 0 0.75rem" }}>{story.userStory}</p> : null}

      <ul aria-label="Roles for this story (they change every story)" className="role-strip" style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "grid", gap: "0.4rem", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {Array.from({ length: Math.max(4, ...members.map((m) => m.seat)) }, (_, seat) => {
          const role = roleFor(seat, story.index);
          const who = members.find((m) => m.seat === seat + 1);
          return (
            <li key={seat} style={{ border: "2px solid var(--ink)", padding: "0.3rem 0.5rem", background: "var(--ticket)", color: "var(--ink)", outline: mySeat === seat + 1 ? "3px solid var(--ink)" : undefined, outlineOffset: 2 }}>
              <strong style={{ fontSize: "0.9rem" }}>
                Seat {seat + 1}{who ? ` - ${who.name}` : ""}: {role}{mySeat === seat + 1 ? " (You)" : ""}
              </strong>
              <div style={{ fontSize: "0.75rem", lineHeight: 1.3 }}>{ROLE_DUTIES[role]}</div>
            </li>
          );
        })}
      </ul>

      <p style={{ fontSize: "1.1rem", lineHeight: 1.7, fontWeight: 500 }}>{story.prompt}</p>
      {story.code ? <CodeBlock code={story.code} /> : null}

      {mat ? (
        <div style={{ margin: "1rem 0" }}>
          <h3 style={{ ...labelStyle, fontSize: "1.1rem" }}>Trace mat</h3>
          <p style={{ ...hint, margin: "0 0 0.5rem" }}>
            Tracer: for each line, write the value of each variable after that line runs. Every cell needs something: if a variable has no value yet, or the line is skipped (an if or else that does not run), write a dash (-). Up and Down arrows move between rows.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
              <thead>
                <tr>
                  <th scope="col" style={th}>Line of code</th>
                  {mat.variables.map((v) => (
                    <th scope="col" key={v} style={{ ...th, fontFamily: MONO }}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mat.lines.map((line, r) => (
                  <tr key={r}>
                    <th scope="row" style={{ ...th, fontFamily: MONO, whiteSpace: "pre", textAlign: "left", fontWeight: 400 }}>
                      {line}
                    </th>
                    {mat.variables.map((v, c) => (
                      <td key={v} style={{ border: "3px solid var(--ink)", padding: 0 }}>
                        <input
                          type="text"
                          data-cell={`${r}-${c}`}
                          aria-label={`line ${r + 1}, ${v}`}
                          value={trace[r]?.[c] ?? ""}
                          maxLength={40}
                          readOnly={locked}
                          autoComplete="off"
                          onChange={(e) => setCell(r, c, e.target.value)}
                          onKeyDown={(e) => onCellKey(e, r, c)}
                          style={{ ...fieldStyle, border: "none", minWidth: "5rem", fontFamily: MONO, background: locked ? "transparent" : "var(--bg-elevated)" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <fieldset style={{ border: "none", padding: 0, margin: "1rem 0" }}>
        <legend style={{ ...labelStyle, fontSize: "1.1rem" }}>Reporter: pick the answer</legend>
        <div role="radiogroup" style={{ display: "grid", gap: "0.5rem" }}>
          {story.options.map((opt) => (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                border: "3px solid var(--ink)",
                background: answer === opt ? "var(--ticket)" : "var(--bg-elevated)",
                color: answer === opt ? "var(--ink)" : "var(--text-primary)",
                fontFamily: looksLikeCode(opt) ? MONO : "inherit",
                cursor: locked ? "default" : "pointer",
                boxShadow: "3px 3px 0 var(--ink)",
              }}
            >
              <input type="radio" name={`answer-${story.index}`} value={opt} checked={answer === opt} disabled={locked} onChange={() => setAnswer(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor={`reason-${story.index}`} style={labelStyle}>Why? Write your reason (at least {MIN_REASON} characters)</label>
        <textarea
          id={`reason-${story.index}`}
          rows={3}
          maxLength={500}
          readOnly={locked}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
        <p style={{ ...hint, margin: "0.25rem 0 0" }}>{reason.trim().length} characters{reasonOk ? "" : `, ${MIN_REASON - reason.trim().length} more needed`}</p>
      </div>

      <h3 style={{ ...labelStyle, fontSize: "1.1rem" }}>Scrum Master: Definition of Done</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "grid", gap: "0.25rem" }}>
        {dod.map((d) => (
          <li key={d.label} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 700 }}>
            {d.done ? <CheckCircle2 size={20} aria-hidden /> : <Circle size={20} aria-hidden />}
            {d.label}: {d.done ? "yes" : "not yet"}
          </li>
        ))}
      </ul>

      {!locked ? (
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Btn
            disabled={missing.length > 0 || check.isPending}
            onClick={() => check.mutate({ code, team, storyIndex: story.index, answer, reason: reason.trim(), trace })}
          >
            <ClipboardCheck size={20} aria-hidden /> {check.isPending ? "Checking..." : "Check answer"}
          </Btn>
          {missing.length > 0 ? <span style={{ fontWeight: 700 }}>Missing: {missing.join(", ")}</span> : null}
        </div>
      ) : null}
      <ErrorLine message={check.error?.message} />

      <div aria-live="polite" style={{ marginTop: "1rem" }}>
        {result ? (
          <div ref={resultRef} tabIndex={-1} style={{ outlineOffset: 2, border: "3px solid var(--ink)", padding: "1rem", background: result.correct ? "var(--accent-emerald-dim)" : "var(--accent-rose-dim)" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 800, fontSize: "1.2rem" }}>
              {result.correct ? <CheckCircle2 size={22} aria-hidden /> : <XCircle size={22} aria-hidden />}
              {result.correct ? "Correct" : "Not quite"}
            </div>
            <p style={{ margin: "0.5rem 0 0", lineHeight: 1.6 }}>{result.explanation}</p>
          </div>
        ) : null}
      </div>

      {result ? (
        <div style={{ marginTop: "1rem" }}>
          <Btn onClick={() => complete.mutate({ code, team, storyIndex: story.index })} disabled={complete.isPending}>
            <Flag size={20} aria-hidden /> {complete.isPending ? "Saving..." : "Mark Done"}
          </Btn>
          <ErrorLine message={complete.error?.message} />
        </div>
      ) : null}
    </Panel>
  );
}

const th = {
  border: "3px solid var(--ink)",
  padding: "0.5rem 0.75rem",
  background: "var(--ticket)",
  color: "var(--ink)",
  fontWeight: 700,
  textAlign: "center" as const,
};
