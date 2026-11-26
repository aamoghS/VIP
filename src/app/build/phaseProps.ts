import type { PublicMission, SprintState, TeamId, TraceCheck } from "@/lib/sprint/types";

export type Member = { name: string; team: TeamId; seat: number };

/** What a checked story shows: sent with the room, so a teammate's device can show it too. */
export type CheckedStory = { storyIndex: number; explanation: string; traceCheck: TraceCheck | null };

export type PhaseProps = {
  code: string;
  team: TeamId;
  state: SprintState;
  mission: PublicMission | null;
  members: Member[];
  me: { team: TeamId; seat: number };
  checked: CheckedStory | null;
  myReflection?: { createdAt: Date | string } | null;
  refresh: () => void;
};

export const other = (t: TeamId): TeamId => (t === "A" ? "B" : "A");
