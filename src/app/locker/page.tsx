"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { Check, Code2, GitBranch, Repeat2, Braces, Bug, Map } from "lucide-react";
import { Ticket } from "@/components/Ticket";
import s from "./locker.module.css";

const TOPICS = [
  { id: "variables", label: "Variables", Icon: Code2, how: "Answer variables questions correctly." },
  { id: "logic", label: "If / else", Icon: GitBranch, how: "Answer if/else questions correctly." },
  { id: "loops", label: "Loops", Icon: Repeat2, how: "Answer loops questions correctly." },
  { id: "functions", label: "Functions", Icon: Braces, how: "Answer functions questions correctly." },
  { id: "debugging", label: "Debugging", Icon: Bug, how: "Find and fix errors in practice questions." },
  { id: "algorithms", label: "Algorithms", Icon: Map, how: "Solve step-by-step problems in practice." },
];

export default function LockerPage() {
  const { unlockedItems, questionsSolved, teamMissionsCompleted, topicStats, currentLevel } = useProgress();

  const earnedCount = TOPICS.filter(t => unlockedItems.some(i => i.id === t.id)).length;
  const pctOf = (id: string) => {
    const st = topicStats[id];
    return st && st.attempted > 0 ? Math.round((st.correct / st.attempted) * 100) : 0;
  };
  const weak = TOPICS.find(t => {
    const st = topicStats[t.id];
    return !st || st.attempted === 0 || st.correct / st.attempted < 0.6;
  });

  const milestones = [
    { name: "Solve a first question", done: questionsSolved >= 1 },
    { name: "Solve 10 questions", done: questionsSolved >= 10 },
    { name: "Complete a sprint", done: teamMissionsCompleted >= 1 },
    { name: "Earn 5 trophies", done: earnedCount >= 5 },
    { name: "Reach level 10", done: currentLevel >= 10 },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Locker</h1>
      <p className={s.sub}>
        <span className="mono">{earnedCount}</span> of <span className="mono">{TOPICS.length}</span> trophies earned. <span className="mono">{questionsSolved}</span> {questionsSolved === 1 ? "question" : "questions"} solved.
      </p>
      {weak && (
        <p className={s.nudge}>
          {weak.label} needs the most work. <Link href={`/practice?topic=${weak.id}`}>Practice {weak.label.toLowerCase()}</Link>
        </p>
      )}

      <section className={s.section} aria-labelledby="wall">
        <h2 id="wall" className={s.h2}>Trophy wall</h2>
        <ul className={s.wall}>
          {TOPICS.map(({ id, label, Icon, how }) => {
            const earned = unlockedItems.some(i => i.id === id);
            return (
              <li key={id} className={s.trophy}>
                <Ticket
                  tone={earned ? "plain" : "dashed"}
                  punched={earned}
                  stub={<Icon size={32} strokeWidth={2} aria-hidden />}
                  className={s.ticket}
                >
                  <div className={s.head}>
                    <span>{label}</span>
                    {!earned && <span className={s.state}>Not yet</span>}
                  </div>
                  <p className={s.how}>{how}</p>
                  {earned && (
                    <p className={s.earnedLine}>
                      Earned · <span className="mono">{topicStats[id]?.correct ?? 0}</span> of <span className="mono">{topicStats[id]?.attempted ?? 0}</span> correct
                    </p>
                  )}
                  <Link className={s.go} href={`/practice?topic=${id}`}>Practice {label.toLowerCase()}</Link>
                </Ticket>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="skills">
        <h2 id="skills" className={s.h2}>Skills</h2>
        <ul className={s.rows}>
          {TOPICS.map(({ id, label, Icon }) => {
            const p = pctOf(id);
            return (
              <li key={id} className={s.row}>
                <span className={s.name}><Icon size={20} aria-hidden />{label}</span>
                <span className={s.bar} aria-hidden><span className={s.fill} style={{ width: `${p}%` }} /></span>
                <span className={s.num}>{p}%</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="miles">
        <h2 id="miles" className={s.h2}>Milestones</h2>
        <ul className={s.rows}>
          {milestones.map(m => (
            <li key={m.name} className={s.row}>
              <span className={s.mile}>{m.name}</span>
              <span className={`${s.mark} ${m.done ? "" : s.todo}`}>
                <span className={`${s.box} ${m.done ? s.boxDone : ""}`} aria-hidden>{m.done ? <Check size={16} strokeWidth={3} /> : null}</span>
                {m.done ? "Done" : "Not yet"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
