import { motion } from "framer-motion";
import { Code2, ArrowRight, Users, Flame } from "lucide-react";
import { SprintMission } from "./types";

export function TeamPicker({
  mission, onSelectTeam, onBack
}: {
  mission: SprintMission;
  onSelectTeam: (t: "GroupA" | "GroupB") => void;
  onBack: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "1.5rem" }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.375rem" }}
      >
        ← Back to missions
      </button>

      {/* Mission header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2.5rem" }}>{mission.topicIcon}</span>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px" }}>
              {mission.title}
            </h1>
            <span style={{
              fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace",
              color: mission.topicColor, background: `${mission.topicColor}15`,
              padding: "0.125rem 0.625rem", borderRadius: "999px",
            }}>{mission.topic}</span>
          </div>
        </div>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{mission.description}</p>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          Which group are you in?
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Group A */}
        <motion.div
          onClick={() => onSelectTeam("GroupA")}
          whileHover={{ scale: 1.01, x: 4, boxShadow: "0 10px 25px -10px rgba(99,102,241,0.3)" }} 
          whileTap={{ scale: 0.99 }}
          style={{
            padding: "1.5rem", background: "var(--glass-surface)", backdropFilter: "blur(12px)",
            border: "2px solid rgba(99,102,241,0.4)", borderRadius: "var(--radius-lg)",
            cursor: "pointer", position: "relative", overflow: "hidden"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Code2 size={24} color="var(--accent-indigo)" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  Group A — {mission.groupA.role}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>
                  {mission.groupA.challenge}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>{mission.groupA.questions.length} Qs</span>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
          </div>
        </motion.div>

        {/* Group B */}
        <motion.div
          onClick={() => onSelectTeam("GroupB")}
          whileHover={{ scale: 1.01, x: 4, boxShadow: "0 10px 25px -10px rgba(59,130,246,0.3)" }} 
          whileTap={{ scale: 0.99 }}
          style={{
            padding: "1.5rem", background: "var(--glass-surface)", backdropFilter: "blur(12px)",
            border: "2px solid rgba(59,130,246,0.4)", borderRadius: "var(--radius-lg)",
            cursor: "pointer", position: "relative", overflow: "hidden"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={24} color="var(--accent-blue)" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  Group B — {mission.groupB.role}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>
                  {mission.groupB.challenge}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>{mission.groupB.questions.length} Qs</span>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ marginTop: "1.5rem", padding: "0.875rem 1.25rem", background: "var(--glass-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        <Flame size={13} style={{ display: "inline", marginRight: "0.375rem", verticalAlign: "-2px", color: "#f59e0b" }} />
        Group A goes first — Group B unlocks after Group A finishes.
      </div>
    </motion.div>
  );
}
