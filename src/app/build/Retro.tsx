"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Ticket } from "@/components/Ticket";
import { useProgress } from "@/context/ProgressContext";
import { api } from "@/trpc/react";
import { CodeBlock, ErrorLine, Panel, SPACE, STEP, SubmitRow, TextField, cardTitle, heading, hint, requiredText } from "./ui";
import { PromptWithCode } from "@/components/RichText";
import type { PhaseProps } from "./phaseProps";

export function Retro({ code, team, me, mission, myReflection }: PhaseProps) {
  const { playerName } = useProgress();
  const submit = api.room.submitReflection.useMutation();
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const [sentAt, setSentAt] = useState("");
  const sentLabel = sentAt || (myReflection ? fmt(new Date(myReflection.createdAt)) : "");
  const form = useForm({
    defaultValues: { wentWell: "", improvement: "", exitAnswer: "" },
    onSubmit: async ({ value }) => {
      const ok = await submit
        .mutateAsync({ code, wentWell: value.wentWell.trim(), improvement: value.improvement.trim(), exitAnswer: value.exitAnswer.trim() })
        .catch(() => undefined);
      if (ok !== undefined) setSentAt(fmt(new Date()));
    },
  });

  if (submit.isSuccess || myReflection) {
    return (
      <Panel>
        <h2 style={heading}>
          <CheckCircle2 size={26} style={{ verticalAlign: "-3px" }} aria-hidden /> Thank you, {playerName}
        </h2>
        <p style={{ ...hint, fontSize: STEP.s0, marginTop: SPACE[2] }} role="status">Your answers went to your teacher.</p>
        <Ticket tone="plain" punched stub="EXIT" style={{ marginTop: SPACE[4] }}>
          <strong>Exit ticket handed in</strong>
          <p style={{ ...hint, color: "var(--ink)", margin: `${SPACE[1]} 0 0` }}>Sent {sentLabel}</p>
        </Ticket>
      </Panel>
    );
  }

  return (
    <Panel>
      <h2 style={heading}>Retrospective</h2>
      <p style={{ ...hint, fontSize: STEP.s0, margin: `${SPACE[3]} 0 ${SPACE[5]}` }}>
        Each person fills this in on their own. Submitting as {playerName} (Team {team}, Seat {me.seat}). Your teacher sees your name with your answers.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        style={{ display: "grid", gap: SPACE[5] }}
      >
        <form.Field name="wentWell">
          {(field) => <TextField field={field} id="went-well" label="What went well (optional)" multiline rows={2} maxLength={500} />}
        </form.Field>
        <form.Field name="improvement" validators={{ onChange: requiredText("one improvement"), onBlur: requiredText("one improvement") }}>
          {(field) => <TextField field={field} id="improve" label="One improvement for next sprint (required)" multiline rows={2} maxLength={500} />}
        </form.Field>

        <Ticket tone="accent" className="on-accent" stub="EXIT" as="section" aria-label="Exit ticket">
          <div style={{ display: "grid", gap: SPACE[3] }}>
            <h3 style={cardTitle}>Exit ticket</h3>
            {mission ? (
              <div>
                <div style={{ margin: 0, lineHeight: 1.6 }}><PromptWithCode text={mission.exitTicket.prompt} /></div>
                {mission.exitTicket.code ? <CodeBlock code={mission.exitTicket.code} /> : null}
              </div>
            ) : null}
            <form.Field name="exitAnswer" validators={{ onChange: requiredText("an answer"), onBlur: requiredText("an answer") }}>
              {(field) => <TextField field={field} id="exit-answer" label="Your answer in one sentence (required)" multiline rows={2} maxLength={500} />}
            </form.Field>
          </div>
        </Ticket>

        <form.Subscribe selector={(s) => s.values}>
          {(v) => {
            const missing = [!v.improvement.trim() && "one improvement", !v.exitAnswer.trim() && "exit ticket answer"].filter(Boolean) as string[];
            return (
              <SubmitRow disabled={missing.length > 0 || submit.isPending} missing={missing}>
                <Send size={18} aria-hidden /> {submit.isPending ? "Sending..." : "Send to teacher"}
              </SubmitRow>
            );
          }}
        </form.Subscribe>
        <ErrorLine message={submit.error?.message} />
      </form>
    </Panel>
  );
}
