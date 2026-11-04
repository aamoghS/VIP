"use client";

import { useEffect } from "react";
import { ArrowRight, PartyPopper } from "lucide-react";
import { api } from "@/trpc/react";
import { useProgress } from "@/context/ProgressContext";
import { velocity } from "@/lib/sprint/state";
import { Btn, ErrorLine, HUD, Panel, heading, hint } from "./ui";
import type { PhaseProps } from "./phaseProps";

export function Review({ code, team, state, mission, refresh }: PhaseProps) {
  const { addXp, incrementTeamMissions } = useProgress();
  const goRetro = api.room.goToRetro.useMutation({ onSuccess: refresh });

  const teams = (["A", "B"] as const).map((t) => {
    const ts = state.teams[t];
    const done = ts.stories.filter((s) => s.status === "done");
    return { id: t, ts, done: done.length, correct: done.filter((s) => s.correct).length, velocity: velocity(ts) };
  });
  const combined = teams.reduce((n, t) => n + t.velocity, 0);
  const doneAll = teams.reduce((n, t) => n + t.done, 0);
  const correctAll = teams.reduce((n, t) => n + t.correct, 0);
  const totalAll = teams.reduce((n, t) => n + t.ts.stories.length, 0);

  // Award class XP once per room and round on this device.
  useEffect(() => {
    const key = `sprint-xp-${code}-${state.round}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      /* storage unavailable: award anyway */
    }
    addXp(combined * 10);
    incrementTeamMissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <Panel style={{ textAlign: "center", background: "var(--ticket)", color: "var(--ink)" }}>
        <h2 style={{ ...heading, color: "var(--ink)" }}>
          <PartyPopper size={26} style={{ verticalAlign: "-3px" }} aria-hidden /> Sprint Review: great work, class
        </h2>
        <p style={{ margin: "0.5rem 0 0", fontFamily: HUD, fontSize: "4rem", lineHeight: 1 }}>{combined} points</p>
        <p style={{ margin: "0.25rem 0 0", fontWeight: 700 }}>Combined velocity: what Team A and Team B finished together.</p>
        {mission ? <p style={{ margin: "0.5rem 0 0" }}>{mission.successMessage}</p> : null}
      </Panel>

      <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
        {teams.map((t) => (
          <Panel key={t.id}>
            <h3 style={{ ...heading, fontSize: "1.6rem" }}>Team {t.id}: {t.ts.name || "no name"}{t.id === team ? " (you)" : ""}</h3>
            <p style={{ margin: "0.5rem 0" }}><strong>Sprint goal:</strong> {t.ts.goal || "No goal written."}</p>
            <p style={{ margin: "0.25rem 0" }}><strong>Stories done:</strong> {t.done} of {t.ts.stories.length}</p>
            <p style={{ margin: "0.25rem 0" }}><strong>Velocity:</strong> {t.velocity} points</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <p style={{ margin: 0, fontSize: "1.1rem" }}>
          <strong>Accuracy:</strong> {correctAll} of {doneAll} stories answered correctly ({doneAll ? Math.round((correctAll / doneAll) * 100) : 0}%).
          {doneAll < totalAll ? ` ${totalAll - doneAll} stories are still open.` : ""}
        </p>
        <p style={hint}>Next: the retrospective. Each person shares what went well and one thing to improve.</p>
        <Btn onClick={() => goRetro.mutate({ code })} disabled={goRetro.isPending}>
          <ArrowRight size={18} aria-hidden /> {goRetro.isPending ? "Moving on..." : "Go to retro"}
        </Btn>
        <ErrorLine message={goRetro.error?.message} />
      </Panel>
    </div>
  );
}
