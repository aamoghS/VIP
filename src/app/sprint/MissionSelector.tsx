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

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
          <Sparkles size={18} color="var(--accent-blue)" />
          <span style={{
            color: "var(--accent-blue)", fontSize: "0.75rem",
            fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase",
            letterSpacing: "1.5px", fontWeight: 600,
          }}>CS Sprint</span>
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1.5px", marginBottom: "0.5rem" }}>
          Choose a Mission
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}>
          Pick a CS topic to sprint on. Group A and Group B each get different questions on the same concept.
        </p>
      </div>

      {/* Mission grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
        {MISSIONS.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ y: -5, boxShadow: `0 10px 30px -10px ${m.topicColor}40`, borderColor: `${m.topicColor}80` }}
            onClick={() => onSelectMission(m)}
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "var(--radius-lg)", padding: "1.5rem",
              cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "2rem" }}>{m.topicIcon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", marginBottom: "0.125rem" }}>
                    {m.title}
                  </div>
                  <span style={{
                    fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                    color: m.topicColor, background: `${m.topicColor}15`,
                    padding: "0.125rem 0.5rem", borderRadius: "999px",
                  }}>{m.topic}</span>
                </div>
              </div>
              <span style={{
                fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                color: "#f59e0b", background: "rgba(245,158,11,0.1)",
                padding: "0.25rem 0.625rem", borderRadius: "999px", flexShrink: 0,
              }}>+{m.xpReward} XP</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              {m.description}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1, padding: "0.5rem 0.75rem", background: "rgba(99,102,241,0.06)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                <div style={{ color: "#818cf8", fontWeight: 600, marginBottom: "0.125rem" }}>Group A</div>
                {m.groupA.role}
              </div>
              <div style={{ flex: 1, padding: "0.5rem 0.75rem", background: "rgba(59,130,246,0.06)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                <div style={{ color: "#60a5fa", fontWeight: 600, marginBottom: "0.125rem" }}>Group B</div>
                {m.groupB.role}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "1rem", color: m.topicColor, fontSize: "0.8rem", fontWeight: 600 }}>
              <Play size={13} /> Start Sprint <ArrowRight size={13} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
