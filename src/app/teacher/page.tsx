"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Copy, Check, Play, FastForward, ClipboardList, RotateCcw, Download, Printer,
  Lock, Loader2, CheckCircle2, XCircle, Clock, AlertTriangle, Users, DoorOpen,
} from "lucide-react";
import { api } from "@/trpc/react";
import { SignInGate, SignedInAs } from "@/components/SignInGate";
import { useProgress } from "@/context/ProgressContext";
import { MISSIONS } from "@/app/sprint/missions";
import { velocity } from "@/lib/sprint/state";
import type { Phase, TeamId } from "@/lib/sprint/types";

/* ---------- styles ---------- */

const card = {
  background: "var(--bg-elevated)",
  border: "3px solid var(--ink)",
  borderRadius: 0,
  padding: "1.25rem",
  boxShadow: "4px 4px 0 var(--ticket)",
} as const;

const button = {
  display: "inline-flex", alignItems: "center", gap: "0.5rem",
  padding: "0.65rem 1.1rem", fontSize: "1rem", fontWeight: 700,
  background: "var(--ink)", color: "#fff", border: "3px solid var(--ink)", cursor: "pointer",
} as const;

const buttonAlt = { ...button, background: "var(--bg-elevated)", color: "var(--ink)" } as const;

const h2 = { fontFamily: "var(--font-hud), monospace", fontWeight: 400, fontSize: "1.9rem", margin: "0 0 0.75rem" } as const;

const inputStyle = {
  padding: "0.65rem 0.8rem", fontSize: "1.05rem", border: "3px solid var(--ink)",
  background: "#fff", color: "var(--ink)", minWidth: "16rem", maxWidth: "100%",
} as const;

const PHASES: { key: Phase; label: string }[] = [
  { key: "lobby", label: "Lobby" },
  { key: "planning", label: "Planning" },
  { key: "teamA", label: "Team A" },
  { key: "standup", label: "Stand-up" },
  { key: "teamB", label: "Team B" },
  { key: "review", label: "Review" },
  { key: "retro", label: "Retro" },
];

const OBJECTIVES: Record<string, string> = {
  "1": "1 Trace a loop + if",
  "2": "2 Fix boundary errors",
  "3": "3 Explain why",
  "4": "4 Agile teamwork",
};

const BUDGET_MS = 45 * 60 * 1000;
const WARN_MS = 5 * 60 * 1000;
const TEAMS: TeamId[] = ["A", "B"];

/* ---------- helpers ---------- */

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

function ErrorNote({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" style={{ display: "flex", gap: "0.5rem", alignItems: "center", margin: "0.5rem 0 0", fontWeight: 700, color: "var(--accent-rose)" }}>
      <AlertTriangle size={18} aria-hidden="true" /> Error: {message}
    </p>
  );
}

/* ---------- landing: create / reopen ---------- */

function Landing({ onOpen }: { onOpen: (code: string) => void }) {
  const [name, setName] = useState("");
  const rooms = api.room.mine.useQuery().data ?? [];

  const create = api.room.create.useMutation({
    onSuccess: (res) => onOpen(res.code),
  });

  return (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: 720 }}>
      <form
        style={card}
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) create.mutate({ className: name.trim() });
        }}
      >
        <h2 style={h2}>Create a room</h2>
        <label htmlFor="class-name" style={{ display: "block", fontWeight: 700, marginBottom: "0.35rem" }}>Class name</label>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input id="class-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Period 3 Intro Python" />
          <button type="submit" disabled={!name.trim() || create.isPending} style={{ ...button, opacity: !name.trim() || create.isPending ? 0.6 : 1 }}>
            {create.isPending ? <Loader2 size={18} aria-hidden="true" /> : <DoorOpen size={18} aria-hidden="true" />}
            {create.isPending ? "Creating..." : "Create room"}
          </button>
        </div>
        <ErrorNote message={create.error?.message} />
      </form>

      {rooms.length > 0 && (
        <section style={card} aria-labelledby="my-rooms">
          <h2 id="my-rooms" style={h2}>Your rooms</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
            {rooms.map((r) => (
              <li key={r.code}>
                <button type="button" onClick={() => onOpen(r.code)} style={{ ...buttonAlt, width: "100%", justifyContent: "space-between" }}>
                  <span>{r.className || "Unnamed class"}</span>
                  <span className="hud" style={{ fontSize: "1.4rem", letterSpacing: "0.1em" }}>{r.code}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ---------- dashboard ---------- */

function Dashboard({ code }: { code: string }) {
  const utils = api.useUtils();
  const query = api.room.dashboard.useQuery({ code }, { refetchInterval: 3000, retry: false });
  const refresh = () => utils.room.dashboard.invalidate();
  const input = { code };

  const setMission = api.room.setMission.useMutation({ onSuccess: refresh });
  const startPlanning = api.room.startPlanning.useMutation({ onSuccess: refresh });
  const startWork = api.room.startWork.useMutation({ onSuccess: refresh });
  const startRetro = api.room.startRetro.useMutation({ onSuccess: refresh });
  const newRound = api.room.newRound.useMutation({ onSuccess: () => { setConfirmNew(false); refresh(); } });

  const [confirmNew, setConfirmNew] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scope, setScope] = useState<"round" | "all">("round");
  const [now, setNow] = useState(() => Date.now());
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const data = query.data;
  if (query.error && !data) {
    return (
      <div style={card}>
        <ErrorNote message={query.error.message} />
        <p>Room {code} could not be loaded. Rooms can only be opened by the teacher who made them.</p>
      </div>
    );
  }
  if (!data) return <p role="status">Loading room {code}...</p>;

  const { state, mission } = data;
  const phaseIndex = PHASES.findIndex((p) => p.key === state.phase);
  const joinPath = `/sprint?code=${code}`;
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

  const agg = scope === "round" ? data.aggregates.round : data.aggregates.all;
  const results = data.results.filter((r) => scope === "all" || r.round === state.round);
  const reflections = data.reflections.filter((r) => scope === "all" || r.round === state.round);
  const titleOf = (missionId: string, team: TeamId, index: number) => {
    const m = MISSIONS.find((x) => x.id === missionId);
    const q = (team === "A" ? m?.groupA : m?.groupB)?.questions[index];
    return q ? q.prompt.split(/(?<=[.?])\s/)[0] : `Story ${index + 1}`;
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* room code */}
      <section style={{ ...card, textAlign: "center" }} aria-labelledby="room-code-label">
        <div id="room-code-label" style={{ fontWeight: 700 }}>{data.className} - Round {state.round} - Join code</div>
        <div className="hud" style={{ fontSize: "clamp(4rem, 14vw, 9rem)", letterSpacing: "0.12em", lineHeight: 1 }}>{code}</div>
        <p style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
          Students go to <strong>{joinUrl || joinPath}</strong>
        </p>
        <button type="button" onClick={copy} style={button}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {copied ? "Copied" : "Copy join link"}
        </button>
        <span role="status" className="sr-only" style={{ position: "absolute", left: "-9999px" }}>{copied ? "Join link copied" : ""}</span>
      </section>

      {/* stepper + timer */}
      <section style={card} aria-labelledby="phase-h">
        <h2 id="phase-h" style={h2}>Phase</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.25rem 0.5rem" }}>
          {PHASES.map((p, i) => {
            const current = i === phaseIndex;
            const done = i < phaseIndex;
            return (
              <li
                key={p.key}
                aria-current={current ? "step" : undefined}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.1rem 0.35rem",
                  fontWeight: current ? 800 : 400, color: "var(--ink)",
                  background: current ? "var(--ticket)" : "transparent",
                  textDecoration: current ? "underline" : "none", textUnderlineOffset: "0.25rem",
                }}
              >
                {i + 1}. {p.label}
                {done ? <><Check size={16} aria-hidden="true" /> <span style={{ fontSize: "0.85rem" }}>Done</span></> : null}
                {current ? <span style={{ fontSize: "0.85rem" }}>(now)</span> : null}
                {i < PHASES.length - 1 ? <span aria-hidden="true" style={{ marginLeft: "0.3rem" }}>/</span> : null}
              </li>
            );
          })}
        </ol>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <Clock size={22} aria-hidden="true" />
          {elapsed === null ? (
            <span style={{ fontSize: "1.1rem" }}>Timer starts when work starts. Budget 45:00.</span>
          ) : (
            <>
              <span className="hud" style={{ fontSize: "2.2rem" }}>{mmss(elapsed)} of 45:00</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                {remaining >= 0 ? `${mmss(remaining)} remaining` : `${mmss(-remaining)} over budget`}
              </span>
              {warn && (
                <span role="status" style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", fontWeight: 700, color: "var(--accent-rose)" }}>
                  <AlertTriangle size={18} aria-hidden="true" /> Warning: under 5 minutes left
                </span>
              )}
            </>
          )}
        </div>
      </section>

      {/* controls */}
      <section style={card} aria-labelledby="controls-h">
        <h2 id="controls-h" style={h2}>Controls</h2>

        {state.phase === "lobby" && (
          <>
            <p style={{ marginTop: 0 }}>Pick a mission, then start planning.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))" }}>
              {MISSIONS.map((m) => {
                const selected = data.missionId === m.id;
                return (
                  <li key={m.id} style={{ border: "3px solid var(--ink)", padding: "0.9rem", background: selected ? "#fff6d6" : "#fff" }}>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{m.title}</div>
                    <div>{m.topic}</div>
                    <div style={{ margin: "0.35rem 0 0.6rem" }}>Team A: {m.groupA.questions.length} stories. Team B: {m.groupB.questions.length} stories.</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        disabled={pending}
                        onClick={() => setMission.mutate({ ...input, missionId: m.id })}
                        style={selected ? button : buttonAlt}
                      >
                        {selected ? <><Check size={16} aria-hidden="true" /> Selected</> : "Select"}
                      </button>
                      <Link href={`/print?mission=${m.id}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", fontWeight: 700, display: "inline-flex", gap: "0.3rem", alignItems: "center" }}>
                        <Printer size={16} aria-hidden="true" /> Printables (new tab)
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button type="button" disabled={!data.missionId || pending} onClick={() => startPlanning.mutate(input)} style={{ ...button, opacity: !data.missionId || pending ? 0.6 : 1 }}>
              <ClipboardList size={18} aria-hidden="true" /> Start planning
            </button>
            {!data.missionId && <span style={{ marginLeft: "0.75rem" }}>Select a mission first.</span>}
          </>
        )}

        {state.phase === "planning" && (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" disabled={!bothPlanned || pending} onClick={() => startWork.mutate(input)} style={{ ...button, opacity: !bothPlanned || pending ? 0.6 : 1 }}>
              <Play size={18} aria-hidden="true" /> Start work
            </button>
            <button type="button" disabled={pending} onClick={() => startWork.mutate({ ...input, force: true })} style={buttonAlt}>
              <FastForward size={18} aria-hidden="true" /> Start anyway
            </button>
            <span>{bothPlanned ? "Both teams are planned." : "Waiting for both teams to finish planning."}</span>
          </div>
        )}

        {(state.phase === "teamA" || state.phase === "standup" || state.phase === "teamB") && (
          <p style={{ margin: 0 }}>Teams are working. Nothing to do until the review.</p>
        )}

        {state.phase === "review" && (
          <button type="button" disabled={pending} onClick={() => startRetro.mutate(input)} style={button}>
            <ClipboardList size={18} aria-hidden="true" /> Start retro
          </button>
        )}

        {state.phase === "retro" && <p style={{ margin: 0 }}>Retro is open. Students submit reflections below.</p>}

        {state.phase !== "lobby" && (
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid var(--ink)" }}>
            {!confirmNew ? (
              <button type="button" disabled={pending} onClick={() => setConfirmNew(true)} style={buttonAlt}>
                <RotateCcw size={18} aria-hidden="true" /> New round
              </button>
            ) : (
              <div role="group" aria-label="Confirm new round" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>Reset progress and start round {state.round + 1}? Results are kept.</span>
                <button type="button" disabled={pending} onClick={() => newRound.mutate(input)} style={button}>
                  <RotateCcw size={18} aria-hidden="true" /> Yes, start new round
                </button>
                <button type="button" onClick={() => setConfirmNew(false)} style={buttonAlt}>Cancel</button>
              </div>
            )}
          </div>
        )}
        <ErrorNote message={controlError?.message} />
      </section>

      {/* baton */}
      {state.baton && (
        <section style={card} aria-labelledby="baton-h">
          <h2 id="baton-h" style={h2}>Baton note from Team A</h2>
          <p style={{ margin: 0, fontSize: "1.15rem" }}>{state.baton.note}</p>
        </section>
      )}

      {/* teams */}
      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))" }}>
        {TEAMS.map((id) => {
          const t = state.teams[id];
          const stories = mission?.teams[id].stories ?? [];
          return (
            <section key={id} style={card} aria-labelledby={`team-${id}`}>
              <h2 id={`team-${id}`} style={h2}>Team {id}{t.name ? `: ${t.name}` : ""}</h2>
              <p style={{ margin: "0 0 0.35rem", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <Users size={18} aria-hidden="true" /> {t.joined ? "Joined" : "Not joined yet"}
                {" / "}
                {t.planned ? "Planned" : "Not planned"}
              </p>
              <p style={{ margin: "0 0 0.35rem" }}>
                <strong>Members:</strong>{" "}
                {data.members.filter((m) => m.team === id).map((m) => `Seat ${m.seat} ${m.name}`).join(", ") || "None yet"}
              </p>
              <p style={{ margin: "0 0 0.35rem" }}><strong>Sprint goal:</strong> {t.goal || "Not written yet"}</p>
              <p style={{ margin: "0 0 0.75rem" }}><strong>Velocity:</strong> {velocity(t)} points</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.4rem" }}>
                {t.stories.map((s, i) => {
                  const Icon = s.status === "done" ? CheckCircle2 : s.status === "doing" ? Loader2 : Lock;
                  const word = s.status === "done" ? "Done" : s.status === "doing" ? "In progress" : "Locked";
                  return (
                    <li key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", border: "2px solid var(--ink)", padding: "0.4rem 0.6rem", background: "#fff" }}>
                      <Icon size={18} aria-hidden="true" />
                      <strong style={{ minWidth: "6rem" }}>{word}</strong>
                      <span>{stories[i]?.title ?? `Story ${i + 1}`}{t.estimates[i] ? ` (${t.estimates[i]} pts)` : ""}</span>
                    </li>
                  );
                })}
                {t.stories.length === 0 && <li>No stories yet.</li>}
              </ul>
            </section>
          );
        })}
      </div>

      {/* results */}
      <section style={card} aria-labelledby="results-h">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <h2 id="results-h" style={{ ...h2, margin: 0 }}>Results</h2>
          <div role="group" aria-label="Results scope" style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" aria-pressed={scope === "round"} onClick={() => setScope("round")} style={scope === "round" ? button : buttonAlt}>Current round</button>
            <button type="button" aria-pressed={scope === "all"} onClick={() => setScope("all")} style={scope === "all" ? button : buttonAlt}>All rounds</button>
          </div>
        </div>

        {results.length === 0 ? (
          <p>No finished stories yet.</p>
        ) : (
          <>
            <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))", marginTop: "1rem" }}>
              <Bars title="Correct rate by topic" rates={agg.byTopic.map((r) => ({ ...r, label: r.key }))} />
              <Bars title="Correct rate by objective" rates={agg.byObjective.map((r) => ({ ...r, label: OBJECTIVES[r.key] ?? `Objective ${r.key}` }))} />
            </div>

            <h3 style={{ fontSize: "1.2rem", margin: "1.5rem 0 0.5rem" }}>Stories</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "40rem" }}>
                <thead>
                  <tr>
                    {(scope === "all" ? ["Round"] : []).concat(["Team", "Story", "Points", "Result", "Reason"]).map((h) => (
                      <th key={h} scope="col" style={{ textAlign: "left", border: "2px solid var(--ink)", padding: "0.4rem 0.6rem", background: "#fff" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      {scope === "all" && <td style={cell}>{r.round}</td>}
                      <td style={cell}>{r.team}</td>
                      <td style={cell}>{titleOf(r.missionId, r.team as TeamId, r.storyIndex)}</td>
                      <td style={cell}>{r.points}</td>
                      <td style={cell}>
                        <span style={{ display: "inline-flex", gap: "0.35rem", alignItems: "center", fontWeight: 700 }}>
                          {r.correct ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
                          {r.correct ? "Correct" : "Not quite"}
                        </span>
                      </td>
                      <td style={cell}>{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <h3 style={{ fontSize: "1.2rem", margin: "1.5rem 0 0.5rem" }}>Reflections</h3>
        {reflections.length === 0 ? (
          <p>No reflections yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
            {reflections.map((r, i) => (
              <li key={i} style={{ border: "2px solid var(--ink)", background: "#fff", padding: "0.7rem 0.9rem" }}>
                <strong>{scope === "all" ? `Round ${r.round}, ` : ""}{r.playerName}, Team {r.team}, Seat {r.seat}</strong>
                <div><strong>Went well:</strong> {r.wentWell || "(blank)"}</div>
                <div><strong>Improvement:</strong> {r.improvement}</div>
                <div><strong>Exit ticket:</strong> {r.exitAnswer}</div>
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
          <button
            type="button"
            disabled={results.length === 0}
            onClick={() =>
              downloadCsv(`results-${code}.csv`, ["round", "team", "story", "topic", "objective", "points", "correct", "answer", "reason"],
                results.map((r) => [r.round, r.team, titleOf(r.missionId, r.team as TeamId, r.storyIndex), r.topic, r.objective, r.points, r.correct ? "Correct" : "Not quite", r.answer, r.reason]))
            }
            style={{ ...buttonAlt, opacity: results.length === 0 ? 0.6 : 1 }}
          >
            <Download size={18} aria-hidden="true" /> Download results CSV
          </button>
          <button
            type="button"
            disabled={reflections.length === 0}
            onClick={() =>
              downloadCsv(`reflections-${code}.csv`, ["round", "name", "team", "seat", "went_well", "improvement", "exit_answer"],
                reflections.map((r) => [r.round, r.playerName, r.team, r.seat, r.wentWell, r.improvement, r.exitAnswer]))
            }
            style={{ ...buttonAlt, opacity: reflections.length === 0 ? 0.6 : 1 }}
          >
            <Download size={18} aria-hidden="true" /> Download reflections CSV
          </button>
        </div>
      </section>
    </div>
  );
}

const cell = { border: "2px solid var(--ink)", padding: "0.4rem 0.6rem", background: "#fff", verticalAlign: "top" } as const;

function Bars({ title, rates }: { title: string; rates: { key: string; label: string; total: number; correct: number }[] }) {
  return (
    <div>
      <h3 style={{ fontSize: "1.2rem", margin: "0 0 0.5rem" }}>{title}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
        {rates.map((r) => {
          const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
          return (
            <li key={r.key}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", fontWeight: 700 }}>
                <span>{r.label}</span>
                <span>{r.correct} of {r.total} correct ({pct}%)</span>
              </div>
              <div role="img" aria-label={`${r.label}: ${pct} percent correct`} style={{ height: "1.1rem", border: "2px solid var(--ink)", background: "#fff" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent-emerald)" }} />
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

  const open = useCallback((next: string) => router.push(`/teacher?code=${next}`), [router]);

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "var(--font-hud), monospace", fontWeight: 400, fontSize: "2.6rem", margin: "0 0 1rem" }}>Teacher dashboard</h1>
      <SignInGate defaultRole="teacher">
        <div style={{ marginBottom: "1rem" }}><SignedInAs /></div>
        {playerRole !== "teacher" ? (
          <div style={card}>
            <h2 style={h2}>Teacher accounts only</h2>
            <p style={{ margin: 0 }}>This account is a student account. Sign out, then sign in or create an account as a teacher.</p>
          </div>
        ) : (
          <>
            {code && (
              <p><Link href="/teacher" style={{ color: "var(--ink)", fontWeight: 700 }}>Back to all rooms</Link></p>
            )}
            {code ? <Dashboard code={code} /> : <Landing onOpen={open} />}
          </>
        )}
      </SignInGate>
    </div>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<p role="status">Loading...</p>}>
      <TeacherInner />
    </Suspense>
  );
}
