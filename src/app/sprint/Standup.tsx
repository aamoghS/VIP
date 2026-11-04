"use client";

import { useEffect, useState } from "react";
import { Send, Timer } from "lucide-react";
import { api } from "@/trpc/react";
import { Btn, ErrorLine, MONO, Panel, fieldStyle, heading, hint, labelStyle } from "./ui";
import type { PhaseProps } from "./phaseProps";

function Countdown() {
  const [left, setLeft] = useState(60);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const text = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return (
    <p style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 800, margin: "0 0 1rem" }}>
      <Timer size={22} aria-hidden />
      <span style={{ fontFamily: MONO, fontSize: "1.6rem" }}>{text}</span>
      <span>{left === 0 ? "Time is up. Finish your note and pass the baton." : "left for the stand-up (a guide, it does not block you)"}</span>
    </p>
  );
}

export function Standup({ code, team, state, mission, refresh }: PhaseProps) {
  const [note, setNote] = useState("");
  const pass = api.room.passBaton.useMutation({ onSuccess: refresh });

  if (team !== "A") {
    return (
      <Panel>
        <h2 style={heading}>Team A is writing the baton card</h2>
        <p style={{ ...hint, fontSize: "1.05rem" }} role="status">
          {state.teams.A.name || "Team A"} finished their stories. When they pass the baton, your stories unlock and you will see their note here.
          {mission ? ` ${mission.handoffMessage}` : ""}
        </p>
      </Panel>
    );
  }

  const ok = note.trim().length > 0;
  return (
    <Panel>
      <h2 style={heading}>Stand-up and baton card</h2>
      {mission ? <p style={hint}>{mission.handoffMessage}</p> : null}
      <p style={hint}>Scrum Master: write the stand-up note for Team B. Say what we finished and what to watch for.</p>
      <Countdown />
      <label htmlFor="baton-note" style={labelStyle}>Baton note</label>
      <textarea
        id="baton-note"
        rows={5}
        maxLength={500}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ ...fieldStyle, resize: "vertical" }}
      />
      <p style={{ ...hint, margin: "0.25rem 0 0.75rem" }}>{note.length} of 500 characters{ok ? "" : ". Missing: a note."}</p>
      <Btn onClick={() => pass.mutate({ code, note: note.trim() })} disabled={!ok || pass.isPending}>
        <Send size={18} aria-hidden /> {pass.isPending ? "Passing..." : "Pass baton"}
      </Btn>
      <ErrorLine message={pass.error?.message} />
    </Panel>
  );
}
