"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import {
  BarChart3, Target, Zap, TrendingUp, CheckCircle, XCircle,
  Trophy, Sparkles, RotateCcw, BookOpen, Code2, Bug, GitBranch, Repeat2, Lightbulb,
} from "lucide-react";

// Trophy icons as SVG components (no emojis in UI)
const TrophyIcons = {
  variables: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v2m0 16v2M5.6 6.4L9.4 10.2m-8.5 0l3.8 3.8M20.4 10.2l-3.8 3.8m-3.2-12.8v-2m0 16v2"/><path d="M4.2 4h15.6l-3 16H7.2L4.2 4z"/><path d="M12 9a4 4 0 0 0-4 4c0 1.5.8 2.7 2 3.5L12 19l2-2.5c1.2-.8 2-2 2-3.5a4 4 0 0 0-4-4Z"/></svg>,
  logic: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  loops: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M21.5 22a1 1 0 0 0 1-1 1 1 0 0 0-1-1h-2m5 2h-5"/><path d="M21.5 2a1 1 0 0 0 1 1v2H2v-2a1 1 0 0 0 1-1"/></svg>,
  functions: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18a3 3 0 0 0 3 3 3 3 0 0 0 3-3"/><path d="M9 3a3 3 0 0 0 3-3 3 3 0 0 0-3 3"/><path d="M9 3v12a3 3 0 0 0 6 0V3"/><path d="M15 21l-6 0"/></svg>,
  debugging: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10a2 2 0 0 1-2-2v-2m0 0a2 2 0 0 0-4 0v2m0 0H6m6 0a2 2 0 0 0-2 2v2m0 0a2 2 0 0 1-2 2h-2m0 0V6"/><path d="M18 14a2 2 0 0 1-2 2h-2"/></svg>,
  algorithms: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l6-6"/><path d="M15 9l9 9"/><path d="M21 3l-6 6"/><path d="M3 9l9 9"/></svg>,
};

function renderTrophyIcon(iconKey: string, size: number = 24) {
  const Icon = TrophyIcons[iconKey as keyof typeof TrophyIcons];
  return Icon ? <Icon /> : null;
}

const TOPICS = [
  { key: "variables",  label: "Variables",  iconKey: "variables", emoji: "🔧", color: "#a855f7", glow: "rgba(168,85,247,0.3)"  },
  { key: "logic",      label: "If / Else",  iconKey: "logic",     emoji: "🧠", color: "#3b82f6", glow: "rgba(59,130,246,0.3)"  },
  { key: "loops",      label: "Loops",      iconKey: "loops",     emoji: "🔁", color: "#10b981", glow: "rgba(16,185,129,0.3)"  },
  { key: "functions",  label: "Functions",  iconKey: "functions",  emoji: "🧪", color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { key: "debugging",  label: "Debugging",  iconKey: "debugging", emoji: "🐛", color: "#ef4444", glow: "rgba(239,68,68,0.3)"   },
  { key: "algorithms", label: "Algorithms", iconKey: "algorithms", emoji: "🗺️", color: "#06b6d4", glow: "rgba(6,182,212,0.3)"   },
];

function accuracyColor(pct: number) {
  if (pct >= 80) return "#10b981";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
}

function grade(pct: number) {
  if (pct >= 90) return { label: "Mastered ✓", color: "#10b981" };
  if (pct >= 75) return { label: "Proficient", color: "#3b82f6" };
  if (pct >= 60) return { label: "Getting there", color: "#f59e0b" };
  return { label: "Needs practice", color: "#ef4444" };
}

const card = {
  background: "var(--glass-surface)",
  border: "1px solid var(--glass-border)",
  borderRadius: "var(--radius-md)",
  padding: "1.75rem",
  backdropFilter: "blur(16px)",
  boxShadow: "var(--glass-glow)",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function MetricsPage() {
  const { xp, questionsSolved, teamMissionsCompleted, topicStats, resetProgress } = useProgress();

  const totalAttempted = Object.values(topicStats).reduce((s, t) => s + t.attempted, 0);
  const totalCorrect   = Object.values(topicStats).reduce((s, t) => s + t.correct, 0);
  const overallPct     = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const level          = Math.floor(xp / 500) + 1;

  const topicsWithData = TOPICS.map(t => {
    const stat = topicStats[t.key] ?? { attempted: 0, correct: 0 };
    const pct  = stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : null;
    return { ...t, ...stat, pct };
  });

  const weakest  = topicsWithData.filter(t => t.pct !== null && t.pct < 60).sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0));
  const strongest = topicsWithData.filter(t => t.pct !== null && t.pct >= 80).sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>

      {/* Header */}
      <motion.div variants={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.5rem", lineHeight: 1 }}>
            My Progress
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.5 }}>
            All stats are saved locally — your personal learning snapshot.
          </p>
        </div>
        <motion.button
          onClick={() => { if (confirm("Reset ALL progress? This cannot be undone.")) resetProgress(); }}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.6rem 1.1rem", borderRadius: "var(--radius-sm)",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
            transition: "all 0.2s",
          }}
          whileHover={{ x: 2 }}
          whileTap={{ x: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
        >
          <RotateCcw size={14} />
          Reset Progress
        </motion.button>
      </motion.div>

      {/* Stat tiles */}
      <motion.div variants={item} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Total XP",        value: xp,                   icon: Sparkles,   color: "#f59e0b" },
          { label: "Level",            value: level,                icon: TrendingUp, color: "#a855f7" },
          { label: "Questions Done",   value: questionsSolved,      icon: Target,     color: "#3b82f6" },
          { label: "Sprints Done",     value: teamMissionsCompleted, icon: Zap,        color: "#10b981" },
          { label: "Overall Accuracy", value: `${overallPct}%`,    icon: BarChart3,  color: accuracyColor(overallPct) },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} style={{ ...card }} whileHover={{ y: -3, scale: 1.01 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={17} color={color} />
              </div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>{label}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Topic breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

        <motion.div variants={item} style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <BarChart3 size={20} color="var(--accent-indigo)" />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Topic Accuracy</h2>
          </div>

          {totalAttempted === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
              No questions answered yet. Head to The Toolbox!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {topicsWithData.map((t, i) => (
                <motion.div key={t.key} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1rem" }}>{t.emoji}</span>
                      <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{t.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {t.correct}/{t.attempted}
                      </span>
                      {t.pct !== null ? (
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: accuracyColor(t.pct), fontFamily: "'JetBrains Mono', monospace" }}>
                          {t.pct}%
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>—</span>
                      )}
                    </div>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: t.pct !== null ? `${t.pct}%` : "0%" }}
                      transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                      style={{ height: "100%", background: t.pct !== null ? accuracyColor(t.pct) : "transparent", borderRadius: "3px" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Mastery grades + coaching */}
        <motion.div variants={item} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <Trophy size={20} color="#f59e0b" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Mastery Levels</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {topicsWithData.map(t => {
                const g = t.pct !== null ? grade(t.pct) : null;
                return (
                  <div key={t.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.4)" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{t.emoji} {t.label}</span>
                    {g ? (
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: g.color, fontFamily: "'JetBrains Mono', monospace" }}>{g.label}</span>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Not started</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coaching callouts */}
          {(weakest.length > 0 || strongest.length > 0) && (
            <div style={card}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Lightbulb size={16} color="var(--accent-amber)" />
                Focus Areas
              </h2>
              {weakest.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <XCircle size={14} color="#ef4444" />
                    <span style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: 600 }}>Needs more practice</span>
                  </div>
                  {weakest.slice(0, 2).map(t => (
                    <div key={t.key} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", padding: "0.2rem 0 0.2rem 1.25rem" }}>
                      {t.emoji} {t.label} — {t.pct}% accuracy
                    </div>
                  ))}
                </div>
              )}
              {strongest.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 600 }}>Strongest topics</span>
                  </div>
                  {strongest.slice(0, 2).map(t => (
                    <div key={t.key} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", padding: "0.2rem 0 0.2rem 1.25rem" }}>
                      {t.emoji} {t.label} — {t.pct}% accuracy
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
