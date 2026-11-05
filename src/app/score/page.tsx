"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { Code2, GitBranch, Repeat2, Braces, Bug, Map } from "lucide-react";
import s from "./score.module.css";

const TOPICS = [
  { key: "variables", label: "Variables", Icon: Code2 },
  { key: "logic", label: "If / else", Icon: GitBranch },
  { key: "loops", label: "Loops", Icon: Repeat2 },
  { key: "functions", label: "Functions", Icon: Braces },
  { key: "debugging", label: "Debugging", Icon: Bug },
  { key: "algorithms", label: "Algorithms", Icon: Map },
];

export default function ScorePage() {
  const { xp, questionsSolved, teamMissionsCompleted, topicStats, resetProgress } = useProgress();
  const [confirming, setConfirming] = useState(false);

  const totalAttempted = Object.values(topicStats).reduce((n, t) => n + t.attempted, 0);
  const totalCorrect = Object.values(topicStats).reduce((n, t) => n + t.correct, 0);
  const overallPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const rows = TOPICS.map(t => {
    const st = topicStats[t.key] ?? { attempted: 0, correct: 0 };
    return { ...t, ...st, pct: st.attempted > 0 ? Math.round((st.correct / st.attempted) * 100) : null };
  }).sort((a, b) => {
    // weakest first, untried topics last
    if (a.pct === null && b.pct === null) return 0;
    if (a.pct === null) return 1;
    if (b.pct === null) return -1;
    return a.pct - b.pct;
  });

  return (
    <div className="page">
      <h1 className="page-title">Score</h1>
      <p className={s.sub}>What still fails, saved on this device.</p>

      {totalAttempted === 0 ? (
        <div className={s.empty}>
          <p style={{ margin: 0 }}>{xp > 0 ? "No practice answers yet. Your XP so far comes from class sprints." : "No answers yet. Your weakest topics show up here once you practise."}</p>
          <Link href="/practice" className="btn btn-primary">Practice a question</Link>
        </div>
      ) : (
        <>
          <div className={s.hero}>
            <span className={s.big}>{overallPct}%</span>
            <span className={s.cap}>overall accuracy, <span className="mono">{totalCorrect}</span> of <span className="mono">{totalAttempted}</span> correct</span>
          </div>
          <p className={s.summary}>
            <b>{questionsSolved}</b> {questionsSolved === 1 ? "question" : "questions"} solved, <b>{teamMissionsCompleted}</b> {teamMissionsCompleted === 1 ? "sprint" : "sprints"} completed.
          </p>

          <h2 className={s.h2}>Weakest first</h2>
          <ul className={s.rows}>
            {rows.map(({ key, label, Icon, attempted, correct, pct }) => (
              <li key={key} className={s.row}>
                <span className={s.name}><Icon size={20} aria-hidden />{label}</span>
                <span className={s.bar} aria-hidden>
                  <span className={s.fill} style={{ width: `${pct ?? 0}%` }} />
                </span>
                <span>
                  <span className={pct !== null ? s.pct : s.none}>{pct !== null ? `${pct}%` : "No answers yet"}</span>
                  {attempted > 0 && <span className={s.counts}><span className="mono">{correct}/{attempted}</span> correct</span>}
                </span>
                <Link className={s.go} href={`/practice?topic=${key}`}>Practice</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className={s.reset}>
        {confirming ? (
          <>
            <span>Erase all progress on this device?</span>
            <button className="btn" onClick={() => { resetProgress(); setConfirming(false); }}>Yes, reset</button>
            <button className="btn" onClick={() => setConfirming(false)}>Cancel</button>
          </>
        ) : (
          <button className="btn" onClick={() => setConfirming(true)}>Reset progress</button>
        )}
      </div>
    </div>
  );
}
