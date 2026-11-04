"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { api } from "@/trpc/react";
import type { TeamId } from "@/lib/sprint/types";
import { Btn, ErrorLine, HUD, Panel, fieldStyle, hint, labelStyle } from "./ui";

export function JoinForm({ initialCode, onJoined }: { initialCode: string; onJoined: (s: { code: string; team: TeamId }) => void }) {
  const [code, setCode] = useState(initialCode.toUpperCase().slice(0, 6));
  const [team, setTeam] = useState<TeamId>("A");
  const [name, setName] = useState("");
  const join = api.room.join.useMutation({
    onSuccess: (_d, v) => onJoined({ code: v.code, team: v.team }),
  });
  const ready = code.trim().length === 6 && name.trim().length > 0;

  return (
    <Panel style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1 style={{ fontFamily: HUD, fontSize: "2.4rem", fontWeight: 400, margin: "0 0 0.25rem" }}>Join your class sprint</h1>
      <p style={{ ...hint, marginTop: 0 }}>Get the room code from your teacher.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) join.mutate({ code: code.trim().toUpperCase(), team, name: name.trim() });
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="room-code" style={labelStyle}>Room code (6 characters)</label>
          <input
            id="room-code"
            type="text"
            value={code}
            maxLength={6}
            autoComplete="off"
            autoCapitalize="characters"
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{ ...fieldStyle, fontFamily: HUD, fontSize: "2rem", letterSpacing: "0.3em" }}
          />
        </div>
        <fieldset style={{ border: "none", padding: 0, margin: "0 0 1rem" }}>
          <legend style={labelStyle}>Your team</legend>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {(["A", "B"] as const).map((t) => (
              <label
                key={t}
                style={{
                  flex: "1 1 8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  border: "3px solid var(--ink)",
                  background: team === t ? "var(--ticket)" : "var(--bg-elevated)",
                  color: team === t ? "var(--ink)" : "var(--text-primary)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <input type="radio" name="team" value={t} checked={team === t} onChange={() => setTeam(t)} />
                Team {t}
              </label>
            ))}
          </div>
        </fieldset>
        <div style={{ marginBottom: "1.25rem" }}>
          <label htmlFor="group-name" style={labelStyle}>Group name</label>
          <input
            id="group-name"
            type="text"
            value={name}
            maxLength={30}
            autoComplete="off"
            aria-describedby="group-name-hint"
            onChange={(e) => setName(e.target.value)}
            style={fieldStyle}
          />
          <p id="group-name-hint" style={{ ...hint, margin: "0.35rem 0 0" }}>Group name only, no real names.</p>
        </div>
        <Btn type="submit" disabled={!ready || join.isPending}>
          <LogIn size={18} aria-hidden /> {join.isPending ? "Joining..." : "Join room"}
        </Btn>
        <ErrorLine message={join.error?.message} />
      </form>
    </Panel>
  );
}
