"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { api } from "@/trpc/react";
import type { TeamId } from "@/lib/sprint/types";
import { SignedInAs } from "@/components/SignInGate";
import { Btn, ErrorLine, HUD, Panel, fieldStyle, hint, labelStyle } from "./ui";

export function JoinForm({ initialCode, onJoined }: { initialCode: string; onJoined: (code: string) => void }) {
  const [code, setCode] = useState(initialCode.toUpperCase().slice(0, 6));
  const [team, setTeam] = useState<TeamId>("A");
  const [name, setName] = useState("");
  const join = api.room.join.useMutation({
    onSuccess: (_d, v) => onJoined(v.code),
  });
  const room = api.room.get.useQuery({ code }, { enabled: code.length === 6, retry: false });
  const needsName = !room.data?.state.teams[team].name;
  const ready = code.trim().length === 6 && (!needsName || name.trim().length > 0);
  const whyNot = code.trim().length !== 6 ? "Code needs 6 characters" : needsName && name.trim().length === 0 ? "Enter a group name" : "";

  return (
    <Panel style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1 style={{ fontFamily: HUD, fontSize: "2.4rem", fontWeight: 400, margin: "0 0 0.25rem" }}>Join your class sprint</h1>
      <p style={{ ...hint, marginTop: 0 }}>Get the room code from your teacher.</p>
      <div style={{ marginBottom: "1rem" }}><SignedInAs /></div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) join.mutate({ code: code.trim().toUpperCase(), team, name: needsName ? name.trim() : undefined });
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
        {room.data && !needsName ? (
          <p style={{ ...hint, margin: "0 0 1.25rem" }}>Team {team} is called {room.data.state.teams[team].name}.</p>
        ) : (
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
            <p id="group-name-hint" style={{ ...hint, margin: "0.35rem 0 0" }}>Pick a name for your team. Your teacher sees your account name next to your answers.</p>
          </div>
        )}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Btn type="submit" disabled={!ready || join.isPending}>
            <LogIn size={18} aria-hidden /> {join.isPending ? "Joining..." : "Join room"}
          </Btn>
          {whyNot ? <span style={{ fontWeight: 700 }} role="status">{whyNot}</span> : null}
        </div>
        <ErrorLine message={join.error?.message ?? (code.length === 6 ? room.error?.message : undefined)} />
      </form>
    </Panel>
  );
}
