"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Clock, Save, ThumbsUp } from "lucide-react";
import { api } from "@/trpc/react";
import { Ticket } from "@/components/Ticket";
import { RichText } from "@/components/RichText";
import { POINT_SCALE } from "@/lib/sprint/state";
import { Badge, Btn, ErrorLine, INK, pts, OBJECTIVE_LABEL, Panel, SPACE, STEP, SubmitRow, TextField, cardTitle, heading, hint, labelStyle, MONO, requiredText } from "./ui";
import { other, type PhaseProps } from "./phaseProps";

export function Planning({ code, team, state, mission, refresh }: PhaseProps) {
  const mine = state.teams[team];
  const stories = mission?.teams[team].stories ?? [];
  const [saved, setSaved] = useState(false);
  const savePlan = api.room.savePlan.useMutation();
  const markPlanned = api.room.markPlanned.useMutation();
  const pending = savePlan.isPending || markPlanned.isPending;
  const error = savePlan.error?.message ?? markPlanned.error?.message;
  const otherTeam = state.teams[other(team)];

  const persist = async (value: { goal: string; estimates: number[] }) => {
    await savePlan.mutateAsync({ code, team, goal: value.goal, estimates: value.estimates });
    setSaved(true);
    refresh();
  };
  const form = useForm({
    defaultValues: { goal: mine.goal, estimates: mine.estimates as number[] },
    onSubmit: async ({ value }) => {
      try {
        await persist(value);
        await markPlanned.mutateAsync({ code, team });
        refresh();
      } catch {
        /* shown through mutation error state */
      }
    },
  });

  if (!mission) return <Panel><p role="status">Waiting for the mission...</p></Panel>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      style={{ display: "grid", gap: SPACE[5] }}
    >
      <Panel>
        <h2 style={heading}>Sprint planning: {mission.title}</h2>
        <p style={{ ...hint, fontSize: STEP.s0, margin: `${SPACE[3]} 0` }}>
          Read each story, then vote on how big it is with planning poker (1 is small, 8 is big). Write one sprint goal for your team.
          Team B plans now too, even though Team A works first.
        </p>
        <p style={{ margin: 0, fontWeight: 700, display: "flex", gap: SPACE[2], alignItems: "center" }} role="status">
          {otherTeam.planned ? <CheckCircle2 size={18} aria-hidden /> : <Clock size={18} aria-hidden />}
          Team {other(team)} ({otherTeam.name || "no name yet"}): {otherTeam.planned ? "Planned" : "Still planning"}
        </p>
      </Panel>

      <form.Field name="estimates">
        {(field) => (
          <>
            {stories.map((s, i) => (
              <Panel key={s.index}>
                <div style={{ display: "flex", gap: SPACE[2], flexWrap: "wrap", alignItems: "center", marginBottom: SPACE[2] }}>
                  <strong style={cardTitle}>Story {i + 1}: {s.title}</strong>
                  <Badge>Objective {s.objective}: {OBJECTIVE_LABEL[s.objective]}</Badge>
                  <Badge>Suggested <span style={{ fontFamily: MONO }}>{pts(s.points)}</span></Badge>
                </div>
                <p style={{ margin: `0 0 ${SPACE[3]}`, lineHeight: 1.6 }}><RichText text={s.userStory} /></p>
                <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                  <legend style={{ ...labelStyle, fontSize: STEP.s0 }}>Our estimate (story points)</legend>
                  <div className="poker">
                    {POINT_SCALE.map((p) => {
                      const on = field.state.value[i] === p;
                      return (
                        <Ticket
                          key={p}
                          as="button"
                          size="sm"
                          tone={on ? "accent" : "plain"}
                          className="est"
                          aria-pressed={on}
                          onClick={() => {
                            field.handleChange(field.state.value.map((v, j) => (j === i ? p : v)));
                            setSaved(false);
                          }}
                          style={{ minHeight: 48, justifyContent: "center", textAlign: "center", fontFamily: MONO, fontSize: "1.5rem", fontWeight: 700, boxShadow: on ? `4px 4px 0 ${INK}` : "none" }}
                        >
                          <span style={{ display: "block", textAlign: "center", width: "100%" }}>{p}</span>
                        </Ticket>
                      );
                    })}
                  </div>
                </fieldset>
              </Panel>
            ))}
          </>
        )}
      </form.Field>

      <Panel>
        <form.Field
          name="goal"
          listeners={{ onChange: () => setSaved(false) }}
          validators={{ onChange: requiredText("a sprint goal"), onBlur: requiredText("a sprint goal") }}
        >
          {(field) => (
            <TextField
              field={field}
              id="sprint-goal"
              label="Sprint goal (one sentence about what your team will get done)"
              multiline
              rows={3}
              maxLength={200}
              counter
            />
          )}
        </form.Field>
        <form.Subscribe selector={(s) => ({ goal: s.values.goal, values: s.values })}>
          {({ goal, values }) => {
            const missing = goal.trim() ? [] : ["a sprint goal"];
            return (
              <div style={{ marginTop: SPACE[4] }}>
                <SubmitRow
                  disabled={pending || missing.length > 0 || (mine.planned && saved)}
                  missing={missing}
                  extra={
                    <>
                      <Btn variant="secondary" onClick={() => void persist(values).catch(() => undefined)} disabled={pending || missing.length > 0}>
                        <Save size={18} aria-hidden /> Save plan
                      </Btn>
                      <span role="status" style={{ fontWeight: 700 }}>
                        {mine.planned ? "Your team is planned. Waiting for the teacher to start work." : saved ? "Plan saved." : ""}
                      </span>
                    </>
                  }
                >
                  <ThumbsUp size={18} aria-hidden /> We&apos;re planned
                </SubmitRow>
              </div>
            );
          }}
        </form.Subscribe>
        <ErrorLine message={error} />
      </Panel>
    </form>
  );
}
