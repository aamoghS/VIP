"use client";

import { CheckCircle2, CircleDot, Lock, Users } from "lucide-react";
import { Ticket } from "@/components/Ticket";
import { Badge, HAIRLINE, INK, MONO, Panel, ProgressBar, SPACE, STEP, TICKET, heading, hint, pts } from "./ui";
import type { PhaseProps } from "./phaseProps";
import { StoryCard } from "./StoryCard";
import { RichText } from "@/components/RichText";
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
    <div style={{ display: "grid", gap: SPACE[5] }}>
      {team === "B" && state.baton ? (
        <Ticket tone="plain" punched stub="A→B" as="section" aria-label="Baton card from Team A">
          <h2 style={heading}>Baton card from Team A ({state.teams.A.name})</h2>
          <p style={{ fontSize: STEP.s1up, lineHeight: 1.5, whiteSpace: "pre-wrap", margin: `${SPACE[3]} 0 0` }}><RichText text={state.baton.note} /></p>
          <p style={{ ...hint, color: INK, margin: `${SPACE[3]} 0 0` }}>
            Received <span style={{ fontFamily: MONO }}>{new Date(state.baton.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
          </p>
        </Ticket>
      ) : null}

      {!myTurn ? (
        <Panel>
          <h2 style={heading}>
            <Lock size={22} style={{ verticalAlign: "-3px" }} aria-hidden /> Locked: Team {turn} is working
          </h2>
          <p style={{ ...hint, fontSize: STEP.s0, marginTop: SPACE[2] }} role="status">
            {team === "A"
              ? `Team B (${state.teams.B.name || "no name yet"}) is working now.`
              : `Team A (${state.teams.A.name || "no name yet"}) is working first. Your stories open when Team A passes you the baton card with their stand-up note.`}
          </p>
        </Panel>
      ) : null}

      <Panel>
        <h2 style={heading}>{mission.title}: Team {team} stories</h2>
        <p style={{ ...hint, fontSize: STEP.s0, margin: `${SPACE[2]} 0 ${SPACE[4]}` }}>
          <Users size={16} style={{ verticalAlign: "-2px" }} aria-hidden /> {mission.teams[team].role}. <RichText text={mission.teams[team].challenge} />
        </p>
        <ProgressBar done={done} total={stories.length} label={`Team ${team} progress`} />
        <ol aria-label="Chip view of your stories" className="story-chips" style={{ listStyle: "none", padding: 0, margin: `${SPACE[4]} 0 0`, gap: SPACE[2], flexWrap: "wrap" }}>
          {stories.map((s, i) => {
            const st = mine.stories[i]?.status ?? "locked";
            const current = st === "doing" && myTurn;
            return (
              <li
                key={s.index}
                aria-current={current ? "step" : undefined}
                style={{
                  display: "inline-flex", alignItems: "center", gap: SPACE[1], minHeight: 32, padding: "2px 10px",
                  border: current ? `2px solid ${INK}` : HAIRLINE, background: current ? TICKET : "transparent", color: INK, fontSize: STEP.s1, fontWeight: current ? 700 : 400,
                }}
              >
                <span style={{ fontFamily: MONO }}>{i + 1}</span> {st === "done" ? "done" : st === "doing" ? "now" : "locked"}
              </li>
            );
          })}
        </ol>
        <ol className="story-list" style={{ listStyle: "none", padding: 0, margin: `${SPACE[4]} 0 0`, display: "grid", gap: SPACE[2] }}>
          {stories.map((s, i) => {
            const st = mine.stories[i]?.status ?? "locked";
            const { word, Icon } = STATUS[st];
            const current = st === "doing" && myTurn;
            return (
              <li
                key={s.index}
                className="story-row"
                aria-current={current ? "step" : undefined}
                style={{
                  display: "flex",
                  gap: SPACE[3],
                  alignItems: "center",
                  padding: `${SPACE[2]} ${SPACE[3]}`,
                  minHeight: 44,
                  border: current ? `2px solid ${INK}` : HAIRLINE,
                  background: current ? TICKET : "transparent",
                  color: INK,
                }}
              >
                <span className="story-row-status" style={{ display: "inline-flex", gap: SPACE[2], alignItems: "center", fontWeight: 700, minWidth: "8.5rem" }}>
                  <Icon size={18} aria-hidden /> {word}
                </span>
                <span className="story-row-title" style={{ flex: 1, minWidth: 0 }}>Story {i + 1}: {s.title}</span>
                <Badge mono>{pts(mine.estimates[i] ?? s.points)}</Badge>
              </li>
            );
          })}
        </ol>
        {myTurn && done === stories.length ? (
          <p style={{ fontWeight: 700, marginBottom: 0 }} role="status">All stories done. {team === "A" ? "Time for the stand-up and baton card." : "Moving to the sprint review."}</p>
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
