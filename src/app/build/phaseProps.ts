import type { PublicMission, SprintState, TeamId } from "@/lib/sprint/types";

export type Member = { name: string; team: TeamId; seat: number };

export type PhaseProps = {
  code: string;
  team: TeamId;
  state: SprintState;
  mission: PublicMission | null;
  members: Member[];
  me: { team: TeamId; seat: number };
  myReflection?: { createdAt: Date | string } | null;
  refresh: () => void;
};

export const other = (t: TeamId): TeamId => (t === "A" ? "B" : "A");
