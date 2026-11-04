"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { Panel, heading, hint } from "./ui";
import type { PhaseProps } from "./phaseProps";

export function Lobby({ className, state, mission }: PhaseProps & { className: string }) {
  return (
    <Panel>
      <h2 style={heading}>Waiting for the sprint to start</h2>
      <p style={{ ...hint, fontSize: "1.05rem" }} role="status">
        <Clock size={16} style={{ verticalAlign: "-2px" }} aria-hidden /> Your teacher is picking the mission for {className}.
        {mission ? ` Mission chosen: ${mission.title}.` : ""} This page updates by itself.
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))" }}>
        {(["A", "B"] as const).map((t) => (
          <li key={t} style={{ border: "3px solid var(--ink)", padding: "0.75rem 1rem" }}>
            <strong>Team {t}</strong>
            <div>{state.teams[t].joined ? state.teams[t].name : "Nobody yet"}</div>
            <div style={{ fontWeight: 700, display: "flex", gap: "0.4rem", alignItems: "center" }}>
              {state.teams[t].joined ? <><CheckCircle2 size={16} aria-hidden /> Joined</> : <><Clock size={16} aria-hidden /> Not joined yet</>}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
