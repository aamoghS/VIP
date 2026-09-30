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
    questionsSolved === 0 ? { href: "/toolbox", label: "Try a question" }
    : explanations.length === 0 ? { href: "/toolbox", label: "Say why the answer works" }
    : teamMissionsCompleted === 0 ? { href: "/sprint", label: "Build a scenario" }
    : { href: "/metrics", label: "See what still fails" };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.05, marginBottom: "0.75rem" }}>
        Change one line. Then prove you know what happens.
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "38rem", marginBottom: "1.5rem" }}>
        Critical thinking here means tracing the code, testing a change, and saying why the result follows.
      </p>

      <section className="level-board" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <dl style={{ display: "grid", gap: "0.85rem", margin: 0 }}>
          {MOVES.map((move) => (
            <div key={move.label}>
              <dt style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>{move.label}</dt>
              <dd style={{ margin: "0.2rem 0 0", color: "var(--text-primary)", lineHeight: 1.5 }}>{move.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Link href={next.href} className="play-btn">
        {next.label} <ArrowRight size={18} />
      </Link>
    </div>
  );
}
