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

      {/* Back button - chunky border */}
      <button
        onClick={onBack}
        style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.12)", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "'JetBrains Mono', monospace" }}
      >
        ← Back to missions
      </button>

      {/* Mission header */}
      <div style={{ marginBottom: "2rem", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2.5rem" }}>{mission.topicIcon}</span>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px" }}>
              {mission.title}
            </h1>
            <span style={{
              fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace",
              color: mission.topicColor, background: `${mission.topicColor}15`,
              padding: "0.25rem 0.75rem", borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(255,255,255,0.08)",
              letterSpacing: "0.5px",
            }}>{mission.topic}</span>
          </div>
        </div>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{mission.description}</p>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          Select your team
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Group A - chunky borders */}
        <motion.div
          onClick={() => onSelectTeam("GroupA")}
          whileHover={{ scale: 1.015, x: 0, boxShadow: "4px 4px 0px rgba(99,102,241,0.25)" }}
          whileTap={{ scale: 0.98, x: 0, boxShadow: "2px 2px 0px rgba(99,102,241,0.25)" }}
          style={{
            padding: "1.75rem", background: "var(--glass-surface)", backdropFilter: "blur(16px)",
            border: "3px solid rgba(99,102,241,0.35)", borderRadius: "var(--radius-lg)",
            cursor: "pointer", position: "relative", overflow: "hidden",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "4px 4px 0px rgba(99,102,241,0.15)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "var(--radius-sm)", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(99,102,241,0.25)" }}>
                <Code2 size={26} color="var(--accent-indigo)" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.3rem", letterSpacing: "-0.25px" }}>
                  Group A — {mission.groupA.role}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, paddingLeft: 3 }}>
                  {mission.groupA.challenge}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.825rem", fontWeight: 700 }}>{mission.groupA.questions.length} Qs</span>
              <ArrowRight size={19} color="#94a3b8" />
            </div>
          </div>

          {/* Corner accents */}
          <div style={{
            position: "absolute", top: "-2px", right: "-2px", width: "24px", height: "24px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.3), transparent)",
            borderRadius: "4px"
          }} />
          <div style={{
            position: "absolute", bottom: "-2px", left: "-2px", width: "20px", height: "20px",
            background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)",
            borderRadius: "4px"
          }} />
        </motion.div>

        {/* Group B - chunky borders */}
        <motion.div
          onClick={() => onSelectTeam("GroupB")}
          whileHover={{ scale: 1.015, x: 0, boxShadow: "4px 4px 0px rgba(59,130,246,0.25)" }}
          whileTap={{ scale: 0.98, x: 0, boxShadow: "2px 2px 0px rgba(59,130,246,0.25)" }}
          style={{
            padding: "1.75rem", background: "var(--glass-surface)", backdropFilter: "blur(16px)",
            border: "3px solid rgba(59,130,246,0.35)", borderRadius: "var(--radius-lg)",
            cursor: "pointer", position: "relative", overflow: "hidden",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "4px 4px 0px rgba(59,130,246,0.15)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "var(--radius-sm)", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(59,130,246,0.25)" }}>
                <Users size={26} color="var(--accent-blue)" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.3rem", letterSpacing: "-0.25px" }}>
                  Group B — {mission.groupB.role}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, paddingLeft: 3 }}>
                  {mission.groupB.challenge}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.825rem", fontWeight: 700 }}>{mission.groupB.questions.length} Qs</span>
              <ArrowRight size={19} color="#94a3b8" />
            </div>
          </div>

          {/* Corner accents */}
          <div style={{
            position: "absolute", top: "-2px", right: "-2px", width: "24px", height: "24px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.3), transparent)",
            borderRadius: "4px"
          }} />
          <div style={{
            position: "absolute", bottom: "-2px", left: "-2px", width: "20px", height: "20px",
            background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent)",
            borderRadius: "4px"
          }} />
        </motion.div>
      </div>

      <div style={{ marginTop: "1.5rem", padding: "0.875rem 1.25rem", background: "var(--glass-surface)", borderRadius: "var(--radius-sm)", border: "2px solid rgba(255,255,255,0.12)", fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Flame size={13} style={{ display: "inline", marginRight: "0.375rem", verticalAlign: "-2px", color: "#f59e0b", filter: "drop-shadow(0 0 4px rgba(245,158,11,0.5))" }} />
        Group A goes first — Group B unlocks after Group A finishes.
      </div>
    </motion.div>
  );
}
