import { motion } from "framer-motion";
import { Sparkles, Play, ArrowRight } from "lucide-react";
import { SprintMission } from "./types";
import { MISSIONS } from "./missions";

export function MissionSelector({
  onSelectMission
}: {
  onSelectMission: (m: SprintMission) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: "760px", margin: "0 auto" }}>

      {/* Header - chunky style */}
      <div style={{ marginBottom: "2.5rem", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
          <Sparkles size={18} color="var(--accent-blue)" />
          <span style={{
            color: "var(--accent-blue)", fontSize: "0.75rem",
            fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase",
            letterSpacing: "1.5px", fontWeight: 600,
            padding: "0.25rem 0.75rem", background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "var(--radius-sm)",
          }}>CS Sprint</span>
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1.5px", marginBottom: "0.5rem" }}>
          Active Scenarios
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}>
          Select a <strong>Logic Scenario</strong> to solve with your team. Each mission requires critical thinking and seamless handoffs.
        </p>

        {/* Corner accent */}
        <div style={{ position: "absolute", top: "-5px", right: "-5px", width: "20px", height: "20px", background: "var(--accent-blue)" }} />
      </div>

      {/* Mission grid - chunky cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
        {MISSIONS.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ y: -4, boxShadow: `0 12px 35px -10px ${m.topicColor}30`, borderColor: `${m.topicColor}60` }}
            onClick={() => onSelectMission(m)}
            style={{
              background: "var(--glass-surface)",
              backdropFilter: "blur(16px)",
              border: `3px solid var(--glass-border)`,
              borderRadius: "var(--radius-lg)", padding: "1.75rem",
              cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "2.2rem" }}>{m.topicIcon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", marginBottom: "0.125rem", letterSpacing: "-0.3px" }}>
                    {m.title}
                  </div>
                  <span style={{
                    fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                    color: m.topicColor, background: `${m.topicColor}15`,
                    padding: "0.25rem 0.625rem", borderRadius: "var(--radius-sm)",
                    border: `1px solid ${m.topicColor}30`,
                    letterSpacing: "0.3px",
                  }}>{m.topic}</span>
                </div>
              </div>
              <span style={{
                fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                color: "#f59e0b", background: "rgba(245,158,11,0.1)",
                padding: "0.25rem 0.625rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(245,158,11,0.2)",
                flexShrink: 0,
              }}>+{m.xpReward} XP</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              {m.description}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "110px", padding: "0.625rem 0.75rem", background: "rgba(99,102,241,0.08)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", border: `1px solid rgba(99,102,241,0.15)` }}>
                <div style={{ color: "#818cf8", fontWeight: 700, marginBottom: "0.125rem" }}>Group A</div>
                {m.groupA.role}
              </div>
              <div style={{ flex: 1, minWidth: "110px", padding: "0.625rem 0.75rem", background: "rgba(59,130,246,0.08)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", border: `1px solid rgba(59,130,246,0.15)` }}>
                <div style={{ color: "#60a5fa", fontWeight: 700, marginBottom: "0.125rem" }}>Group B</div>
                {m.groupB.role}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "1rem", color: m.topicColor, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.3px" }}>
              <Play size={14} fill={m.topicColor} /> Start Sprint <ArrowRight size={14} />
            </div>

            {/* Corner accents */}
            <div style={{ position: "absolute", top: "-3px", left: "-3px", width: "10px", height: "10px", background: m.topicColor }} />
            <div style={{ position: "absolute", bottom: "-3px", right: "-3px", width: "10px", height: "10px", background: m.topicColor }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
