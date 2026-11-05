"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

const MOVES = [
  { label: "Trace", text: "Run the code in your head before you touch it." },
  { label: "Change", text: "Ask what happens if one line is different." },
  { label: "Say why", text: "A guess is not an answer until you can explain it." },
];

export default function Home() {
  const { questionsSolved, explanations, teamMissionsCompleted } = useProgress();
  const next =
    questionsSolved === 0 ? { href: "/practice", label: "Try a question" }
    : explanations.length === 0 ? { href: "/practice", label: "Say why the answer works" }
    : teamMissionsCompleted === 0 ? { href: "/build", label: "Build a scenario" }
    : { href: "/score", label: "See what still fails" };

  return (
    <div className="page">
      <h1 className="page-title" style={{ maxWidth: "20ch" }}>
        Change one line. Then prove you know what happens.
      </h1>
      <p className="lede" style={{ marginBottom: "var(--space-6)" }}>
        Critical thinking here means tracing the code, testing a change, and saying why the result follows.
      </p>

      <section className="level-board" style={{ padding: "var(--space-5)", marginBottom: "var(--space-6)" }} aria-labelledby="steps-title">
        <h2 id="steps-title" className="meta" style={{ fontWeight: 700, marginBottom: "var(--space-3)", letterSpacing: 0 }}>
          Three steps for every question
        </h2>
        <ol style={{ listStyle: "none", display: "grid", margin: 0, padding: 0 }}>
          {MOVES.map((move, i) => (
            <li
              key={move.label}
              style={{
                display: "grid",
                gridTemplateColumns: "2rem 1fr",
                gap: "var(--space-3)",
                padding: "var(--space-3) 0",
                borderTop: i === 0 ? "none" : "1px solid rgba(26, 35, 50, 0.2)",
              }}
            >
              <span className="mono" style={{ fontWeight: 700 }}>{i + 1}</span>
              <span>
                <strong style={{ fontSize: "var(--step-1)" }}>{move.label}.</strong>{" "}
                <span style={{ color: "var(--ink-2)" }}>{move.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <Link href={next.href} className="btn btn-primary">
        {next.label} <ArrowRight size={18} aria-hidden="true" />
      </Link>

      <div style={{ marginTop: "var(--space-6)", display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <Link href="/build" className="btn">Join your class</Link>
        <Link href="/teach" className="btn">Run a class sprint</Link>
      </div>
    </div>
  );
}
