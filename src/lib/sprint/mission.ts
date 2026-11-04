import { MISSIONS } from "@/app/sprint/missions";
import type { QuizQuestion, SprintMission } from "@/app/sprint/types";
import { traceLayout } from "./trace";
import type { PublicMission, PublicStory, TeamId } from "./types";

export const getMission = (id: string | null): SprintMission | null =>
  MISSIONS.find((m) => m.id === id) ?? null;

export const teamOf = (mission: SprintMission, team: TeamId) =>
  team === "A" ? mission.groupA : mission.groupB;

export const questionsFor = (mission: SprintMission, team: TeamId): QuizQuestion[] =>
  teamOf(mission, team).questions;

/** Short card title: the first sentence of the prompt, capped. */
function storyTitle(q: QuizQuestion): string {
  const first = q.prompt.split(/(?<=[.?])\s/)[0];
  return first.length > 70 ? `${first.slice(0, 67)}...` : first;
}

/** "As the Check-in Lead, we want to ... so we can finish ...", as the user story for a question. */
export function userStoryText(mission: SprintMission, team: TeamId, q: QuizQuestion): string {
  const { role, challenge } = teamOf(mission, team);
  const goal = challenge.charAt(0).toLowerCase() + challenge.slice(1);
  return `As the ${role}, we want to ${goal}, so we can finish "${mission.title}".`;
}

function toPublicStory(mission: SprintMission, team: TeamId, q: QuizQuestion, index: number): PublicStory {
  return {
    index,
    title: storyTitle(q),
    userStory: userStoryText(mission, team, q),
    prompt: q.prompt,
    code: q.code,
    options: q.options,
    objective: q.objective,
    points: q.points,
    trace: q.code ? traceLayout(q.code) : null,
  };
}

/** Mission payload for students: answers and explanations stripped. */
export function toPublicMission(m: SprintMission): PublicMission {
  const side = (team: TeamId) => ({
    role: teamOf(m, team).role,
    challenge: teamOf(m, team).challenge,
    stories: questionsFor(m, team).map((q, i) => toPublicStory(m, team, q, i)),
  });
  return {
    id: m.id,
    title: m.title,
    topic: m.topic,
    topicKey: m.topicKey,
    topicIcon: m.topicIcon,
    topicColor: m.topicColor,
    description: m.description,
    handoffMessage: m.handoffMessage,
    successMessage: m.successMessage,
    exitTicket: m.exitTicket,
    teams: { A: side("A"), B: side("B") },
  };
}
