// Drives one full sprint against a running server, with real accounts.
// pnpm exec tsx --env-file=.env.local scripts/e2e-sprint.ts http://localhost:3200
// Creates accounts named e2e_<run>_* (printed at the start) so they can be cleaned up afterwards.
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { MISSIONS } from "../src/app/build/missions";
import { questionsFor } from "../src/lib/sprint/mission";
import { cellId, traceLayout } from "../src/lib/sprint/trace";
import { checkStoryTrace } from "../src/lib/sprint/traceCheck";
import type { AppRouter } from "../src/server/api/root";

const base = process.argv[2] ?? "http://localhost:3200";
const run = Math.random().toString(36).slice(2, 8);

type User = { name: string; api: ReturnType<typeof createTRPCClient<AppRouter>> };

/** Signs up through /api/auth and returns a tRPC client that sends that account's session cookie. */
async function signUp(label: string, role: "student" | "teacher"): Promise<User> {
  const name = `e2e_${run}_${label}`;
  const res = await fetch(`${base}/api/auth`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ mode: "create", name, password: "e2e-pass-1", role }),
  });
  if (!res.ok) throw new Error(`sign-up failed for ${name}: ${res.status} ${await res.text()}`);
  const cookie = res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  const me = (await res.json()).player;
  if (me.role !== role) throw new Error(`${name} came back as ${me.role}`);
  const api = createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: `${base}/api/trpc`, transformer: superjson, headers: () => ({ cookie }) })],
  });
  return { name, api };
}

const anonymous = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: `${base}/api/trpc`, transformer: superjson })],
});

let failed = 0;
function check(name: string, ok: boolean) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) failed++;
}
async function rejects(name: string, p: Promise<unknown>) {
  try {
    await p;
    check(name, false);
  } catch {
    check(name, true);
  }
}
async function rejectsWith(name: string, code: string, p: Promise<unknown>) {
  try {
    await p;
    check(name, false);
  } catch (e) {
    check(name, (e as { data?: { code?: string } }).data?.code === code);
  }
}

const mission = MISSIONS.find((m) => m.id === "loops")!;
const WRONG_STORY = 1; // team A answers this one wrong on purpose
const wrongAnswer = (q: { options: string[]; answer: string }) => q.options.find((o) => o !== q.answer)!;

async function main() {
  const teacher = await signUp("teacher", "teacher");
  const teacher2 = await signUp("teacher2", "teacher");
  const a1 = await signUp("a1", "student");
  const a2 = await signUp("a2", "student");
  const b1 = await signUp("b1", "student");
  const b2 = await signUp("b2", "student");
  const outsider = await signUp("outsider", "student");
  const crew: Record<"A" | "B", User[]> = { A: [a1, a2], B: [b1, b2] };
  console.log(`accounts created: e2e_${run}_{teacher,teacher2,a1,a2,b1,b2,outsider}`);

  // Multi-device: the same account signed in from two cookie jars; signing out one keeps the other.
  const signInJar = async (name: string) => {
    const res = await fetch(`${base}/api/auth`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "login", name, password: "e2e-pass-1" }),
    });
    if (!res.ok) throw new Error(`sign-in failed for ${name}: ${res.status}`);
    return res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  };
  const authMe = async (cookie: string) => ((await (await fetch(`${base}/api/auth`, { headers: { cookie } })).json()).player?.name ?? null) as string | null;
  const jarApi = (cookie: string) =>
    createTRPCClient<AppRouter>({ links: [httpBatchLink({ url: `${base}/api/trpc`, transformer: superjson, headers: () => ({ cookie }) })] });
  const jar1 = await signInJar(outsider.name);
  const jar2 = await signInJar(outsider.name);
  check("two sign-ins give different cookies", jar1 !== jar2);
  check("both jars GET /api/auth as the account", (await authMe(jar1)) === outsider.name && (await authMe(jar2)) === outsider.name);
  const fakeRoom = "ZZZZZZ";
  const roomGet = async (cookie: string) => {
    try {
      await jarApi(cookie).room.get.query({ code: fakeRoom });
      return "ok";
    } catch (e) {
      return (e as { data?: { code?: string } }).data?.code ?? "error";
    }
  };
  check("both jars pass room.get auth", (await roomGet(jar1)) !== "UNAUTHORIZED" && (await roomGet(jar2)) !== "UNAUTHORIZED");
  await fetch(`${base}/api/auth`, { method: "DELETE", headers: { cookie: jar1 } });
  check("signing out jar 1 signs it out", (await authMe(jar1)) === null && (await roomGet(jar1)) === "UNAUTHORIZED");
  check("jar 2 stays signed in", (await authMe(jar2)) === outsider.name && (await roomGet(jar2)) !== "UNAUTHORIZED");

  await rejectsWith("anonymous create rejected", "UNAUTHORIZED", anonymous.room.create.mutate({ className: "x" }));
  await rejectsWith("student create FORBIDDEN", "FORBIDDEN", a1.api.room.create.mutate({ className: "x" }));

  const { code } = await teacher.api.room.create.mutate({ className: "E2E Period 1" });
  check("create gives 6-char code", code.length === 6);
  const t = { code };
  const mine = await teacher.api.room.mine.query();
  check("room.mine lists the new room", mine[0]?.code === code && mine[0].phase === "lobby");
  check("second teacher has no rooms", (await teacher2.api.room.mine.query()).length === 0);

  await rejectsWith("anonymous room.get rejected", "UNAUTHORIZED", anonymous.room.get.query({ code }));
  await rejectsWith("anonymous join rejected", "UNAUTHORIZED", anonymous.room.join.mutate({ code, team: "A", name: "Alpha" }));
  await rejectsWith("student setMission FORBIDDEN", "FORBIDDEN", a1.api.room.setMission.mutate({ code, missionId: mission.id }));
  await rejectsWith("student dashboard FORBIDDEN", "FORBIDDEN", a1.api.room.dashboard.query(t));
  await rejectsWith("second teacher cannot setMission", "FORBIDDEN", teacher2.api.room.setMission.mutate({ code, missionId: mission.id }));
  await rejectsWith("second teacher cannot see dashboard", "FORBIDDEN", teacher2.api.room.dashboard.query(t));

  const fresh = await a1.api.room.get.query({ code });
  check("new room is in lobby with no mission, student not a member", fresh.state.phase === "lobby" && fresh.mission === null && fresh.me === null);

  await rejects("startPlanning without mission rejected", teacher.api.room.startPlanning.mutate(t));
  await teacher.api.room.setMission.mutate({ ...t, missionId: mission.id });
  await rejectsWith("non-member cannot savePlan", "FORBIDDEN", a1.api.room.savePlan.mutate({ code, team: "A", goal: "g", estimates: [] }));
  await a1.api.room.join.mutate({ code, team: "A", name: "Alpha" });
  await a2.api.room.join.mutate({ code, team: "A", name: "Ignored" });
  await b1.api.room.join.mutate({ code, team: "B", name: "Beta" });
  await b2.api.room.join.mutate({ code, team: "B" });
  await a2.api.room.join.mutate({ code, team: "A" }); // joining again changes nothing
  await teacher.api.room.startPlanning.mutate(t);

  const planned = await a1.api.room.get.query({ code });
  check("planning phase, teams joined, first group name sticks", planned.state.phase === "planning" && planned.state.teams.A.name === "Alpha" && planned.state.teams.B.joined);
  const seatKeys = [`A:1:${a1.name}`, `A:2:${a2.name}`, `B:1:${b1.name}`, `B:2:${b2.name}`];
  check("members listed with seats", seatKeys.every((k) => planned.members.some((m) => `${m.team}:${m.seat}:${m.name}` === k)));
  check("me reflects own team and seat", planned.me?.team === "A" && planned.me.seat === 1 && (await b2.api.room.get.query({ code })).me?.seat === 2);
  check("room.get mission has no answer, explanation or trace key", !/"answer"|"explanation"|"traceKey"/.test(JSON.stringify(planned.mission)));

  await rejects("startWork before planned rejected", teacher.api.room.startWork.mutate(t));
  const nA = mission.groupA.questions.length;
  const nB = mission.groupB.questions.length;
  await rejectsWith("Team B member cannot plan for Team A", "FORBIDDEN", b1.api.room.savePlan.mutate({ code, team: "A", goal: "sneaky", estimates: Array(nA).fill(1) }));
  await a1.api.room.savePlan.mutate({ code, team: "A", goal: "Finish all of A", estimates: Array(nA).fill(2) });
  await rejects("markPlanned without goal rejected", b1.api.room.markPlanned.mutate({ code, team: "B" }));
  await a2.api.room.markPlanned.mutate({ code, team: "A" });
  await b1.api.room.savePlan.mutate({ code, team: "B", goal: "Finish all of B", estimates: Array(nB).fill(3) });
  await b2.api.room.markPlanned.mutate({ code, team: "B" });
  await teacher.api.room.startWork.mutate(t);

  const work = await a1.api.room.get.query({ code });
  check("teamA phase, story 0 doing", work.state.phase === "teamA" && work.state.teams.A.stories[0].status === "doing");
  await rejects("Team B answer rejected before baton", b1.api.room.checkAnswer.mutate({ code, team: "B", storyIndex: 0, answer: mission.groupB.questions[0].options[0], reason: "trying early", trace: [] }));
  await rejectsWith("Team B member cannot answer for Team A", "FORBIDDEN", b1.api.room.checkAnswer.mutate({ code, team: "A", storyIndex: 0, answer: mission.groupA.questions[0].options[0], reason: "wrong team here", trace: [] }));
  await rejectsWith("Team B member cannot complete for Team A", "FORBIDDEN", b1.api.room.completeStory.mutate({ code, team: "A", storyIndex: 0 }));

  // Work through a team's stories; the two members take turns at the keyboard.
  async function playTeam(team: "A" | "B", wrongIndex: number | null) {
    const questions = questionsFor(mission, team);
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const api = crew[team][i % 2].api;
      const layout = q.code ? traceLayout(q.code) : null;
      // Team A fills every cell with "0"; Team B writes the trace key's values (and "0" in the cells it does not cover).
      const mat = layout && layout.variables.length
        ? layout.lines.map((_, r) => layout.variables.map((v) => (team === "B" ? q.traceKey?.[cellId(r + 1, v)] : undefined) ?? "0"))
        : [];
      const answer = i === wrongIndex ? wrongAnswer(q) : q.answer;
      if (team === "A" && i === 0) {
        await rejects("complete before check rejected", api.room.completeStory.mutate({ code, team, storyIndex: 0 }));
        await rejects("answer for locked story rejected", api.room.checkAnswer.mutate({ code, team, storyIndex: 1, answer: questions[1].answer, reason: "too early", trace: [] }));
        await rejects("check without reason rejected", api.room.checkAnswer.mutate({ code, team, storyIndex: 0, answer, reason: "", trace: mat }));
        if (mat.length) {
          const holey = mat.map((r, ri) => (ri === 0 ? r.map(() => "") : r));
          await rejects("check with empty trace cell rejected", api.room.checkAnswer.mutate({ code, team, storyIndex: 0, answer, reason: "reason is long enough", trace: holey }));
        }
        const first = await api.room.checkAnswer.mutate({ code, team, storyIndex: 0, answer, reason: "because I traced it carefully", trace: mat });
        check("check returns grading and explanation", first.correct && first.explanation === q.explanation);
        const again = await api.room.checkAnswer.mutate({ code, team, storyIndex: 0, answer: wrongAnswer(q), reason: "copied the explanation afterwards", trace: mat });
        const locked = again.state.teams[team].stories[0];
        check("first check locks answer and reason", again.correct && locked.reason === "because I traced it carefully");
      }
      const res = await api.room.checkAnswer.mutate({ code, team, storyIndex: i, answer, reason: "because I traced it carefully", trace: mat });
      check(`${team} story ${i} graded ${i === wrongIndex ? "wrong" : "correct"}`, res.correct === (i !== wrongIndex));
      const expected = checkStoryTrace(q, mat);
      if (!q.traceKey) check(`${team} story ${i} has no trace check`, res.traceCheck === null);
      else if (team === "A") check(`${team} story ${i} all-zero mat has trace mismatches`, res.traceCheck !== null && res.traceCheck.checked === expected?.checked && res.traceCheck.mismatches.length > 0);
      else check(`${team} story ${i} key mat matches every key cell`, res.traceCheck !== null && res.traceCheck.checked > 0 && res.traceCheck.matched === res.traceCheck.checked && res.traceCheck.mismatches.length === 0);
      await api.room.completeStory.mutate({ code, team, storyIndex: i });
    }
  }

  await playTeam("A", WRONG_STORY);
  const standup = await a1.api.room.get.query({ code });
  check("all A done moves to standup", standup.state.phase === "standup");
  await rejects("Team B answer rejected during standup", b1.api.room.checkAnswer.mutate({ code, team: "B", storyIndex: 0, answer: mission.groupB.questions[0].options[0], reason: "still early", trace: [] }));
  await rejects("empty baton note rejected", a1.api.room.passBaton.mutate({ code, note: "   " }));
  await rejectsWith("Team B member cannot pass the baton", "FORBIDDEN", b1.api.room.passBaton.mutate({ code, note: "Not our baton." }));
  await a1.api.room.passBaton.mutate({ code, note: "Team A finished; watch the loop condition." });
  const teamB = await b1.api.room.get.query({ code });
  check("baton passed, Team B open with note", teamB.state.phase === "teamB" && teamB.state.baton?.note.startsWith("Team A") === true);

  await playTeam("B", null);
  const review = await a1.api.room.get.query({ code });
  check("all B done moves to review", review.state.phase === "review");
  await rejects("reflection before retro rejected", a1.api.room.submitReflection.mutate({ code, wentWell: "x", improvement: "y", exitAnswer: "z" }));
  await rejectsWith("student cannot start retro for the class", "FORBIDDEN", a1.api.room.startRetro.mutate(t));
  await teacher.api.room.startRetro.mutate(t);
  await rejectsWith("non-member reflection rejected", "FORBIDDEN", outsider.api.room.submitReflection.mutate({ code, wentWell: "x", improvement: "y", exitAnswer: "z" }));
  await a1.api.room.submitReflection.mutate({ code, wentWell: "Teamwork", improvement: "Start earlier", exitAnswer: "count is 3 because the loop stops" });
  await a2.api.room.submitReflection.mutate({ code, wentWell: "Pairing", improvement: "Talk more", exitAnswer: "count is 3 after the loop" });
  await b1.api.room.submitReflection.mutate({ code, wentWell: "Roles", improvement: "Read slower", exitAnswer: "count is 3" });
  await b2.api.room.submitReflection.mutate({ code, wentWell: "Trace mat", improvement: "Check twice", exitAnswer: "three" });
  await a1.api.room.submitReflection.mutate({ code, wentWell: "Teamwork", improvement: "Start earlier, resubmitted", exitAnswer: "count is 3 because 3 < 3 is false" });

  const dash = await teacher.api.room.dashboard.query(t);
  const all = [...questionsFor(mission, "A"), ...questionsFor(mission, "B")];
  check("dashboard has a result per story", dash.results.length === all.length);
  check(
    "dashboard results carry the trace check of the saved mat",
    dash.results.filter((r) => r.traceCheck !== null).length === all.filter((q) => q.traceKey).length &&
      dash.results.every((r) => r.traceCheck === null || (r.team === "A") === (r.traceCheck.mismatches.length > 0)),
  );
  check("dashboard has 4 reflections (one per player per round)", dash.reflections.length === 4);
  check(
    "resubmitted reflection replaced",
    dash.reflections.filter((r) => r.playerName === a1.name).length === 1 &&
      dash.reflections.some((r) => r.playerName === a1.name && r.improvement.endsWith("resubmitted")),
  );
  check(
    "reflections carry player names, team and seat",
    [a1, a2, b1, b2].every((u, i) => dash.reflections.some((r) => r.playerName === u.name && r.team === (i < 2 ? "A" : "B") && r.seat === (i % 2) + 1)),
  );
  check("dashboard lists members", dash.members.length === 4);

  const expectedCorrect = all.length - 1;
  const topic = dash.aggregates.round.byTopic.find((r) => r.key === mission.topic);
  check("topic aggregate counts", topic?.total === all.length && topic?.correct === expectedCorrect);
  const objectives = new Set(all.map((q) => String(q.objective)));
  check("objective aggregate covers each objective", dash.aggregates.round.byObjective.length === objectives.size);
  const wrongObjective = String(questionsFor(mission, "A")[WRONG_STORY].objective);
  for (const o of dash.aggregates.round.byObjective) {
    const total = all.filter((q) => String(q.objective) === o.key).length;
    check(`objective ${o.key} total and correct`, o.total === total && o.correct === total - (o.key === wrongObjective ? 1 : 0));
  }

  await rejectsWith("second teacher cannot start a new round", "FORBIDDEN", teacher2.api.room.newRound.mutate(t));
  await teacher.api.room.newRound.mutate(t);
  const after = await teacher.api.room.dashboard.query(t);
  check("newRound resets to lobby, round 2, names and members kept", after.state.round === 2 && after.state.phase === "lobby" && after.state.teams.A.name === "Alpha" && after.members.length === 4);
  check("round aggregate empty, all-rounds kept", after.aggregates.round.byTopic.length === 0 && after.aggregates.all.byTopic[0]?.total === all.length);

  if (failed) {
    console.log(`${failed} FAILED`);
    process.exit(1);
  }
  console.log("all e2e checks passed");
}

main().catch((e) => {
  console.log("FAIL unexpected error:", e);
  process.exit(1);
});
