"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { createColumnHelper, sortFn_alphanumeric, sortFn_basic, useTable } from "@tanstack/react-table";
import {
  Copy, Check, Play, FastForward, ClipboardList, RotateCcw, Download, Printer,
  Lock, Loader2, CheckCircle2, XCircle, Clock, AlertTriangle, Users, DoorOpen, ArrowLeft,
} from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { SignInGate, AccountHeader } from "@/components/SignInGate";
import { Ticket } from "@/components/Ticket";
import { RichText } from "@/components/RichText";
import { useProgress } from "@/context/ProgressContext";
import { MISSIONS } from "@/app/build/missions";
import { velocity } from "@/lib/sprint/state";
import { storyTitle } from "@/lib/sprint/mission";
import { OBJECTIVE_LABEL } from "@/lib/sprint/objectives";
import type { Phase, TeamId } from "@/lib/sprint/types";
import {
  BAD, OK, Btn, ErrorLine, GROUND, HAIRLINE, INK, INK2, MONO, Panel, ProgressBar, ScrollFade, SPACE, STEP, SubmitRow, SURFACE,
  TextField, TICKET, cardTitle, heading, hint, pts, requiredText, sprintCss,
} from "@/app/build/ui";
import { SortableTable, tableFeaturesSorted } from "./DataTable";

/* ---------- constants ---------- */

const PHASES: { key: Phase; label: string }[] = [
  { key: "lobby", label: "Lobby" },
  { key: "planning", label: "Planning" },
  { key: "teamA", label: "Team A" },
  { key: "standup", label: "Stand-up" },
  { key: "teamB", label: "Team B" },
  { key: "review", label: "Review" },
  { key: "retro", label: "Retro" },
];

const BUDGET_MS = 45 * 60 * 1000;
const WARN_MS = 5 * 60 * 1000;
const TEAMS: TeamId[] = ["A", "B"];

const teachCss = `
${sprintCss}
.join-code{font-family:${MONO};font-weight:700;font-size:clamp(2.5rem,13vw,var(--step-4,4rem));letter-spacing:0.12em;line-height:1;margin:0;overflow-wrap:normal}
.join-url{overflow-wrap:anywhere;word-break:break-word;margin:0}
.teach-root{min-width:0}
.mission-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.phase-row{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
.timer{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px}
.timer-text{display:flex;align-items:baseline;gap:4px 12px;flex-wrap:wrap;min-width:0}
.vh{position:absolute !important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.timer .nw{white-space:nowrap}
.team-story{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;border:1px solid color-mix(in srgb,var(--ink) 30%,transparent);padding:8px 12px;min-height:44px}
@media (max-width:640px){
.mission-grid{grid-template-columns:minmax(0,1fr)}
.phase-row{flex-wrap:nowrap;width:max-content;padding-bottom:4px}
.phase-row li{flex:0 0 auto;white-space:nowrap}
}
`;

/* ---------- helpers ---------- */

const subscribeNever = () => () => {};

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function downloadCsv(filename: string, header: string[], rows: unknown[][]) {
  const text = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const quietLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: SPACE[2],
  minHeight: 44,
  padding: "8px 16px",
  border: HAIRLINE,
  color: INK,
  fontSize: STEP.s1,
  textDecoration: "none",
};

const mono: CSSProperties = { fontFamily: MONO };

/* ---------- landing: create / reopen ---------- */

function Landing({ onOpen }: { onOpen: (code: string) => void }) {
  const rooms = api.room.mine.useQuery().data ?? [];
  const create = api.room.create.useMutation({
    onSuccess: (res) => onOpen(res.code),
  });
  const form = useForm({
    defaultValues: { className: "" },
    onSubmit: async ({ value }) => {
      await create.mutateAsync({ className: value.className.trim() }).catch(() => undefined);
    },
  });

  return (
    <div style={{ display: "grid", gap: SPACE[6], maxWidth: 720 }}>
      <Panel>
        <h2 style={heading}>Create a room</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          style={{ display: "grid", gap: SPACE[4], marginTop: SPACE[4] }}
        >
          <form.Field name="className" validators={{ onChange: requiredText("a class name"), onBlur: requiredText("a class name") }}>
            {(field) => <TextField field={field} id="class-name" label="Class name" maxLength={40} help="For example: Period 3 Intro Python" />}
          </form.Field>
          <form.Subscribe selector={(s) => s.values.className}>
            {(name) => {
              const missing = name.trim() ? [] : ["a class name"];
              return (
                <SubmitRow disabled={missing.length > 0 || create.isPending} missing={missing}>
                  {create.isPending ? <Loader2 size={18} aria-hidden="true" /> : <DoorOpen size={18} aria-hidden="true" />}
                  {create.isPending ? "Creating..." : "Create room"}
                </SubmitRow>
              );
            }}
          </form.Subscribe>
          <ErrorLine message={create.error?.message} />
        </form>
      </Panel>

      {rooms.length > 0 && (
        <Panel>
          <h2 id="my-rooms" style={heading}>Your rooms</h2>
          <ul aria-labelledby="my-rooms" style={{ listStyle: "none", padding: 0, margin: `${SPACE[4]} 0 0`, display: "grid", gap: SPACE[2] }}>
            {rooms.map((r) => (
              <li key={r.code}>
                <Btn variant="secondary" onClick={() => onOpen(r.code)} style={{ width: "100%", justifyContent: "space-between" }}>
                  <span>{r.className || "Unnamed class"}</span>
                  <span style={{ ...mono, letterSpacing: "0.1em" }}>{r.code}</span>
                </Btn>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}

/* ---------- dashboard ---------- */

type DashboardData = inferRouterOutputs<AppRouter>["room"]["dashboard"];

function Dashboard({ code }: { code: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const query = api.room.dashboard.useQuery({ code }, { refetchInterval: 3000, retry: false });
  const refresh = () => utils.room.dashboard.invalidate();
  const input = { code };

  const setMission = api.room.setMission.useMutation({ onSuccess: refresh });
  const startPlanning = api.room.startPlanning.useMutation({ onSuccess: refresh });
  const startWork = api.room.startWork.useMutation({ onSuccess: refresh });
  const startRetro = api.room.startRetro.useMutation({ onSuccess: refresh });
  const newRound = api.room.newRound.useMutation({ onSuccess: () => { setConfirmNew(false); refresh(); } });

  const phaseRow = useRef<HTMLOListElement>(null);
  const [confirmNew, setConfirmNew] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const origin = useSyncExternalStore(subscribeNever, () => window.location.origin, () => "");
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const data = query.data;
  const livePhase = data?.state.phase;
  useEffect(() => {
    const strip = phaseRow.current?.parentElement;
    const item = strip?.querySelector<HTMLElement>('[aria-current="step"]');
    if (strip && item) strip.scrollLeft = item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2;
  }, [livePhase]);
  if (query.error && !data) {
    return (
      <Panel>
        <ErrorLine message={query.error.message} />
        <p>Room {code} could not be loaded. Rooms can only be opened by the teacher who made them.</p>
      </Panel>
    );
  }
  if (!data) return <p role="status" style={hint}>Loading room {code}...</p>;

  const { state } = data;
  const phaseIndex = PHASES.findIndex((p) => p.key === state.phase);
  const joinPath = `/build?code=${code}`;
  const joinUrl = `${origin}${joinPath}`;
  const pending = setMission.isPending || startPlanning.isPending || startWork.isPending || startRetro.isPending || newRound.isPending;
  const bothPlanned = state.teams.A.planned && state.teams.B.planned;
  const controlError = setMission.error ?? startPlanning.error ?? startWork.error ?? startRetro.error ?? newRound.error;

  const elapsed = state.startedAt ? now - new Date(state.startedAt).getTime() : null;
  const remaining = elapsed === null ? BUDGET_MS : BUDGET_MS - elapsed;
  const warn = elapsed !== null && remaining < WARN_MS;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const early = state.phase === "lobby" || state.phase === "planning";
  const late = state.phase === "review" || state.phase === "retro";

  const joinHero = (
    <Panel key="join">
      <h2 id="room-code-label" style={{ ...cardTitle, marginBottom: SPACE[2] }}>Join code</h2>
      <p className="join-code" aria-labelledby="room-code-label">{code}</p>
      <p className="join-url" style={{ fontSize: STEP.s1up, margin: `${SPACE[3]} 0` }}>
        Students go to <strong>{joinUrl || joinPath}</strong>
      </p>
      <Btn variant="secondary" onClick={copy}>
        {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {copied ? "Copied" : "Copy join link"}
      </Btn>
      <span role="status" style={{ position: "absolute", left: -9999 }}>{copied ? "Join link copied" : ""}</span>
    </Panel>
  );

  const controls = (
    <Panel key="controls">
      <h2 id="phase-h" style={heading}>Phase and controls</h2>
      <ScrollFade style={{ margin: `${SPACE[3]} 0` }}>
      <ol aria-labelledby="phase-h" className="phase-row" data-bleed ref={phaseRow} style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {PHASES.map((p, i) => {
          const current = i === phaseIndex;
          const done = i < phaseIndex;
          return (
            <li
              key={p.key}
              aria-current={current ? "step" : undefined}
              style={{
                display: "inline-flex", alignItems: "center", gap: SPACE[1], padding: `${SPACE[1]} ${SPACE[2]}`,
                fontWeight: current ? 700 : 400, color: INK,
                background: current ? TICKET : "transparent",
                border: current ? `2px solid ${INK}` : "2px solid transparent",
              }}
            >
              {i + 1}. {p.label}
              {done ? <><Check size={16} aria-hidden="true" /><span className="vh">done</span></> : null}
              {current ? <span style={{ fontSize: STEP.s1 }}>(now)</span> : null}
            </li>
          );
        })}
      </ol>
      </ScrollFade>
      <div className="timer">
        <Clock size={20} aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }} />
        <div className="timer-text">
        {elapsed === null ? (
          <span>Timer starts when work starts. Budget <span className="nw" style={mono}>45:00</span></span>
        ) : (
          <>
            <span className="nw" style={{ fontSize: STEP.s1up, fontWeight: 700 }}><span style={mono}>{mmss(elapsed)}</span> of <span style={mono}>45:00</span></span>
            <span style={{ fontWeight: 700 }}>
              <span style={mono}>{remaining >= 0 ? mmss(remaining) : mmss(-remaining)}</span>{remaining >= 0 ? " remaining" : " over budget"}
            </span>
            {warn && (
              <span role="status" style={{ display: "inline-flex", gap: SPACE[1], alignItems: "center", fontWeight: 700, color: BAD }}>
                <AlertTriangle size={18} aria-hidden="true" /> Warning: under 5 minutes left
              </span>
            )}
          </>
        )}
        </div>
      </div>

      {state.phase === "lobby" && (
        <>
          <p style={{ marginTop: 0 }}>Pick a mission, then start planning.</p>
          <ul className="mission-grid" style={{ listStyle: "none", padding: 0, margin: `0 0 ${SPACE[5]}` }}>
            {MISSIONS.map((m) => {
              const selected = data.missionId === m.id;
              return (
                <li key={m.id} style={{ display: "flex" }}>
                  <Ticket tone="plain" className={selected ? "you-bar" : undefined} style={{ width: "100%" }}>
                    <div style={{ ...cardTitle, display: "flex", gap: SPACE[2], alignItems: "center", flexWrap: "wrap" }}>{m.title}</div>
                    <div>{m.topic}</div>
                    <div style={{ margin: `${SPACE[1]} 0 ${SPACE[3]}`, fontSize: STEP.s1, color: INK }}>Team A: {m.groupA.questions.length} stories. Team B: {m.groupB.questions.length} stories.</div>
                    <div style={{ display: "flex", gap: SPACE[3], flexWrap: "wrap", alignItems: "center" }}>
                      <Btn
                        variant="secondary"
                        pressed={selected}
                        disabled={pending}
                        onClick={() => setMission.mutate({ ...input, missionId: m.id })}
                      >
                        {selected ? <><Check size={16} aria-hidden="true" /> Selected</> : "Select"}
                      </Btn>
                      <Link href={`/print?mission=${m.id}`} target="_blank" rel="noopener noreferrer" style={{ color: INK, fontWeight: 700, display: "inline-flex", gap: SPACE[1], alignItems: "center", minHeight: 44 }}>
                        <Printer size={16} aria-hidden="true" /> Printables (new tab)
                      </Link>
                    </div>
                  </Ticket>
                </li>
              );
            })}
          </ul>
          <SubmitRowLike
            disabled={!data.missionId || pending}
            missing={data.missionId ? [] : ["a mission"]}
            onClick={() => startPlanning.mutate(input)}
          >
            <ClipboardList size={18} aria-hidden="true" /> Start planning
          </SubmitRowLike>
        </>
      )}

      {state.phase === "planning" && (
        <>
          <p style={{ marginTop: 0 }}>Tell each team to use one shared screen for the whole sprint: roles change who types, not which device, and mats typed on other devices are not sent.</p>
          <div style={{ display: "flex", gap: SPACE[3], flexWrap: "wrap", alignItems: "center" }}>
            <Btn disabled={!bothPlanned || pending} onClick={() => startWork.mutate(input)}>
              <Play size={18} aria-hidden="true" /> Start work
            </Btn>
            {!bothPlanned ? (
              <Btn variant="secondary" disabled={pending} onClick={() => startWork.mutate({ ...input, force: true })}>
                <FastForward size={18} aria-hidden="true" /> Start anyway
              </Btn>
            ) : null}
            <span>{bothPlanned ? "Both teams are planned." : "Waiting for both teams to finish planning."}</span>
          </div>
        </>
      )}

      {(state.phase === "teamA" || state.phase === "standup" || state.phase === "teamB") && (
        <p style={{ margin: 0 }}>Teams are working. Nothing to do until the review.</p>
      )}

      {state.phase === "review" && (
        <Btn disabled={pending} onClick={() => startRetro.mutate(input)}>
          <ClipboardList size={18} aria-hidden="true" /> Start retro
        </Btn>
      )}

      {state.phase === "retro" && <p style={{ margin: 0 }}>Retro is open. Students submit reflections below.</p>}

      {state.phase !== "lobby" && (
        <div style={{ marginTop: SPACE[4], paddingTop: SPACE[4], borderTop: HAIRLINE }}>
          {!confirmNew ? (
            <Btn variant="secondary" disabled={pending} onClick={() => setConfirmNew(true)}>
              <RotateCcw size={18} aria-hidden="true" /> New round
            </Btn>
          ) : (
            <div role="group" aria-label="Confirm new round" style={{ display: "flex", gap: SPACE[3], flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Reset progress and start round {state.round + 1}? Results are kept.</span>
              <Btn disabled={pending} onClick={() => newRound.mutate(input)}>
                <RotateCcw size={18} aria-hidden="true" /> Yes, start new round
              </Btn>
              <Btn variant="secondary" onClick={() => setConfirmNew(false)}>Cancel</Btn>
            </div>
          )}
        </div>
      )}
      <ErrorLine message={controlError?.message} />
    </Panel>
  );

  const baton = state.baton ? (
    <Ticket key="baton" tone="plain" punched stub="A→B" as="section" aria-labelledby="baton-h">
      <h2 id="baton-h" style={heading}>Baton note from Team A</h2>
      <p style={{ margin: `${SPACE[3]} 0 0`, fontSize: STEP.s1up, whiteSpace: "pre-wrap" }}><RichText text={state.baton.note} /></p>
      <p style={{ margin: `${SPACE[3]} 0 0`, fontSize: STEP.s1 }}>
        Received <span style={mono}>{new Date(state.baton.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
      </p>
    </Ticket>
  ) : null;

  const teams = <TeamsSection key="teams" data={data} hero={!early && !late} />;
  const results = <ResultsSection key="results" data={data} code={code} />;

  // One hero per state: join code (lobby, planning), team progress (work), results (review, retro).
  const order = early ? [controls, joinHero, baton, teams, results] : late ? [controls, results, baton, teams] : [controls, teams, baton, results];

  return (
    <>
      <AccountHeader
        title={data.className}
        meta={
          <>
            Room <span style={mono}>{code}</span> · Round {state.round} · {PHASES[phaseIndex]?.label}
          </>
        }
        extra={[{ label: "All rooms", onClick: () => router.push("/teach"), icon: <ArrowLeft size={16} aria-hidden="true" /> }]}
      />
      <div style={{ display: "grid", gap: SPACE[6] }}>{order}</div>
    </>
  );
}

/** A primary action with its reason shown next to it (not a form, so it renders its own button). */
function SubmitRowLike({ disabled, missing, onClick, children }: { disabled: boolean; missing: string[]; onClick: () => void; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: SPACE[3], alignItems: "center", flexWrap: "wrap" }}>
      <Btn disabled={disabled} onClick={onClick}>{children}</Btn>
      
    </div>
  );
}

/* ---------- teams ---------- */

function TeamsSection({ data, hero }: { data: DashboardData; hero: boolean }) {
  const { state, mission } = data;
  return (
    <section aria-label="Teams" style={{ display: "grid", gap: SPACE[5], gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))" }}>
      {TEAMS.map((id) => {
        const t = state.teams[id];
        const stories = mission?.teams[id].stories ?? [];
        const done = t.stories.filter((s) => s.status === "done").length;
        return (
          <Panel key={id}>
            <h2 id={`team-${id}`} style={hero ? heading : cardTitle}>Team {id}{t.name ? `: ${t.name}` : ""}</h2>
            <p style={{ margin: `${SPACE[2]} 0`, display: "flex", gap: SPACE[2], alignItems: "center", flexWrap: "wrap" }}>
              <Users size={18} aria-hidden="true" /> {t.joined ? "Joined" : "Not joined yet"} · {t.planned ? "Planned" : "Not planned"}
            </p>
            {t.stories.length > 0 ? <ProgressBar done={done} total={t.stories.length} label={`Team ${id} progress`} /> : null}
            <p style={{ margin: `${SPACE[3]} 0 ${SPACE[1]}` }}>
              <strong>Members:</strong>{" "}
              {data.members.filter((m) => m.team === id).map((m) => `Seat ${m.seat} ${m.name}`).join(", ") || "None yet"}
            </p>
            <p style={{ margin: `0 0 ${SPACE[1]}` }}><strong>Sprint goal:</strong> {t.goal || "Not written yet"}</p>
            <p style={{ margin: `0 0 ${SPACE[3]}` }}><strong>Velocity:</strong> <span style={mono}>{velocity(t)}</span> {velocity(t) === 1 ? "point" : "points"}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: SPACE[2] }}>
              {t.stories.map((s, i) => {
                const Icon = s.status === "done" ? CheckCircle2 : s.status === "doing" ? Loader2 : Lock;
                const word = s.status === "done" ? "Done" : s.status === "doing" ? "In progress" : "Locked";
                return (
                  <li key={i} className="team-story">
                    <span style={{ display: "inline-flex", gap: SPACE[2], alignItems: "center", fontWeight: 700 }}>
                      <Icon size={18} aria-hidden="true" /> {word}
                    </span>
                    <span style={{ minWidth: 0 }}>{stories[i]?.title ?? `Story ${i + 1}`}</span>
                    <span style={mono}>{t.estimates[i] ? pts(t.estimates[i]) : ""}</span>
                  </li>
                );
              })}
              {t.stories.length === 0 && <li>No stories yet.</li>}
            </ul>
          </Panel>
        );
      })}
    </section>
  );
}

/* ---------- results and reflections (TanStack Table) ---------- */

type ResultRow = {
  round: number;
  team: string;
  story: string;
  prompt: string;
  points: number;
  result: "Correct" | "Not quite";
  reason: string;
  topic: string;
  objective: number;
  answer: string;
  traceChecked: number | null;
  traceMatched: number | null;
};

type ReflectionRow = {
  round: number;
  name: string;
  team: string;
  seat: number;
  wentWell: string;
  improvement: string;
  exitAnswer: string;
};

const resultHelper = createColumnHelper<typeof tableFeaturesSorted, ResultRow>();
const reflectionHelper = createColumnHelper<typeof tableFeaturesSorted, ReflectionRow>();

const resultColumns = (withRound: boolean) =>
  resultHelper.columns([
    ...(withRound ? [resultHelper.accessor("round", { header: "Round", sortFn: sortFn_basic, cell: (c) => <span style={mono}>{c.getValue()}</span> })] : []),
    resultHelper.accessor("team", { header: "Team", sortFn: sortFn_alphanumeric }),
    resultHelper.accessor("story", {
      header: "Story",
      enableSorting: false,
      cell: (c) => (
        <>
          <strong>{c.getValue()}</strong>
          <div><RichText text={c.row.original.prompt} /></div>
        </>
      ),
    }),
    resultHelper.accessor("points", { header: "Points", sortFn: sortFn_basic, cell: (c) => <span style={mono}>{c.getValue()}</span> }),
    resultHelper.accessor("result", {
      header: "Result",
      sortFn: sortFn_alphanumeric,
      cell: (c) => (
        <span style={{ display: "inline-flex", gap: SPACE[1], alignItems: "center", fontWeight: 700, whiteSpace: "nowrap", minWidth: 120, color: c.getValue() === "Correct" ? OK : BAD }}>
          {c.getValue() === "Correct" ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
          {c.getValue()}
        </span>
      ),
    }),
    resultHelper.display({
      id: "trace",
      header: "Trace",
      cell: (c) => {
        const { traceChecked, traceMatched } = c.row.original;
        return traceChecked === null ? (
          <><span aria-hidden="true">-</span><span className="vh">no trace mat</span></>
        ) : (
          <span style={{ ...mono, whiteSpace: "nowrap" }}>{traceMatched}/{traceChecked} cells</span>
        );
      },
    }),
    resultHelper.accessor("reason", { header: "Reason", enableSorting: false, cell: (c) => <RichText text={c.getValue()} /> }),
  ]);

const reflectionColumns = (withRound: boolean) =>
  reflectionHelper.columns([
    ...(withRound ? [reflectionHelper.accessor("round", { header: "Round", sortFn: sortFn_basic, cell: (c) => <span style={mono}>{c.getValue()}</span> })] : []),
    reflectionHelper.accessor("name", { header: "Name", sortFn: sortFn_alphanumeric }),
    reflectionHelper.accessor("team", { header: "Team", sortFn: sortFn_alphanumeric }),
    reflectionHelper.accessor("seat", { header: "Seat", sortFn: sortFn_basic, cell: (c) => <span style={mono}>{c.getValue()}</span> }),
    reflectionHelper.accessor("wentWell", { header: "Went well", enableSorting: false, cell: (c) => (c.getValue() ? <RichText text={c.getValue()} /> : "(blank)") }),
    reflectionHelper.accessor("improvement", { header: "Improvement", enableSorting: false, cell: (c) => <RichText text={c.getValue()} /> }),
    reflectionHelper.accessor("exitAnswer", { header: "Exit answer", enableSorting: false, cell: (c) => <RichText text={c.getValue()} /> }),
  ]);

const EMPTY_RESULTS: ResultRow[] = [];
const EMPTY_REFLECTIONS: ReflectionRow[] = [];
// Stable column sets (table options must not change identity every render).
const RESULT_COLUMNS = { round: resultColumns(false), all: resultColumns(true) };
const REFLECTION_COLUMNS = { round: reflectionColumns(false), all: reflectionColumns(true) };

function ResultsSection({ data, code }: { data: DashboardData; code: string }) {
  const [scope, setScope] = useState<"round" | "all">("round");
  const { state } = data;
  const agg = scope === "round" ? data.aggregates.round : data.aggregates.all;

  const resultRows = useMemo<ResultRow[]>(() => {
    const lookup = (missionId: string, team: TeamId, index: number) => {
      const m = MISSIONS.find((x) => x.id === missionId);
      return (team === "A" ? m?.groupA : m?.groupB)?.questions[index];
    };
    const rows = data.results
      .filter((r) => scope === "all" || r.round === state.round)
      .map((r) => ({
        round: r.round,
        team: r.team,
        story: (() => { const q = lookup(r.missionId, r.team as TeamId, r.storyIndex); return q ? storyTitle(q) : `Story ${r.storyIndex + 1}`; })(),
        prompt: lookup(r.missionId, r.team as TeamId, r.storyIndex)?.prompt ?? "",
        points: r.points,
        result: (r.correct ? "Correct" : "Not quite") as ResultRow["result"],
        reason: r.reason,
        topic: r.topic,
        objective: r.objective,
        answer: r.answer,
        traceChecked: r.traceCheck?.checked ?? null,
        traceMatched: r.traceCheck?.matched ?? null,
      }));
    return rows.length ? rows : EMPTY_RESULTS;
  }, [data.results, scope, state.round]);

  const traceRate = useMemo(() => {
    const objectiveOne = resultRows.filter((r) => r.objective === 1 && r.traceChecked !== null);
    return {
      key: "trace",
      label: "Objective 1 trace-mat cells correct",
      total: objectiveOne.reduce((sum, r) => sum + (r.traceChecked ?? 0), 0),
      correct: objectiveOne.reduce((sum, r) => sum + (r.traceMatched ?? 0), 0),
    };
  }, [resultRows]);

  const reflectionRows = useMemo<ReflectionRow[]>(() => {
    const rows = data.reflections
      .filter((r) => scope === "all" || r.round === state.round)
      .map((r) => ({
        round: r.round,
        name: r.playerName,
        team: r.team,
        seat: r.seat,
        wentWell: r.wentWell,
        improvement: r.improvement,
        exitAnswer: r.exitAnswer,
      }));
    return rows.length ? rows : EMPTY_REFLECTIONS;
  }, [data.reflections, scope, state.round]);

  const resultsTable = useTable({ features: tableFeaturesSorted, columns: RESULT_COLUMNS[scope], data: resultRows });
  const reflectionsTable = useTable({ features: tableFeaturesSorted, columns: REFLECTION_COLUMNS[scope], data: reflectionRows });

  // CSV exports are built from the table's rows, so they follow the sort the teacher chose.
  const sortedResults = resultsTable.getRowModel().rows.map((r) => r.original);
  const sortedReflections = reflectionsTable.getRowModel().rows.map((r) => r.original);

  return (
    <Panel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: SPACE[3] }}>
        <h2 id="results-h" style={heading}>Results</h2>
        <div role="group" aria-label="Results scope" style={{ display: "flex", gap: SPACE[2] }}>
          <Btn variant="secondary" pressed={scope === "round"} onClick={() => setScope("round")}>Current round</Btn>
          <Btn variant="secondary" pressed={scope === "all"} onClick={() => setScope("all")}>All rounds</Btn>
        </div>
      </div>

      {resultRows.length === 0 ? (
        <p>No finished stories yet.</p>
      ) : (
        <>
          <div style={{ display: "grid", gap: SPACE[5], gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))", marginTop: SPACE[4] }}>
            <Bars title="Correct rate by topic" rates={agg.byTopic.map((r) => ({ ...r, label: r.key }))} />
            <Bars title="Correct rate by objective" rates={agg.byObjective.map((r) => ({ ...r, label: OBJECTIVE_LABEL[Number(r.key)] ? `${r.key} ${OBJECTIVE_LABEL[Number(r.key)]}` : `Objective ${r.key}` }))} />
            {traceRate.total > 0 ? <Bars title="Trace mat accuracy" rates={[traceRate]} /> : null}
          </div>

          <h3 style={{ ...cardTitle, margin: `${SPACE[6]} 0 ${SPACE[2]}` }}>Stories</h3>
          <SortableTable table={resultsTable} caption="Story results" />
        </>
      )}

      <h3 style={{ ...cardTitle, margin: `${SPACE[6]} 0 ${SPACE[2]}` }}>Reflections</h3>
      {reflectionRows.length === 0 ? <p>No reflections yet.</p> : <SortableTable table={reflectionsTable} caption="Reflections" minWidth="48rem" />}

      <div style={{ display: "flex", gap: SPACE[3], flexWrap: "wrap", marginTop: SPACE[5] }}>
        <Btn
          variant="secondary"
          disabled={sortedResults.length === 0}
          onClick={() =>
            downloadCsv(`results-${code}.csv`, ["round", "team", "story", "topic", "objective", "points", "correct", "trace_cells_matched", "trace_cells_checked", "answer", "reason"],
              sortedResults.map((r) => [r.round, r.team, r.story, r.topic, r.objective, r.points, r.result, r.traceMatched, r.traceChecked, r.answer, r.reason]))
          }
        >
          <Download size={18} aria-hidden="true" /> Download results CSV
        </Btn>
        <Btn
          variant="secondary"
          disabled={sortedReflections.length === 0}
          onClick={() =>
            downloadCsv(`reflections-${code}.csv`, ["round", "name", "team", "seat", "went_well", "improvement", "exit_answer"],
              sortedReflections.map((r) => [r.round, r.name, r.team, r.seat, r.wentWell, r.improvement, r.exitAnswer]))
          }
        >
          <Download size={18} aria-hidden="true" /> Download reflections CSV
        </Btn>
      </div>
    </Panel>
  );
}

function Bars({ title, rates }: { title: string; rates: { key: string; label: string; total: number; correct: number }[] }) {
  return (
    <div>
      <h3 style={{ ...cardTitle, margin: `0 0 ${SPACE[2]}` }}>{title}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: SPACE[3] }}>
        {rates.map((r) => {
          const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
          return (
            <li key={r.key}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: SPACE[2], fontWeight: 700 }}>
                <span>{r.label}</span>
                <span><span style={mono}>{r.correct}</span> of <span style={mono}>{r.total}</span> correct (<span style={mono}>{pct}</span>%)</span>
              </div>
              <div role="img" aria-label={`${r.label}: ${pct} percent correct`} style={{ height: 16, border: `2px solid ${INK}`, background: SURFACE }}>
                <div style={{ width: `${pct}%`, height: "100%", background: INK }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- page shell ---------- */

function TeacherInner() {
  const router = useRouter();
  const params = useSearchParams();
  const code = (params.get("code") ?? "").trim().toUpperCase();
  const { playerRole } = useProgress();

  const open = useCallback((next: string) => router.push(`/teach?code=${next}`), [router]);

  return (
    <div className="sprint-root teach-root page">
      <style>{teachCss}</style>
      <SignInGate defaultRole="teacher">
        {playerRole !== "teacher" ? (
          <>
            <AccountHeader title="Teacher dashboard" />
            <Panel>
              <h2 style={heading}>Teacher accounts only</h2>
              <p style={{ margin: `${SPACE[3]} 0 0` }}>This account is a student account. Sign out, then sign in or create an account as a teacher.</p>
            </Panel>
          </>
        ) : code ? (
          <Dashboard code={code} />
        ) : (
          <>
            <AccountHeader title="Teacher dashboard" meta="Create a room for your class or reopen one." />
            <Landing onOpen={open} />
          </>
        )}
      </SignInGate>
    </div>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<p role="status" style={hint}>Loading...</p>}>
      <TeacherInner />
    </Suspense>
  );
}
