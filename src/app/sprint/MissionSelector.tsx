import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { SprintMission } from "./types";
import { MISSIONS } from "./missions";
import { TopicMark } from "./TopicMark";

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
          <span className="hud" style={{
            color: "var(--ink)", fontSize: "1.35rem",
            padding: "0.15rem 0.6rem", background: "var(--ticket)",
            border: "3px solid var(--ink)",
          }}>Build</span>
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1.5px", marginBottom: "0.5rem" }}>
          Pick a scenario
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}>
          Team problems pulled from high school life — hackathons, honor roll, work shifts, club bots. One group sets state. The other ships the logic.
        </p>
      </div>

      {/* Mission grid - chunky cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
        {MISSIONS.map((m, idx) => (
          <motion.button
            key={m.id}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ y: -3 }}
            onClick={() => onSelectMission(m)}
            style={{
              background: "var(--bg-elevated)",
              border: "3px solid var(--ink)",
              boxShadow: "5px 5px 0 var(--ticket)",
              borderRadius: 0,
              padding: "1.25rem",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              color: "inherit",
              font: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <TopicMark topicKey={m.topicKey} />
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", marginBottom: "0.125rem", letterSpacing: "-0.3px" }}>
                    {m.title}
                  </div>
                  <span style={{
                    fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--ink)", background: "var(--ticket)",
                    padding: "0.2rem 0.5rem", borderRadius: 0,
                    border: "2px solid var(--ink)",
                    letterSpacing: "0.3px",
                  }}>{m.topic}</span>
                </div>
              </div>
              <span style={{
                fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                color: "var(--ink)", background: "var(--bg-elevated)",
                padding: "0.2rem 0.5rem", borderRadius: 0, border: "2px solid var(--ink)",
                flexShrink: 0,
              }}>+{m.xpReward} XP</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              {m.description}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "110px", padding: "0.625rem 0.75rem", background: "var(--bg-elevated)", borderRadius: 0, fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", border: "2px solid var(--ink)" }}>
                <div style={{ color: "var(--ink)", fontWeight: 700, marginBottom: "0.125rem" }}>Group A</div>
                {m.groupA.role}
              </div>
              <div style={{ flex: 1, minWidth: "110px", padding: "0.625rem 0.75rem", background: "var(--bg-elevated)", borderRadius: 0, fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", border: "2px solid var(--ink)" }}>
                <div style={{ color: "var(--accent-indigo)", fontWeight: 700, marginBottom: "0.125rem" }}>Group B</div>
                {m.groupB.role}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "1rem", color: "var(--ink)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.3px" }}>
              <Play size={14} fill="var(--ink)" /> Start Sprint <ArrowRight size={14} />
            </div>

            {/* Corner accents */}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
