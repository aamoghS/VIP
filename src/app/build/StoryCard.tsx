"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CheckCircle2, ChevronDown, Circle, ClipboardCheck, Flag, XCircle } from "lucide-react";
import { OptionText, PromptWithCode, RichText } from "@/components/RichText";
import { api } from "@/trpc/react";
import { ROLE_DUTIES, roleFor } from "@/lib/sprint/roles";
import type { PublicStory, StoryState, TeamId } from "@/lib/sprint/types";
import type { Member } from "./phaseProps";
import {
  BAD, Badge, Btn, ScrollFade, CodeBlock, ErrorLine, GROUND, HAIRLINE, INK, INK2, MONO, OBJECTIVE_LABEL, OK, Panel, SPACE, STEP, SURFACE, TICKET,
  cardTitle, choiceStyle, fieldStyle, heading, hint, labelStyle, pts, radioStyle,
} from "./ui";

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
  const [touched, setTouched] = useState(false);
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

  const setCell = (r: number, c: number, v: string) => {
    setTouched(true);
    setTrace((prev) => prev.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? v : cell)) : row)));
  };

  const onCellKey = (e: KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    const dr = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!dr) return;
    e.preventDefault();
    const next = e.currentTarget.closest("table")?.querySelector<HTMLInputElement>(`[data-cell="${r + dr}-${c}"]`);
    next?.focus();
  };

  const dod = [
    { done: traceFilled, label: mat ? "Trace filled" : "No trace needed for this story", noState: !mat },
    { done: locked, label: "Answer checked" },
    { done: reasonOk, label: "Reason written" },
  ];

  return (
    <Panel>
      <div style={{ display: "flex", gap: SPACE[2], flexWrap: "wrap", alignItems: "center" }}>
        <Badge>Story {story.index + 1} of {total}</Badge>
        <Badge>Objective {story.objective}: {OBJECTIVE_LABEL[story.objective]}</Badge>
        <Badge>Our estimate: <span style={{ fontFamily: MONO }}>{pts(estimate ?? story.points)}</span></Badge>
      </div>
      <h2 ref={headingRef} tabIndex={-1} style={{ ...heading, margin: `${SPACE[3]} 0 ${SPACE[2]}` }}>{story.title}</h2>
      {story.userStory && story.userStory !== story.prompt ? <p style={{ lineHeight: 1.5, margin: `0 0 ${SPACE[4]}` }}><RichText text={story.userStory} /></p> : null}

      <ul aria-label="Roles for this story (they change every story)" className="role-strip" style={{ listStyle: "none", padding: 0, margin: `0 0 ${SPACE[5]}`, display: "grid", gap: SPACE[2], gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {Array.from({ length: Math.max(4, ...members.map((m) => m.seat)) }, (_, seat) => {
          const role = roleFor(seat, story.index);
          const who = members.find((m) => m.seat === seat + 1);
          const mine = mySeat === seat + 1;
          return (
            <li
              key={seat}
              aria-current={mine ? "true" : undefined}
              className={mine ? "you-bar" : undefined}
              style={{
                border: HAIRLINE,
                padding: `${SPACE[2]} ${SPACE[3]}`,
                background: SURFACE,
                color: INK,
                minWidth: 0,
              }}
            >
              <strong style={{ fontSize: STEP.s1, display: "block" }}>
                Seat {seat + 1}{who ? `: ${who.name}` : ""}{mine ? <b style={{ fontWeight: 800 }}> (You)</b> : ""}
              </strong>
              <div style={{ fontSize: STEP.s1, fontWeight: 700 }}>{role}</div>
              <div style={{ fontSize: STEP.s1, lineHeight: 1.4, color: INK2 }}>{ROLE_DUTIES[role]}</div>
            </li>
          );
        })}
      </ul>

      <div style={{ fontSize: STEP.s1up, lineHeight: 1.5, margin: `0 0 ${SPACE[3]}` }}><PromptWithCode text={story.prompt} /></div>
      {story.code && !mat ? <CodeBlock code={story.code} /> : null}

      {mat ? (
        <div style={{ margin: `${SPACE[5]} 0` }}>
          <h3 style={{ ...cardTitle, marginBottom: SPACE[2] }}>Trace mat</h3>
          <p className="mat-help-full" style={{ ...hint, fontSize: STEP.s0, margin: `0 0 ${SPACE[3]}` }}>
            Tracer: for each line, write the value of each variable after that line runs. Every cell needs something: if a variable has no value yet, or the line is skipped (an if or else that does not run), write a dash (-). Up and Down arrows move between rows. Loops: list each value in order, like 5, 3, 1.
          </p>
          <div className="mat-help-short" style={{ margin: `0 0 ${SPACE[3]}` }}>
            <p style={{ ...hint, fontSize: STEP.s0, margin: 0 }}>Write each variable after its line runs. Write - if there is no value.</p>
            <details style={{ marginTop: SPACE[1] }}>
              <summary style={{ fontWeight: 700, minHeight: 44, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>How to fill the mat <ChevronDown className="chev" size={18} aria-hidden="true" /></summary>
              <p style={{ ...hint, fontSize: STEP.s0 }}>Every cell needs something: if a variable has no value yet, or the line is skipped (an if or else that does not run), write a dash (-). Loops: list each value in order, like 5, 3, 1.</p>
            </details>
          </div>
          <ScrollFade>
          <div className="mat-wrap">
            <table className="mat" aria-label="Trace mat: the code on the left, one cell per variable">
              <thead>
                <tr>
                  <th scope="col" className="mat-head-code">Code</th>
                  {mat.variables.map((v) => (
                    <th scope="col" key={v}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mat.lines.map((line, r) => (
                  <tr key={r}>
                    <th scope="row" className="mat-code">
                      <div className="mat-code-in">
                        <span className="mat-n" aria-hidden="true">{r + 1}</span>
                        <span className="mat-line">{line}</span>
                      </div>
                    </th>
                    {mat.variables.map((v, c) => (
                      <td key={v} data-var={v}>
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
                          style={{ ...fieldStyle, minWidth: "5rem", minHeight: 48, fontFamily: MONO, fontSize: STEP.s1up, background: locked ? GROUND : SURFACE }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </ScrollFade>
        </div>
      ) : null}

      <fieldset style={{ border: "none", padding: 0, margin: `${SPACE[5]} 0` }}>
        <legend style={{ ...cardTitle, marginBottom: SPACE[2] }}>Reporter: pick the answer</legend>
        <div role="radiogroup" style={{ display: "grid", gap: SPACE[2] }}>
          {story.options.map((opt) => {
            const picked = answer === opt;
            const mark = result && picked ? (result.correct ? OK : BAD) : null;
            return (
              <label
                key={opt}
                style={{
                  ...choiceStyle(picked, locked),
                  ...(mark ? { background: `color-mix(in srgb, ${mark} 14%, ${SURFACE})` } : null),
                }}
              >
                <input type="radio" name={`answer-${story.index}`} value={opt} data-hit-expanded checked={picked} disabled={locked} onChange={() => { setTouched(true); setAnswer(opt); }} style={radioStyle} />
                <span style={{ minWidth: 0, flex: 1 }}><OptionText text={opt} /></span>
                {mark ? (result?.correct ? <CheckCircle2 size={20} color={OK} aria-label="Correct" /> : <XCircle size={20} color={BAD} aria-label="Not quite" />) : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div style={{ marginBottom: SPACE[5] }}>
        <label htmlFor={`reason-${story.index}`} style={labelStyle}>Why? Write your reason (at least {MIN_REASON} characters)</label>
        <textarea
          id={`reason-${story.index}`}
          rows={3}
          maxLength={500}
          readOnly={locked}
          value={reason}
          onChange={(e) => { setTouched(true); setReason(e.target.value); }}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
        <p style={{ ...hint, marginTop: SPACE[1] }}>{reason.trim().length} characters{reasonOk ? "" : `, ${MIN_REASON - reason.trim().length} more needed`}</p>
      </div>

      <h3 style={{ ...cardTitle, marginBottom: SPACE[2] }}>Scrum Master: definition of done</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: `0 0 ${SPACE[5]}`, display: "grid", gap: SPACE[1] }}>
        {dod.map((d) => (
          <li key={d.label} style={{ display: "flex", gap: SPACE[2], alignItems: "center", fontWeight: 700 }}>
            {d.done ? <CheckCircle2 size={20} aria-hidden /> : <Circle size={20} aria-hidden />}
            {d.noState ? d.label : `${d.label}: ${d.done ? "yes" : "not yet"}`}
          </li>
        ))}
      </ul>

      {!locked ? (
        <div style={{ display: "flex", gap: SPACE[3], alignItems: "center", flexWrap: "wrap" }}>
          <Btn
            disabled={missing.length > 0 || check.isPending}
            onClick={() => check.mutate({ code, team, storyIndex: story.index, answer, reason: reason.trim(), trace })}
          >
            <ClipboardCheck size={20} aria-hidden /> {check.isPending ? "Checking..." : "Check answer"}
          </Btn>
          {touched && missing.length > 0 ? <span style={{ fontWeight: 700, color: INK2 }}>Missing: {missing.join(", ")}</span> : null}
        </div>
      ) : null}
      <ErrorLine message={check.error?.message} />

      <div aria-live="polite" style={{ marginTop: SPACE[4] }}>
        {result ? (
          <div
            ref={resultRef}
            tabIndex={-1}
            className="result-box"
            style={{
              outlineOffset: 2,
              border: `3px solid ${result.correct ? OK : BAD}`,
              padding: SPACE[4],
              background: SURFACE,
            }}
          >
            <div style={{ display: "flex", gap: SPACE[2], alignItems: "center", fontWeight: 700, fontSize: STEP.s1up }}>
              {result.correct ? <CheckCircle2 size={22} aria-hidden /> : <XCircle size={22} aria-hidden />}
              {result.correct ? "Correct" : "Not quite"}
            </div>
            <p style={{ margin: `${SPACE[2]} 0 0`, lineHeight: 1.6 }}><RichText text={result.explanation} /></p>
          </div>
        ) : null}
      </div>

      {result ? (
        <div style={{ marginTop: SPACE[4] }}>
          <Btn onClick={() => complete.mutate({ code, team, storyIndex: story.index })} disabled={complete.isPending}>
            <Flag size={20} aria-hidden /> {complete.isPending ? "Saving..." : "Mark done"}
          </Btn>
          <ErrorLine message={complete.error?.message} />
        </div>
      ) : null}
    </Panel>
  );
}

// Trace mat headers and the code column sit on a neutral surface so the input cells are the prominent part.
const th = {
  border: `2px solid ${INK}`,
  padding: `${SPACE[2]} ${SPACE[3]}`,
  background: GROUND,
  color: INK,
  fontWeight: 700,
  textAlign: "center" as const,
};
