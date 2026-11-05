"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { api } from "@/trpc/react";
import { useProgress } from "@/context/ProgressContext";
import { velocity } from "@/lib/sprint/state";
import { OBJECTIVE_LABEL } from "@/lib/sprint/objectives";
import { Badge, Btn, ErrorLine, INK2, MONO, Panel, SPACE, STEP, cardTitle, heading, hint } from "./ui";
import { RichText } from "@/components/RichText";
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

  const strugglingObjectives = [
    ...new Set(
      (["A", "B"] as const).flatMap((t) =>
        state.teams[t].stories.flatMap((s, i) => {
          const story = mission?.teams[t].stories[i];
          return story && s.status === "done" && s.correct === false ? [story.objective] : [];
        }),
      ),
    ),
  ]
    .sort()
    .map((o) => OBJECTIVE_LABEL[o]);
  const strongRound = doneAll > 0 && correctAll / doneAll >= 0.5;

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
    <div style={{ display: "grid", gap: SPACE[5] }}>
      <Panel>
        <h2 style={heading}>Sprint review</h2>
        <p style={{ margin: `${SPACE[3]} 0 0`, fontFamily: MONO, fontSize: "var(--step-4, 4rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {combined}<span style={{ fontFamily: "var(--font-body, inherit)", fontSize: STEP.s1up, marginLeft: 8 }}>{combined === 1 ? "point" : "points"}</span>
        </p>
        <p style={{ margin: `${SPACE[2]} 0 0`, fontWeight: 700 }}>Combined velocity: what Team A and Team B finished together.</p>
        {mission ? (
          <p style={{ margin: `${SPACE[2]} 0 0`, color: INK2 }}>
            {strongRound ? (
              <RichText text={mission.successMessage} />
            ) : (
              <>Rough round, and that is how teams learn. {strugglingObjectives.length ? `Revisit: ${strugglingObjectives.join(", ")}. ` : ""}Use the retro to plan what to try next sprint.</>
            )}
          </p>
        ) : null}
      </Panel>

      <div style={{ display: "grid", gap: SPACE[5], gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
        {teams.map((t) => (
          <Panel key={t.id}>
            <div style={{ display: "flex", gap: SPACE[2], alignItems: "center", flexWrap: "wrap" }}>
              <h3 style={cardTitle}>Team {t.id}: {t.ts.name || "no name"}</h3>
              {t.id === team ? <Badge>You</Badge> : null}
            </div>
            <p style={{ margin: `${SPACE[3]} 0 0` }}><strong>Sprint goal:</strong> {t.ts.goal || "No goal written."}</p>
            <p style={{ margin: `${SPACE[1]} 0 0` }}><strong>Stories done:</strong> <span style={{ fontFamily: MONO }}>{t.done}</span> of <span style={{ fontFamily: MONO }}>{t.ts.stories.length}</span></p>
            <p style={{ margin: `${SPACE[1]} 0 0` }}><strong>Velocity:</strong> <span style={{ fontFamily: MONO }}>{t.velocity}</span> {t.velocity === 1 ? "point" : "points"}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <p style={{ margin: 0, fontSize: STEP.s1up }}>
          <strong>Accuracy:</strong> <span style={{ fontFamily: MONO }}>{correctAll}</span> of <span style={{ fontFamily: MONO }}>{doneAll}</span> stories answered correctly ({doneAll ? Math.round((correctAll / doneAll) * 100) : 0}%).
          {doneAll < totalAll ? ` ${totalAll - doneAll} stories are still open.` : ""}
        </p>
        <p style={{ ...hint, fontSize: STEP.s0, margin: `${SPACE[3]} 0 ${SPACE[4]}` }}>Next: the retrospective. Each person shares what went well and one thing to improve.</p>
        <Btn onClick={() => goRetro.mutate({ code })} disabled={goRetro.isPending}>
          <ArrowRight size={18} aria-hidden /> {goRetro.isPending ? "Moving on..." : "Go to retro"}
        </Btn>
        <ErrorLine message={goRetro.error?.message} />
      </Panel>
    </div>
  );
}
