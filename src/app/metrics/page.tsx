"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import {
  BarChart3, Target, Zap, TrendingUp, CheckCircle, XCircle,
  Trophy, Sparkles, RotateCcw, BookOpen, Code2, Bug, GitBranch, Repeat2, FlaskConical,
} from "lucide-react";

const TOPICS = [
  { key: "variables",  label: "Variables",  emoji: "📦", icon: Code2,      color: "#a855f7", glow: "rgba(168,85,247,0.3)"  },
  { key: "logic",      label: "If / Else",  emoji: "🤔", icon: GitBranch,  color: "#3b82f6", glow: "rgba(59,130,246,0.3)"  },
  { key: "loops",      label: "Loops",      emoji: "🔁", icon: Repeat2,    color: "#10b981", glow: "rgba(16,185,129,0.3)"  },
  { key: "functions",  label: "Functions",  emoji: "⚙️", icon: FlaskConical, color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { key: "debugging",  label: "Debugging",  emoji: "🐛", icon: Bug,        color: "#ef4444", glow: "rgba(239,68,68,0.3)"   },
  { key: "algorithms", label: "Algorithms", emoji: "🗺️", icon: BookOpen,   color: "#06b6d4", glow: "rgba(6,182,212,0.3)"   },
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
  padding: "1.5rem",
  backdropFilter: "blur(12px)",
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
      <motion.div variants={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.25rem" }}>
            My Progress
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            All stats are saved locally — your personal learning snapshot.
          </p>
        </div>
        <button
          onClick={() => { if (confirm("Reset ALL progress? This cannot be undone.")) resetProgress(); }}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.6rem 1.1rem", borderRadius: "var(--radius-sm)",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
        >
          <RotateCcw size={14} />
          Reset Progress
        </button>
      </motion.div>

      {/* Stat tiles */}
      <motion.div variants={item} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Total XP",        value: xp,                   icon: Sparkles,   color: "#f59e0b" },
          { label: "Level",            value: level,                icon: TrendingUp, color: "#a855f7" },
          { label: "Questions Done",   value: questionsSolved,      icon: Target,     color: "#3b82f6" },
          { label: "Sprints Done",     value: teamMissionsCompleted, icon: Zap,        color: "#10b981" },
          { label: "Overall Accuracy", value: `${overallPct}%`,    icon: BarChart3,  color: accuracyColor(overallPct) },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} style={{ ...card }} whileHover={{ y: -3 }}>
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
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>💡 Focus Areas</h2>
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
