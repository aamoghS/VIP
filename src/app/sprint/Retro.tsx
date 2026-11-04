"use client";

import { useState } from "react";
import { CheckCircle2, Send, UserPlus } from "lucide-react";
import { api } from "@/trpc/react";
import { CodeBlock, Btn, ErrorLine, Panel, fieldStyle, heading, hint, labelStyle } from "./ui";
import type { PhaseProps } from "./phaseProps";

export function Retro({ code, team, mission }: PhaseProps) {
  const [seat, setSeat] = useState<number | null>(null);
  const [wentWell, setWentWell] = useState("");
  const [improvement, setImprovement] = useState("");
  const [exitAnswer, setExitAnswer] = useState("");
  const [sent, setSent] = useState<number | null>(null);
  const submit = api.room.submitReflection.useMutation({ onSuccess: (_d, v) => setSent(v.seat) });

  if (sent !== null) {
    return (
      <Panel>
        <h2 style={heading}>
          <CheckCircle2 size={26} style={{ verticalAlign: "-3px" }} aria-hidden /> Thank you, Seat {sent}
        </h2>
        <p style={hint} role="status">Your answers went to your teacher. Pass the device to the next seat if they have not gone yet.</p>
        <Btn
          onClick={() => {
            setSent(null);
            setSeat(null);
            setWentWell("");
            setImprovement("");
            setExitAnswer("");
            submit.reset();
          }}
        >
          <UserPlus size={18} aria-hidden /> Submit another seat
        </Btn>
      </Panel>
    );
  }

  const missing = [seat === null && "seat", !improvement.trim() && "one improvement", !exitAnswer.trim() && "exit ticket answer"].filter(Boolean) as string[];

  return (
    <Panel>
      <h2 style={heading}>Retrospective</h2>
      <p style={hint}>Each person fills this in on their own, one seat at a time. It goes to your teacher with your team and seat number, never your name.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (seat !== null && missing.length === 0) {
            submit.mutate({ code, team, seat, wentWell: wentWell.trim(), improvement: improvement.trim(), exitAnswer: exitAnswer.trim() });
          }
        }}
      >
        <fieldset style={{ border: "none", padding: 0, margin: "0 0 1rem" }}>
          <legend style={labelStyle}>Your seat</legend>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((n) => (
              <label
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1rem",
                  border: "3px solid var(--ink)",
                  background: seat === n ? "var(--ticket)" : "var(--bg-elevated)",
                  color: seat === n ? "var(--ink)" : "var(--text-primary)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <input type="radio" name="seat" value={n} checked={seat === n} onChange={() => setSeat(n)} />
                Seat {n}
              </label>
            ))}
          </div>
        </fieldset>

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
