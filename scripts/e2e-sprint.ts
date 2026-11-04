// Drives one full sprint against a running server.
// pnpm exec tsx --env-file=.env.local scripts/e2e-sprint.ts http://localhost:3200
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { MISSIONS } from "../src/app/sprint/missions";
import { questionsFor } from "../src/lib/sprint/mission";
import { traceLayout } from "../src/lib/sprint/trace";
import type { AppRouter } from "../src/server/api/root";

const base = process.argv[2] ?? "http://localhost:3200";
const api = createTRPCClient<AppRouter>({
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

const mission = MISSIONS.find((m) => m.id === "loops")!;
const WRONG_STORY = 1; // team A answers this one wrong on purpose
const wrongAnswer = (q: { options: string[]; answer: string }) => q.options.find((o) => o !== q.answer)!;

async function main() {
  const { code, teacherToken } = await api.room.create.mutate({ className: "E2E Period 1" });
  check("create gives 6-char code and token", code.length === 6 && teacherToken.length > 20);
  const t = { code, teacherToken };

  const fresh = await api.room.get.query({ code });
  check("new room is in lobby with no mission", fresh.state.phase === "lobby" && fresh.mission === null);
  check("get does not expose teacher token", !JSON.stringify(fresh).includes(teacherToken));

  await rejects("startPlanning without mission rejected", api.room.startPlanning.mutate(t));
  await rejects("wrong teacher token rejected", api.room.setMission.mutate({ code, teacherToken: "nope", missionId: mission.id }));
  await api.room.setMission.mutate({ ...t, missionId: mission.id });
  await api.room.join.mutate({ code, team: "A", name: "Alpha" });
  await api.room.join.mutate({ code, team: "B", name: "Beta" });
  await api.room.startPlanning.mutate(t);

  const planned = await api.room.get.query({ code });
  check("planning phase, teams joined", planned.state.phase === "planning" && planned.state.teams.A.name === "Alpha" && planned.state.teams.B.joined);
  const leak = JSON.stringify(planned.mission);
  check("room.get mission has no answer or explanation", !/"answer"|"explanation"/.test(leak));

  await rejects("startWork before planned rejected", api.room.startWork.mutate(t));
  const nA = mission.groupA.questions.length;
  const nB = mission.groupB.questions.length;
  await api.room.savePlan.mutate({ code, team: "A", goal: "Finish all of A", estimates: Array(nA).fill(2) });
  await rejects("markPlanned without goal rejected", api.room.markPlanned.mutate({ code, team: "B" }));
  await api.room.markPlanned.mutate({ code, team: "A" });
  await api.room.savePlan.mutate({ code, team: "B", goal: "Finish all of B", estimates: Array(nB).fill(3) });
  await api.room.markPlanned.mutate({ code, team: "B" });
  await api.room.startWork.mutate(t);

  const work = await api.room.get.query({ code });
  check("teamA phase, story 0 doing", work.state.phase === "teamA" && work.state.teams.A.stories[0].status === "doing");
  await rejects("Team B answer rejected before baton", api.room.checkAnswer.mutate({ code, team: "B", storyIndex: 0, answer: mission.groupB.questions[0].options[0], reason: "trying early", trace: [] }));

  // Work through a team's stories. Returns the number answered correctly.
  async function playTeam(team: "A" | "B", wrongIndex: number | null) {
    const questions = questionsFor(mission, team);
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const layout = q.code ? traceLayout(q.code) : null;
      const mat = layout && layout.variables.length ? layout.lines.map(() => layout.variables.map(() => "0")) : [];
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
      await api.room.completeStory.mutate({ code, team, storyIndex: i });
    }
  }

  await playTeam("A", WRONG_STORY);
  const standup = await api.room.get.query({ code });
  check("all A done moves to standup", standup.state.phase === "standup");
  await rejects("Team B answer rejected during standup", api.room.checkAnswer.mutate({ code, team: "B", storyIndex: 0, answer: mission.groupB.questions[0].options[0], reason: "still early", trace: [] }));
  await rejects("empty baton note rejected", api.room.passBaton.mutate({ code, note: "   " }));
  await api.room.passBaton.mutate({ code, note: "Team A finished; watch the loop condition." });
  const teamB = await api.room.get.query({ code });
  check("baton passed, Team B open with note", teamB.state.phase === "teamB" && teamB.state.baton?.note.startsWith("Team A") === true);

  await playTeam("B", null);
  const review = await api.room.get.query({ code });
  check("all B done moves to review", review.state.phase === "review");
  await rejects("reflection before retro rejected", api.room.submitReflection.mutate({ code, team: "A", seat: 1, wentWell: "x", improvement: "y", exitAnswer: "z" }));
  await api.room.startRetro.mutate(t);
  await api.room.submitReflection.mutate({ code, team: "A", seat: 1, wentWell: "Teamwork", improvement: "Start earlier", exitAnswer: "count is 3 because the loop stops" });
  await api.room.submitReflection.mutate({ code, team: "B", seat: 2, wentWell: "Roles", improvement: "Read slower", exitAnswer: "count is 3" });
  await api.room.submitReflection.mutate({ code, team: "A", seat: 1, wentWell: "Teamwork", improvement: "Start earlier, resubmitted", exitAnswer: "count is 3 because 3 < 3 is false" });

  await rejects("dashboard with wrong token rejected", api.room.dashboard.query({ code, teacherToken: "nope" }));
  const dash = await api.room.dashboard.query(t);
  const all = [...questionsFor(mission, "A"), ...questionsFor(mission, "B")];
  check("dashboard has a result per story", dash.results.length === all.length);
  check("dashboard has 2 reflections (upsert keeps one per seat)", dash.reflections.length === 2);
  check("resubmitted reflection replaced", dash.reflections.some((r) => r.seat === 1 && r.improvement.endsWith("resubmitted")));

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

  await api.room.newRound.mutate(t);
  const after = await api.room.dashboard.query(t);
  check("newRound resets to lobby, round 2, names kept", after.state.round === 2 && after.state.phase === "lobby" && after.state.teams.A.name === "Alpha");
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
