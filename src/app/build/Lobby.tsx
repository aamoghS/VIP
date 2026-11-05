"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { Badge, INK, Panel, SPACE, STEP, SURFACE, TICKET, cardTitle, heading, hint } from "./ui";
import type { PhaseProps } from "./phaseProps";

export function Lobby({ team, state, mission }: PhaseProps & { className: string }) {
  return (
    <Panel>
      <h2 style={heading}>Waiting for the sprint to start</h2>
      <p style={{ ...hint, fontSize: STEP.s0, marginTop: SPACE[2] }} role="status">
        <Clock size={16} style={{ verticalAlign: "-2px" }} aria-hidden />{" "}
        {mission ? `Mission: ${mission.title}. Waiting for your teacher to start planning.` : "Waiting for your teacher to pick a mission."} This page updates by itself.
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: `${SPACE[5]} 0 0`, display: "grid", gap: SPACE[3], gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))" }}>
        {(["A", "B"] as const).map((t) => {
          const mine = t === team;
          return (
            <li
              key={t}
              style={{
                border: `3px solid ${INK}`,
                background: SURFACE,
                borderLeftWidth: mine ? 8 : 3,
                borderLeftColor: mine ? TICKET : INK,
                padding: `${SPACE[3]} ${SPACE[4]}`,
              }}
            >
              <div style={{ display: "flex", gap: SPACE[2], alignItems: "center", flexWrap: "wrap" }}>
                <span style={cardTitle}>Team {t}</span>
                {mine ? <Badge>You</Badge> : null}
              </div>
              <div>{state.teams[t].joined ? state.teams[t].name : "Nobody yet"}</div>
              <div style={{ fontWeight: 700, display: "flex", gap: SPACE[2], alignItems: "center", fontSize: STEP.s1 }}>
                {state.teams[t].joined ? <><CheckCircle2 size={16} aria-hidden /> Joined</> : <><Clock size={16} aria-hidden /> Not joined yet</>}
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
