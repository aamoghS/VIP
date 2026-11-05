// Pure logic checks, no DB: pnpm exec tsx scripts/check-sprint-logic.ts
import { MISSIONS } from "../src/app/build/missions";
import { aggregate } from "../src/lib/sprint/aggregate";
import { toPublicMission } from "../src/lib/sprint/mission";
import { roleFor } from "../src/lib/sprint/roles";
import * as s from "../src/lib/sprint/state";
import { traceLayout } from "../src/lib/sprint/trace";

let failed = 0;
function check(name: string, ok: boolean) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) failed++;
}
function throwsSprintError(fn: () => unknown) {
  try {
    fn();
    return false;
  } catch (e) {
    return e instanceof s.SprintError;
  }
}

// traceLayout
const t = traceLayout(`# setup\n\ntotal = 0\nfor i in range(3):\n    if i == 1:  # skip\n        total += i\n    x = total\n`);
check("traceLayout skips blank and comment lines", t.lines.length === 5);
check("traceLayout finds =, +=, for vars, not ==", t.variables.join(",") === "total,i,x");
check("traceLayout comment-only code has no rows", traceLayout("# nothing").lines.length === 0);

// roles
check("roleFor rotates per story", roleFor(0, 0) === "Scrum Master" && roleFor(0, 1) === "Driver" && roleFor(3, 1) === "Scrum Master");

// content
check("every question has objective and points", MISSIONS.every((m) => [...m.groupA.questions, ...m.groupB.questions].every((q) => q.objective && q.points)));
check("every mission has an objective-2 story", MISSIONS.every((m) => [...m.groupA.questions, ...m.groupB.questions].some((q) => q.objective === 2)));
check("public mission leaks no answers", !JSON.stringify(toPublicMission(MISSIONS[0])).includes("explanation"));

// transitions
const now = "2026-01-01T00:00:00.000Z";
const shape = { rows: 2, cols: 1 };
let st = s.newSprintState(now);
check("cannot answer in lobby", throwsSprintError(() => s.recordAnswer(st, "A", 0, { answer: "x", correct: true, reason: "", trace: [] }, null)));
st = s.startPlanning(st, { A: [1, 2], B: [3] }, now);
check("cannot start work before planning done", throwsSprintError(() => s.startWork(st, false, now)));
check("cannot mark planned without goal", throwsSprintError(() => s.markPlanned(st, "A")));
st = s.savePlan(st, "A", "Ship it", [2, 3]);
st = s.markPlanned(st, "A");
st = s.markPlanned(s.savePlan(st, "B", "Also ship", [5]), "B");
st = s.startWork(st, false, now);
check("team A story 0 is doing", st.phase === "teamA" && st.teams.A.stories[0].status === "doing");
check("team B locked during teamA", throwsSprintError(() => s.recordAnswer(st, "B", 0, { answer: "x", correct: true, reason: "", trace: [] }, null)));
check("cannot answer a locked story", throwsSprintError(() => s.recordAnswer(st, "A", 1, { answer: "x", correct: true, reason: "", trace: [] }, null)));
check("wrong trace size rejected", throwsSprintError(() => s.recordAnswer(st, "A", 0, { answer: "x", correct: true, reason: "", trace: [["1"]] }, shape)));
check("check blocks empty trace cell and short reason", throwsSprintError(() => s.recordAnswer(st, "A", 0, { answer: "x", correct: true, reason: "short", trace: [["1"], [""]] }, shape)));
check("DoD blocks complete before check", throwsSprintError(() => s.completeStory(st, "A", 0, shape, now)));
st = s.recordAnswer(st, "A", 0, { answer: "x", correct: true, reason: "because of the loop", trace: [["1"], ["2"]] }, shape);
st = s.recordAnswer(st, "A", 0, { answer: "y", correct: false, reason: "edited after seeing it", trace: [["9"], ["9"]] }, shape);
check("first check locks answer, reason, trace", st.teams.A.stories[0].answer === "x" && st.teams.A.stories[0].reason === "because of the loop" && st.teams.A.stories[0].trace[0][0] === "1");
check("first check locks the answer", st.teams.A.stories[0].answer === "x" && st.teams.A.stories[0].correct === true);
st = s.completeStory(st, "A", 0, shape, now);
check("next story opens", st.teams.A.stories[0].status === "done" && st.teams.A.stories[1].status === "doing");
st = s.recordAnswer(st, "A", 1, { answer: "x", correct: false, reason: "a long enough reason", trace: [] }, null);
st = s.completeStory(st, "A", 1, null, now);
check("all A done goes to standup", st.phase === "standup");
check("velocity sums estimates of done stories", s.velocity(st.teams.A) === 5);
check("baton needs a note", throwsSprintError(() => s.passBaton(st, "   ", now)));
st = s.passBaton(st, "A done", now);
check("baton opens team B", st.phase === "teamB" && st.teams.B.stories[0].status === "doing" && st.baton?.note === "A done");
st = s.recordAnswer(st, "B", 0, { answer: "x", correct: true, reason: "a long enough reason", trace: [] }, null);
st = s.completeStory(st, "B", 0, null, now);
check("all B done goes to review", st.phase === "review");
check("retro not allowed before review ends", throwsSprintError(() => s.assertRetro(st)));
st = s.goToRetro(st, now);
check("retro phase reached", st.phase === "retro");
const next = s.newRound(st, now);
check("newRound resets, keeps names", next.round === 2 && next.phase === "lobby" && next.teams.A.stories.length === 0 && next.baton === null);

// aggregate
const agg = aggregate([
  { topic: "Loops", objective: 1, correct: true },
  { topic: "Loops", objective: 2, correct: false },
  { topic: "Variables", objective: 1, correct: true },
]);
check("aggregate by topic", agg.byTopic.find((r) => r.key === "Loops")?.total === 2 && agg.byTopic.find((r) => r.key === "Loops")?.correct === 1);
check("aggregate by objective", agg.byObjective.find((r) => r.key === "1")?.correct === 2);

if (failed) {
  console.log(`${failed} FAILED`);
  process.exit(1);
}
console.log("all checks passed");
