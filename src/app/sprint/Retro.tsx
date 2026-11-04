"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { api } from "@/trpc/react";
import { CodeBlock, Btn, ErrorLine, Panel, fieldStyle, heading, hint, labelStyle } from "./ui";
import type { PhaseProps } from "./phaseProps";

export function Retro({ code, team, me, mission }: PhaseProps) {
  const { playerName } = useProgress();
  const [wentWell, setWentWell] = useState("");
  const [improvement, setImprovement] = useState("");
  const [exitAnswer, setExitAnswer] = useState("");
  const submit = api.room.submitReflection.useMutation();

  if (submit.isSuccess) {
    return (
      <Panel>
        <h2 style={heading}>
          <CheckCircle2 size={26} style={{ verticalAlign: "-3px" }} aria-hidden /> Thank you, {playerName}
        </h2>
        <p style={hint} role="status">Your answers went to your teacher.</p>
      </Panel>
    );
  }

  const missing = [!improvement.trim() && "one improvement", !exitAnswer.trim() && "exit ticket answer"].filter(Boolean) as string[];

  return (
    <Panel>
      <h2 style={heading}>Retrospective</h2>
      <p style={hint}>Each person fills this in on their own. Submitting as {playerName} (Team {team}, Seat {me.seat}). Your teacher sees your name with your answers.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (missing.length === 0) {
            submit.mutate({ code, wentWell: wentWell.trim(), improvement: improvement.trim(), exitAnswer: exitAnswer.trim() });
          }
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="went-well" style={labelStyle}>What went well (optional)</label>
          <textarea id="went-well" rows={2} maxLength={500} value={wentWell} onChange={(e) => setWentWell(e.target.value)} style={{ ...fieldStyle, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="improve" style={labelStyle}>One improvement for next sprint (required)</label>
          <textarea id="improve" rows={2} maxLength={500} value={improvement} onChange={(e) => setImprovement(e.target.value)} style={{ ...fieldStyle, resize: "vertical" }} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ ...labelStyle, fontSize: "1.1rem" }}>Exit ticket</h3>
          {mission ? (
            <>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{mission.exitTicket.prompt}</p>
              {mission.exitTicket.code ? <CodeBlock code={mission.exitTicket.code} /> : null}
            </>
          ) : null}
          <label htmlFor="exit-answer" style={labelStyle}>Your answer in one sentence (required)</label>
          <textarea id="exit-answer" rows={2} maxLength={500} value={exitAnswer} onChange={(e) => setExitAnswer(e.target.value)} style={{ ...fieldStyle, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Btn type="submit" disabled={missing.length > 0 || submit.isPending}>
            <Send size={18} aria-hidden /> {submit.isPending ? "Sending..." : "Send to teacher"}
          </Btn>
          {missing.length > 0 ? <span style={{ fontWeight: 700 }}>Missing: {missing.join(", ")}</span> : null}
        </div>
        <ErrorLine message={submit.error?.message} />
      </form>
    </Panel>
  );
}
