export const ROLES = ["Scrum Master", "Driver", "Tracer", "Reporter"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_DUTIES: Record<Role, string> = {
  "Scrum Master": "Keeps time and checks the Definition of Done.",
  Driver: "Reads the code aloud, line by line.",
  Tracer: "Fills in the trace mat as the code is read.",
  Reporter: "Types the answer and the reason.",
};

/** Role held by a seat (0-based) for a story (0-based). Rotates every story. */
export function roleFor(seat: number, storyIndex: number): Role {
  return ROLES[(seat + storyIndex) % ROLES.length];
}
