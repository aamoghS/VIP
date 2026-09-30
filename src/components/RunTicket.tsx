"use client";

import { useProgress } from "@/context/ProgressContext";

export default function RunTicket() {
  const { xp, currentLevel, levelProgress, questionsSolved, explanations, teamMissionsCompleted, playerName } = useProgress();
  const stamp =
    questionsSolved === 0 ? "Not started"
    : explanations.length === 0 ? "Say why"
    : teamMissionsCompleted === 0 ? "Ready to build"
    : "Check the score";
  const filled = Number.isFinite(levelProgress) ? levelProgress : 0;

  return (
    <section className="run-ticket" aria-label="Current run">
      <div>
        <div className="run-ticket-kicker">Critical thinking</div>
        <div className="run-ticket-title">{playerName ? `${playerName}'s run` : "Trace the change, then say why"}</div>
      </div>
      <div className="run-ticket-score hud">
        <span>LV {currentLevel}</span>
        <span>{xp} XP</span>
      </div>
      <div className="run-ticket-track" aria-hidden="true">
        <span style={{ width: `${filled}%` }} />
      </div>
      <div className="run-ticket-stamp">{stamp}</div>
    </section>
  );
}
