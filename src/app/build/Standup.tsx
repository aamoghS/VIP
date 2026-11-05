"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Send, Timer } from "lucide-react";
import { api } from "@/trpc/react";
import { Ticket } from "@/components/Ticket";
import { RichText } from "@/components/RichText";
import { ErrorLine, MONO, Panel, SPACE, STEP, SubmitRow, TextField, heading, hint, requiredText } from "./ui";
import type { PhaseProps } from "./phaseProps";

function Countdown() {
  const [left, setLeft] = useState(60);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const text = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return (
    <p style={{ display: "flex", gap: SPACE[2], alignItems: "center", flexWrap: "wrap", fontWeight: 700, margin: `0 0 ${SPACE[4]}` }}>
      <Timer size={22} aria-hidden />
      <span style={{ fontFamily: MONO, fontSize: STEP.s2, whiteSpace: "nowrap" }}>{text}</span>
      <span>{left === 0 ? "Time is up. Finish your note and pass the baton." : "left for the stand-up (a guide, it does not block you)"}</span>
    </p>
  );
}

export function Standup({ code, team, state, mission, refresh }: PhaseProps) {
  const [tearing, setTearing] = useState(false);
  const pass = api.room.passBaton.useMutation({
    onSuccess: () => {
      // Let the stub tear away before the room moves on to the next phase.
      setTearing(true);
      setTimeout(refresh, 300);
    },
  });
  const form = useForm({
    defaultValues: { note: "" },
    onSubmit: async ({ value }) => {
      await pass.mutateAsync({ code, note: value.note.trim() }).catch(() => undefined);
    },
  });

  if (team !== "A") {
    return (
      <Ticket tone="dashed" stub="A→B" as="section" aria-label="Baton on its way">
        <h2 style={heading}>Baton on its way from {state.teams.A.name || "Team A"}</h2>
        <p style={{ ...hint, color: "var(--ink)", fontSize: STEP.s0, marginTop: SPACE[2] }} role="status">
          {state.teams.A.name || "Team A"} finished their stories. When they pass the baton, your stories open and you will see their note here.
          {mission ? <> <RichText text={mission.handoffMessage} /></> : null}
        </p>
      </Ticket>
    );
  }

  return (
    <Ticket tone="accent" className="on-accent" tearing={tearing} as="section" stub={<>A→B<br /><span style={{ fontSize: STEP.s1, display: "block" }}>{code}</span></>} aria-label="Baton card">
      <h2 style={heading}>Stand-up and baton card</h2>
      {mission ? <p style={{ ...hint, color: "var(--ink)", fontSize: STEP.s0, marginTop: SPACE[3] }}><RichText text={mission.handoffMessage} /></p> : null}
      <p style={{ ...hint, fontSize: STEP.s0, margin: `${SPACE[2]} 0 ${SPACE[4]}` }}>Scrum Master: write the stand-up note for Team B. Say what we finished and what to watch for.</p>
      <Countdown />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        style={{ display: "grid", gap: SPACE[4] }}
      >
        <form.Field name="note" validators={{ onChange: requiredText("a note"), onBlur: requiredText("a note") }}>
          {(field) => <TextField field={field} id="baton-note" label="Baton note" multiline rows={5} maxLength={500} counter />}
        </form.Field>
        <form.Subscribe selector={(s) => s.values.note}>
          {(note) => {
            const missing = note.trim() ? [] : ["a note"];
            return (
              <SubmitRow disabled={missing.length > 0 || pass.isPending} missing={missing}>
                <Send size={18} aria-hidden /> {pass.isPending ? "Passing..." : "Pass baton"}
              </SubmitRow>
            );
          }}
        </form.Subscribe>
        <ErrorLine message={pass.error?.message} />
      </form>
    </Ticket>
  );
}
