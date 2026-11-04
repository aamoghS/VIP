import type { PublicMission, SprintState, TeamId } from "@/lib/sprint/types";

export type PhaseProps = {
  code: string;
  team: TeamId;
  state: SprintState;
  mission: PublicMission | null;
  refresh: () => void;
};

export const other = (t: TeamId): TeamId => (t === "A" ? "B" : "A");
