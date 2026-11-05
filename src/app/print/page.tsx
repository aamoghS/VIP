"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Printer, ArrowRight, Scissors } from "lucide-react";
import { MISSIONS } from "@/app/build/missions";
import { getMission, storyTitle, teamOf, userStoryText } from "@/lib/sprint/mission";
import { ROLES, ROLE_DUTIES } from "@/lib/sprint/roles";
import { traceLayout } from "@/lib/sprint/trace";
import type { TeamId } from "@/lib/sprint/types";
import { PageHeader } from "@/components/PageHeader";
import { RichText } from "@/components/RichText";
import { Btn, MONO, ScrollFade, SPACE, STEP, cardTitle, heading, hint, pageTitle, pts } from "@/app/build/ui";

const OBJECTIVE_LABEL: Record<number, string> = {
  1: "Trace a loop + if",
  2: "Fix boundary errors",
  3: "Explain why",
  4: "Agile teamwork",
};

const TEAMS: TeamId[] = ["A", "B"];
const printCss = `
.print-sheet,.print-sheet *,.print-picker *{font-variant-ligatures:none}
.print-sheet{min-width:0;overflow-wrap:break-word}
.print-card-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-weight:700;white-space:nowrap}
.print-mat{min-width:100%;width:max-content}
.print-mat td{min-width:96px}
.print-mat thead th{word-break:keep-all;overflow-wrap:normal;white-space:nowrap}
.baton-cut{display:flex;align-items:center;gap:8px;margin:0 0 12px;color:#000}
.baton-cut .baton-line{flex:1;border-top:2px dashed #000}
.baton-ticket{display:flex;border:3px solid #000;background:#fff;color:#000}
.baton-stub{flex:0 0 96px;border-right:2px dashed #000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;font-family:${MONO};font-weight:700;font-size:1.75rem;text-align:center}
.baton-stub small{font-size:0.8rem;font-weight:400}
.baton-body{flex:1;min-width:0;padding:16px}
@media (min-width:641px){.print-sheet.page{padding-left:24px;padding-right:24px}}
@media screen and (max-width:600px){
.print-mat,.print-mat tbody,.print-mat tr,.print-mat td,.print-mat tbody th{display:block;width:100%;min-width:0;box-sizing:border-box}
.print-mat thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.print-mat tr{margin:0 0 12px;border:3px solid #000}
.print-mat th,.print-mat td{border:0}
.print-mat tbody th{white-space:pre-wrap;border-bottom:3px solid #000}
.print-mat td{height:auto;min-height:3.25rem;padding:6px 10px;border-top:2px solid #000}
.print-mat tbody th+td{border-top:0}
.print-mat td::before{content:attr(data-var);display:block;font-size:13px}
}
@media (max-width:640px){.baton-stub{flex-basis:64px;font-size:1.25rem}}
.print-mat{border-collapse:collapse;width:100%;font-family:${MONO}}
.print-mat th,.print-mat td{border:3px solid #000;padding:0}
.print-mat thead th{padding:6px 10px;vertical-align:bottom;text-align:center}
.print-mat thead th.pm-code{text-align:left}
.print-mat tbody th{text-align:left;font-weight:400;white-space:pre}
.pm-in{display:flex;align-items:stretch;min-height:2.75rem}
.pm-n{flex:0 0 32px;display:flex;align-items:center;justify-content:center;border-right:3px solid #000;font-size:0.8rem}
.pm-line{display:flex;align-items:center;padding:0 10px}
.print-mat td{height:2.75rem;min-width:4.5rem}
.pick-link{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
@media (max-width:640px){
.print-grid{grid-template-columns:minmax(0,1fr) !important}
.pick-link .pick-go{flex-basis:100%}
}
@media print{.print-grid{grid-template-columns:repeat(2,1fr) !important}}
`;

const writeLine = { borderBottom: "2px solid #000", height: "2.25rem" } as const;

function Picker() {
  return (
    <div className="page print-picker">
      <style>{printCss}</style>
      <PageHeader title="Printables" meta="Pick a mission to print its story cards, role cards, trace mats and baton card." />
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: SPACE[3], maxWidth: 720 }}>
        {MISSIONS.map((m) => (
          <li key={m.id}>
            <Link
              href={`/print?mission=${m.id}`}
              className="pick-link"
              style={{
                padding: "16px 24px", minHeight: 44, border: "3px solid var(--ink)", background: "var(--surface, #fff)",
                boxShadow: "4px 4px 0 var(--ink)", color: "var(--ink)", textDecoration: "none", fontSize: STEP.s0,
              }}
            >
              <span><strong>{m.title}</strong> ({m.topic})</span>
              <span className="pick-go" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
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
        <p role="alert" style={{ fontSize: STEP.s0 }}>No mission with id &quot;{id}&quot;.</p>
        <Picker />
      </div>
    );
  }

  const stories = TEAMS.flatMap((team) =>
    teamOf(mission, team).questions.map((q, i) => ({ team, q, i })),
  );
  const codeStories = stories.filter((s) => s.q.code);

  return (
    <div className="print-sheet page" style={{ fontSize: STEP.s0, lineHeight: 1.5 }}>
      <style>{printCss}</style>
      <div className="no-print" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <Btn onClick={() => window.print()}>
          <Printer size={20} aria-hidden="true" /> Print
        </Btn>
        <Link href="/print" style={{ color: "var(--ink)", fontWeight: 700, display: "inline-flex", alignItems: "center", minHeight: 44 }}>All missions</Link>
        <span>Tip: print on cardstock, then cut along the card borders.</span>
      </div>

      <h1 className="page-title" style={{ ...pageTitle, marginBottom: SPACE[5] }}>
        {mission.title} ({mission.topic})
      </h1>

      <section className="print-section" aria-labelledby="p-stories">
        <h2 id="p-stories" style={{ ...heading, margin: `0 0 ${SPACE[3]}` }}>Story cards</h2>
        <div className="print-grid">
          {stories.map(({ team, q, i }) => {
            return (
              <article key={`${team}${i}`} className="print-card">
                <div className="print-card-head">
                  <span>Team {team}, story {i + 1}</span>
                  <span>{pts(q.points)}</span>
                </div>
                <h3 style={{ ...cardTitle, margin: `${SPACE[2]} 0` }}>{storyTitle(q)}</h3>
                <p style={{ margin: "0 0 0.5rem" }}><RichText text={userStoryText(mission, team, q)} /></p>
                <p style={{ margin: 0, fontSize: STEP.s1 }}>Objective {q.objective}: {OBJECTIVE_LABEL[q.objective]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="print-section" aria-labelledby="p-roles">
        <h2 id="p-roles" style={{ ...heading, margin: `0 0 ${SPACE[3]}` }}>Role cards</h2>
        <div className="print-grid">
          {ROLES.map((r) => (
            <article key={r} className="print-card" style={{ minHeight: "9rem" }}>
              <h3 style={{ ...heading, margin: `0 0 ${SPACE[2]}` }}>{r}</h3>
              <p style={{ margin: 0, fontSize: STEP.s1up }}>{ROLE_DUTIES[r]}</p>
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
              <h2 style={{ ...cardTitle, margin: `0 0 ${SPACE[1]}` }}>Trace mat: Team {team}, Story {i + 1}</h2>
              <p style={{ margin: "0 0 0.75rem" }}>Write each variable&apos;s value after its line runs. Loops: list each value in order, like 5, 3, 1.</p>
              <ScrollFade fade="#fff">
                <table className="print-mat">
                  <thead>
                    <tr>
                      <th scope="col" className="pm-code">Code</th>
                      {variables.map((v) => (
                        <th key={v} scope="col">{v}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, r) => (
                      <tr key={r}>
                        <th scope="row">
                          <div className="pm-in">
                            <span className="pm-n" aria-hidden="true">{r + 1}</span>
                            <span className="pm-line">{line}</span>
                          </div>
                        </th>
                        {variables.map((v) => (
                          <td key={v} data-var={v} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollFade>
            </div>
          </section>
        );
      })}

      <section className="print-section" aria-labelledby="p-baton">
        <h2 id="p-baton" style={{ ...heading, margin: `0 0 ${SPACE[3]}` }}>Baton card</h2>
        <div className="baton-cut" aria-hidden="true"><Scissors size={18} /><span className="baton-line" /></div>
        <article className="baton-ticket print-card" style={{ padding: 0 }}>
          <div className="baton-stub" aria-hidden="true">A→B<small>cut here</small></div>
          <div className="baton-body">
            <h3 style={{ ...heading, margin: `0 0 ${SPACE[2]}` }}>Team A to Team B</h3>
            <p style={{ margin: "0 0 1rem" }}>Scrum Master of Team A: write a stand-up note in one minute. What did we finish? What got stuck? What should Team B watch for?</p>
            {[0, 1, 2, 3, 4, 5].map((n) => <div key={n} style={writeLine} />)}
          </div>
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
    <Suspense fallback={<p style={hint}>Loading printables...</p>}>
      <PrintInner />
    </Suspense>
  );
}
