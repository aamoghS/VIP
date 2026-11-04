"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Printer, ArrowRight } from "lucide-react";
import { MISSIONS } from "@/app/sprint/missions";
import { getMission, teamOf } from "@/lib/sprint/mission";
import { ROLES, ROLE_DUTIES } from "@/lib/sprint/roles";
import { traceLayout } from "@/lib/sprint/trace";
import type { TeamId } from "@/lib/sprint/types";

const OBJECTIVE_LABEL: Record<number, string> = {
  1: "Trace a loop + if",
  2: "Fix boundary errors",
  3: "Explain why",
  4: "Agile teamwork",
};

const TEAMS: TeamId[] = ["A", "B"];
const writeLine = { borderBottom: "2px solid #000", height: "2.25rem" } as const;

function Picker() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: "var(--font-hud), monospace", fontWeight: 400, fontSize: "2.5rem", margin: "0 0 0.5rem" }}>Printables</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>Pick a mission to print its story cards, role cards, trace mats and baton card.</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
        {MISSIONS.map((m) => (
          <li key={m.id}>
            <Link
              href={`/print?mission=${m.id}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                padding: "1rem 1.25rem", border: "3px solid var(--ink)", background: "var(--bg-elevated)",
                boxShadow: "4px 4px 0 var(--ticket)", color: "var(--ink)", textDecoration: "none", fontSize: "1.1rem",
              }}
            >
              <span><strong>{m.title}</strong> ({m.topic})</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
                Open printables <ArrowRight size={18} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Sheets({ id }: { id: string }) {
  const mission = getMission(id);
  if (!mission) {
    return (
      <div>
        <p role="alert" style={{ fontSize: "1.1rem" }}>No mission with id &quot;{id}&quot;.</p>
        <Picker />
      </div>
    );
  }

  const stories = TEAMS.flatMap((team) =>
    teamOf(mission, team).questions.map((q, i) => ({ team, q, i })),
  );
  const codeStories = stories.filter((s) => s.q.code);

  return (
    <div className="print-sheet" style={{ fontSize: "1.1rem", lineHeight: 1.4 }}>
      <div className="no-print" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.2rem", fontSize: "1.1rem",
            fontWeight: 700, background: "var(--ink)", color: "#fff", border: "3px solid var(--ink)", cursor: "pointer",
          }}
        >
          <Printer size={20} aria-hidden="true" /> Print
        </button>
        <Link href="/print" style={{ color: "var(--ink)", fontWeight: 700 }}>All missions</Link>
        <span>Tip: print on cardstock, then cut along the card borders.</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-hud), monospace", fontWeight: 400, fontSize: "2.5rem", margin: "0 0 1rem" }}>
        {mission.title} ({mission.topic})
      </h1>

      <section className="print-section" aria-labelledby="p-stories">
        <h2 id="p-stories" style={{ fontSize: "1.6rem", margin: "0 0 0.75rem" }}>Story cards</h2>
        <div className="print-grid">
          {stories.map(({ team, q, i }) => {
            const t = teamOf(mission, team);
            const goal = t.challenge.charAt(0).toLowerCase() + t.challenge.slice(1);
            return (
              <article key={`${team}${i}`} className="print-card">
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                  <span>Team {team} - Story {i + 1}</span>
                  <span>{q.points} pts</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>{q.prompt.split(/(?<=[.?])\s/)[0]}</h3>
                <p style={{ margin: "0 0 0.5rem" }}>As the {t.role}, we want to {goal}, so we can finish &quot;{mission.title}&quot;.</p>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>Objective {q.objective}: {OBJECTIVE_LABEL[q.objective]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="print-section" aria-labelledby="p-roles">
        <h2 id="p-roles" style={{ fontSize: "1.6rem", margin: "0 0 0.75rem" }}>Role cards</h2>
        <div className="print-grid">
          {ROLES.map((r) => (
            <article key={r} className="print-card" style={{ minHeight: "9rem" }}>
              <h3 style={{ fontSize: "1.6rem", margin: "0 0 0.5rem" }}>{r}</h3>
              <p style={{ margin: 0, fontSize: "1.2rem" }}>{ROLE_DUTIES[r]}</p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: "1rem" }}>Roles rotate each story: pass your card to the next seat.</p>
      </section>

      {codeStories.map(({ team, q, i }) => {
        const { lines, variables } = traceLayout(q.code ?? "");
        return (
          <section key={`${team}${i}`} className="print-section" aria-label={`Trace mat, Team ${team} story ${i + 1}`}>
            <div className="print-card">
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 0.25rem" }}>Trace mat - Team {team}, Story {i + 1}</h2>
              <p style={{ margin: "0 0 0.75rem" }}>Write each variable&apos;s value after its line runs.</p>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ border: "2px solid #000", padding: "0.4rem", textAlign: "left" }}>Code</th>
                    {variables.map((v) => (
                      <th key={v} scope="col" style={{ border: "2px solid #000", padding: "0.4rem", fontFamily: "monospace" }}>{v}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, r) => (
                    <tr key={r}>
                      <th scope="row" style={{ border: "2px solid #000", padding: "0.4rem", textAlign: "left", fontFamily: "monospace", whiteSpace: "pre", fontWeight: 400 }}>{line}</th>
                      {variables.map((v) => (
                        <td key={v} style={{ border: "2px solid #000", height: "2.75rem", minWidth: "4.5rem" }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <section className="print-section" aria-labelledby="p-baton">
        <h2 id="p-baton" style={{ fontSize: "1.6rem", margin: "0 0 0.75rem" }}>Baton card</h2>
        <article className="print-card">
          <h3 style={{ fontSize: "1.6rem", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            Team A <ArrowRight size={28} aria-hidden="true" /> Team B
          </h3>
          <p style={{ margin: "0 0 1rem" }}>Scrum Master of Team A: write a stand-up note in one minute. What did we finish? What got stuck? What should Team B watch for?</p>
          {[0, 1, 2, 3, 4, 5].map((n) => <div key={n} style={writeLine} />)}
        </article>
      </section>
    </div>
  );
}

function PrintInner() {
  const id = useSearchParams().get("mission");
  return id ? <Sheets id={id} /> : <Picker />;
}

export default function PrintPage() {
  return (
    <Suspense fallback={<p>Loading printables...</p>}>
      <PrintInner />
    </Suspense>
  );
}
