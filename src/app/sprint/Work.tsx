"use client";

import { CheckCircle2, CircleDot, Lock, Users } from "lucide-react";
import { Panel, ProgressBar, heading, hint, Tag } from "./ui";
import type { PhaseProps } from "./phaseProps";
import { StoryCard } from "./StoryCard";
import type { StoryState } from "@/lib/sprint/types";

const STATUS: Record<StoryState["status"], { word: string; Icon: typeof Lock }> = {
  locked: { word: "Locked", Icon: Lock },
  doing: { word: "In progress", Icon: CircleDot },
  done: { word: "Done", Icon: CheckCircle2 },
};

export function Work({ code, team, state, mission, members, me, refresh }: PhaseProps) {
  if (!mission) return <Panel><p role="status">Waiting for the mission...</p></Panel>;
  const turn = state.phase === "teamA" ? "A" : "B";
  const mine = state.teams[team];
  const stories = mission.teams[team].stories;
  const myTurn = turn === team;
  const done = mine.stories.filter((s) => s.status === "done").length;
  const openIndex = mine.stories.findIndex((s) => s.status === "doing");
  const open = openIndex >= 0 ? stories[openIndex] : null;

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      {team === "B" && state.baton ? (
        <Panel style={{ background: "var(--ticket)", color: "var(--ink)" }}>
          <h2 style={{ ...heading, color: "var(--ink)" }}>Baton card from Team A ({state.teams.A.name})</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: "0.5rem 0 0" }}>{state.baton.note}</p>
        </Panel>
      ) : null}

      {!myTurn ? (
        <Panel>
          <h2 style={heading}>
            <Lock size={22} style={{ verticalAlign: "-3px" }} aria-hidden /> Locked: Team {turn} is working
          </h2>
          <p style={{ ...hint, fontSize: "1.05rem" }} role="status">
            {team === "A"
              ? `Team B (${state.teams.B.name || "no name yet"}) is working now.`
              : `Team A (${state.teams.A.name || "no name yet"}) is working first. Your stories unlock when Team A passes you the baton card with their stand-up note.`}
          </p>
        </Panel>
      ) : null}

      <Panel>
        <h2 style={heading}>{mission.title}: Team {team} stories</h2>
        <p style={hint}>
          <Users size={16} style={{ verticalAlign: "-2px" }} aria-hidden /> {mission.teams[team].role}. {mission.teams[team].challenge}
        </p>
        <ProgressBar done={done} total={stories.length} label={`Team ${team} progress`} />
        <ol style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "grid", gap: "0.5rem" }}>
          {stories.map((s, i) => {
            const st = mine.stories[i]?.status ?? "locked";
            const { word, Icon } = STATUS[st];
            return (
              <li
                key={s.index}
                className="story-row"
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                  padding: "0.6rem 0.9rem",
                  border: "3px solid var(--ink)",
                  background: st === "doing" ? "var(--ticket)" : "var(--bg-elevated)",
                  color: st === "doing" ? "var(--ink)" : "var(--text-primary)",
                }}
              >
                <span className="story-row-status" style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", fontWeight: 700, minWidth: "8.5rem" }}>
                  <Icon size={18} aria-hidden /> {word}
                </span>
                <span className="story-row-title" style={{ flex: 1 }}>Story {i + 1}: {s.title}</span>
                <Tag>{mine.estimates[i] ?? s.points} pts</Tag>
              </li>
            );
          })}
        </ol>
        {myTurn && done === stories.length ? (
          <p style={{ fontWeight: 700 }} role="status">All stories done. {team === "A" ? "Time for the stand-up and baton card." : "Moving to the Sprint Review."}</p>
        ) : null}
      </Panel>

      {myTurn && open ? (
        <StoryCard
          key={`${state.round}-${team}-${openIndex}`}
          code={code}
          team={team}
          story={open}
          storyState={mine.stories[openIndex]}
          total={stories.length}
          estimate={mine.estimates[openIndex]}
          members={members.filter((m) => m.team === team)}
          mySeat={me.seat}
          onChanged={refresh}
        />
      ) : null}
    </div>
  );
}
