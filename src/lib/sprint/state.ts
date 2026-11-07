import type { Phase, SprintState, StoryState, TeamId, TeamState } from "./types";

/** Thrown for illegal moves. The API layer turns it into a BAD_REQUEST. */
export class SprintError extends Error {
  readonly code = "BAD_REQUEST";
}

const fail = (message: string): never => {
  throw new SprintError(message);
};

export const POINT_SCALE = [1, 2, 3, 5, 8];

/** Trace mat size for a story: null when the story has no code. */
export type TraceShape = { rows: number; cols: number } | null;

const emptyTeam = (name = "", joined = false): TeamState => ({
  name,
  joined,
  goal: "",
  estimates: [],
  planned: false,
  stories: [],
});

export function newSprintState(now: string): SprintState {
  return {
    round: 1,
    phase: "lobby",
    startedAt: null,
    phaseAt: now,
    teams: { A: emptyTeam(), B: emptyTeam() },
    baton: null,
  };
}

const lockedStory = (): StoryState => ({ status: "locked", answer: null, correct: null, reason: "", trace: [] });

function edit(state: SprintState, change: (s: SprintState) => void): SprintState {
  const next = structuredClone(state);
  change(next);
  return next;
}

function setPhase(s: SprintState, phase: Phase, now: string) {
  s.phase = phase;
  s.phaseAt = now;
}

function requirePhase(s: SprintState, ...phases: Phase[]) {
  if (!phases.includes(s.phase)) fail(`Not allowed during ${s.phase}.`);
}

/** Keeps `joined` in line with real members. A team with nobody loses its name; a first name sticks. */
export const syncTeams = (state: SprintState, has: Record<TeamId, boolean>, names: Partial<Record<TeamId, string>> = {}): SprintState =>
  edit(state, (s) => {
    for (const t of ["A", "B"] as const) {
      s.teams[t].joined = has[t];
      if (!has[t]) s.teams[t].name = "";
      else if (!s.teams[t].name) s.teams[t].name = (names[t] ?? "").trim();
    }
  });

/** lobby -> planning. suggested = mission points per story for each team. */
export const startPlanning = (state: SprintState, suggested: Record<TeamId, number[]>, now: string): SprintState =>
  edit(state, (s) => {
    requirePhase(s, "lobby");
    for (const t of ["A", "B"] as const) {
      s.teams[t].estimates = [...suggested[t]];
      s.teams[t].stories = suggested[t].map(lockedStory);
      s.teams[t].goal = "";
      s.teams[t].planned = false;
    }
    setPhase(s, "planning", now);
  });

export const savePlan = (state: SprintState, team: TeamId, goal: string, estimates: number[]): SprintState =>
  edit(state, (s) => {
    requirePhase(s, "planning");
    const t = s.teams[team];
    if (estimates.length !== t.stories.length) fail("Estimate every story.");
    if (estimates.some((e) => !POINT_SCALE.includes(e))) fail("Estimates must be 1, 2, 3, 5 or 8.");
    t.goal = goal.trim();
    t.estimates = estimates;
    t.planned = false;
  });

export const markPlanned = (state: SprintState, team: TeamId): SprintState =>
  edit(state, (s) => {
    requirePhase(s, "planning");
    if (!s.teams[team].goal) fail("Write a sprint goal first.");
    s.teams[team].planned = true;
  });

/** planning -> teamA. Needs both teams planned unless forced. */
export const startWork = (state: SprintState, force: boolean, now: string): SprintState =>
  edit(state, (s) => {
    requirePhase(s, "planning");
    if (!force && !(s.teams.A.planned && s.teams.B.planned)) fail("Both teams must finish planning.");
    s.startedAt ??= now;
    s.teams.A.stories[0].status = "doing";
    setPhase(s, "teamA", now);
  });

function currentStory(s: SprintState, team: TeamId, index: number): StoryState {
  requirePhase(s, team === "A" ? "teamA" : "teamB");
  const story = s.teams[team].stories[index];
  if (!story) return fail("No such story.");
  if (story.status !== "doing") return fail("That story is not open.");
  return story;
}

function checkTrace(trace: string[][], shape: TraceShape) {
  const rows = shape?.rows ?? 0;
  const cols = shape?.cols ?? 0;
  if (trace.length !== rows || trace.some((r) => r.length !== cols)) fail("Trace mat has the wrong size.");
}

/**
 * Stores the graded answer. The trace mat and reason must be written before the
 * check (the explanation is shown after it), and the first check locks all of
 * answer, correctness, reason and trace. Later calls change nothing.
 */
export const recordAnswer = (
  state: SprintState,
  team: TeamId,
  index: number,
  input: { answer: string; correct: boolean; reason: string; trace: string[][] },
  shape: TraceShape,
): SprintState =>
  edit(state, (s) => {
    const story = currentStory(s, team, index);
    if (story.answer !== null) return;
    checkTrace(input.trace, shape);
    const draft = { ...story, answer: input.answer, reason: input.reason.trim(), trace: input.trace };
    const missing = missingForDone(draft, shape).filter((m) => m !== "answer");
    if (missing.length) fail(`Before checking: ${missing.join(", ")}.`);
    story.answer = input.answer;
    story.correct = input.correct;
    story.reason = draft.reason;
    story.trace = input.trace;
  });

/** Definition of Done items still missing for a story. */
function missingForDone(story: StoryState, shape: TraceShape): ("trace" | "answer" | "reason")[] {
  const missing: ("trace" | "answer" | "reason")[] = [];
  const filled = story.trace.length > 0 && story.trace.every((r) => r.every((c) => c.trim() !== ""));
  if (shape && shape.cols > 0 && !filled) missing.push("trace");
  if (story.answer === null) missing.push("answer");
  if (story.reason.trim().length < 10) missing.push("reason");
  return missing;
}

/** Marks the story done, opens the next, and moves the phase on after the last one. */
export const completeStory = (state: SprintState, team: TeamId, index: number, shape: TraceShape, now: string): SprintState =>
  edit(state, (s) => {
    const story = currentStory(s, team, index);
    const missing = missingForDone(story, shape);
    if (missing.length) fail(`Not done yet: ${missing.join(", ")}.`);
    story.status = "done";
    const stories = s.teams[team].stories;
    if (index + 1 < stories.length) stories[index + 1].status = "doing";
    else setPhase(s, team === "A" ? "standup" : "review", now);
  });

/** standup -> teamB. */
export const passBaton = (state: SprintState, note: string, now: string): SprintState =>
  edit(state, (s) => {
    requirePhase(s, "standup");
    const text = note.trim();
    if (!text) fail("Write a stand-up note first.");
    s.baton = { note: text, at: now };
    s.teams.B.stories[0].status = "doing";
    setPhase(s, "teamB", now);
  });

/** review -> retro. */
export const goToRetro = (state: SprintState, now: string): SprintState =>
  edit(state, (s) => {
    requirePhase(s, "review");
    setPhase(s, "retro", now);
  });

export const assertRetro = (state: SprintState) => requirePhase(state, "retro");

/** New round: back to the lobby, team names kept, everything else cleared. */
export const newRound = (state: SprintState, now: string): SprintState => ({
  round: state.round + 1,
  phase: "lobby",
  startedAt: null,
  phaseAt: now,
  teams: {
    A: emptyTeam(state.teams.A.name, state.teams.A.joined),
    B: emptyTeam(state.teams.B.name, state.teams.B.joined),
  },
  baton: null,
});

/** Velocity: the team's estimates summed over its Done stories. */
export const velocity = (team: TeamState): number =>
  team.stories.reduce((sum, st, i) => sum + (st.status === "done" ? (team.estimates[i] ?? 0) : 0), 0);
