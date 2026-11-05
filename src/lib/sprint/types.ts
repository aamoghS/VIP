import type { ExitTicket, Objective, Points } from "@/app/build/types";

export type TeamId = "A" | "B";
export type Phase = "lobby" | "planning" | "teamA" | "standup" | "teamB" | "review" | "retro";

export type StoryState = {
  status: "locked" | "doing" | "done";
  answer: string | null;
  correct: boolean | null;
  reason: string;
  trace: string[][];
};

export type TeamState = {
  name: string;
  joined: boolean;
  goal: string;
  estimates: number[];
  planned: boolean;
  stories: StoryState[];
};

export type SprintState = {
  round: number;
  phase: Phase;
  startedAt: string | null;
  phaseAt: string;
  teams: { A: TeamState; B: TeamState };
  baton: { note: string; at: string } | null;
};

export type TraceLayout = { lines: string[]; variables: string[] };

/** A question as students see it: no answer, no explanation. */
export type PublicStory = {
  index: number;
  title: string;
  userStory: string;
  prompt: string;
  code?: string;
  options: string[];
  objective: Objective;
  points: Points;
  /** Trace mat layout, present only when the story has code. */
  trace: TraceLayout | null;
};

export type PublicMission = {
  id: string;
  title: string;
  topic: string;
  topicKey: string;
  topicIcon: string;
  topicColor: string;
  description: string;
  handoffMessage: string;
  successMessage: string;
  exitTicket: ExitTicket;
  teams: Record<TeamId, { role: string; challenge: string; stories: PublicStory[] }>;
};
