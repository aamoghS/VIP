"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Save, ThumbsUp } from "lucide-react";
import { api } from "@/trpc/react";
import { POINT_SCALE } from "@/lib/sprint/state";
import { Btn, ErrorLine, OBJECTIVE_LABEL, Panel, Tag, fieldStyle, heading, hint, labelStyle } from "./ui";
import { other, type PhaseProps } from "./phaseProps";

export function Planning({ code, team, state, mission, refresh }: PhaseProps) {
  const mine = state.teams[team];
  const stories = mission?.teams[team].stories ?? [];
  const [goal, setGoal] = useState(mine.goal);
  const [estimates, setEstimates] = useState<number[]>(mine.estimates);
  const [saved, setSaved] = useState(false);
  const savePlan = api.room.savePlan.useMutation();
  const markPlanned = api.room.markPlanned.useMutation();
  const pending = savePlan.isPending || markPlanned.isPending;
  const error = savePlan.error?.message ?? markPlanned.error?.message;
  const otherTeam = state.teams[other(team)];

  if (!mission) return <Panel><p role="status">Waiting for the mission...</p></Panel>;

  const persist = async () => {
    await savePlan.mutateAsync({ code, team, goal, estimates });
    setSaved(true);
    refresh();
  };
  const finish = async () => {
    try {
      await persist();
      await markPlanned.mutateAsync({ code, team });
      refresh();
    } catch {
      /* shown through mutation error state */
    }
  };

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <Panel>
        <h2 style={heading}>Sprint planning: {mission.title}</h2>
        <p style={hint}>
          Read each story, then vote on how big it is with planning poker (1 is small, 8 is big). Write one sprint goal for your team.
          Team B plans now too, even though Team A works first.
        </p>
        <p style={{ margin: 0, fontWeight: 700, display: "flex", gap: "0.4rem", alignItems: "center" }} role="status">
          {otherTeam.planned ? <CheckCircle2 size={18} aria-hidden /> : <Clock size={18} aria-hidden />}
          Team {other(team)} ({otherTeam.name || "no name yet"}): {otherTeam.planned ? "Planned" : "Still planning"}
        </p>
      </Panel>

      {stories.map((s, i) => (
        <Panel key={s.index}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.5rem" }}>
            <strong style={{ fontSize: "1.1rem" }}>Story {i + 1}: {s.title}</strong>
            <Tag>Objective {s.objective}: {OBJECTIVE_LABEL[s.objective]}</Tag>
            <Tag>Suggested {s.points} pts</Tag>
          </div>
          <p style={{ margin: "0 0 0.75rem", lineHeight: 1.6 }}>{s.userStory}</p>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ ...labelStyle, fontSize: "0.95rem" }}>Our estimate (story points)</legend>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {POINT_SCALE.map((p) => {
                const on = estimates[i] === p;
                return (
                  <Btn
                    key={p}
                    pressed={on}
                    variant={on ? "solid" : "ghost"}
                    onClick={() => {
                      setEstimates((prev) => prev.map((v, j) => (j === i ? p : v)));
                      setSaved(false);
                    }}
                    style={{ minWidth: "3.25rem" }}
                  >
                    {on ? <CheckCircle2 size={16} aria-hidden /> : null}
                    {p}
                  </Btn>
                );
              })}
            </div>
          </fieldset>
        </Panel>
      ))}

      <Panel>
        <label htmlFor="sprint-goal" style={labelStyle}>Sprint goal (one sentence about what your team will get done)</label>
        <textarea
          id="sprint-goal"
          rows={3}
          maxLength={200}
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setSaved(false);
          }}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
        <p style={{ ...hint, margin: "0.25rem 0 0.75rem" }}>{goal.length} of 200 characters</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Btn variant="ghost" onClick={() => void persist().catch(() => undefined)} disabled={pending || !goal.trim()}>
            <Save size={18} aria-hidden /> Save plan
          </Btn>
          <Btn onClick={() => void finish()} disabled={pending || !goal.trim() || (mine.planned && saved)}>
            <ThumbsUp size={18} aria-hidden /> We&apos;re planned
          </Btn>
          <span role="status" style={{ fontWeight: 700 }}>
            {mine.planned ? "Your team is planned. Waiting for the teacher to start work." : saved ? "Plan saved." : !goal.trim() ? "Missing: a sprint goal." : ""}
          </span>
        </div>
        <ErrorLine message={error} />
      </Panel>
    </div>
  );
}
