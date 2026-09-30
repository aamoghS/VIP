import { motion } from "framer-motion";
import { Code2, ArrowRight, Users, Flame } from "lucide-react";
import { SprintMission } from "./types";
import { TopicMark } from "./TopicMark";

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
        style={{ background: "transparent", border: "2px solid var(--ink)", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.82rem", marginBottom: "1.5rem", padding: "0.4rem 0.7rem", display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px" }}
      >
        ← Back to missions
      </button>

      {/* Mission header */}
      <div style={{ marginBottom: "2rem", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <TopicMark topicKey={mission.topicKey} size={26} />
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px", lineHeight: 1.1 }}>
              {mission.title}
            </h1>
            <span style={{
              fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace",
              color: "var(--ink)", background: "var(--ticket)",
              padding: "0.2rem 0.55rem", borderRadius: 0,
              border: "2px solid var(--ink)",
              letterSpacing: "0.5px",
            }}>{mission.topic}</span>
          </div>
        </div>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem" }}>{mission.description}</p>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>
          Select your team
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Group A - chunky borders */}
        <motion.button
          type="button"
          onClick={() => onSelectTeam("GroupA")}
          whileHover={{ y: -2 }}
          style={{
            padding: "1.25rem", background: "var(--bg-elevated)",
            border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ticket)",
            borderRadius: 0, cursor: "pointer", textAlign: "left", width: "100%",
            color: "inherit", font: "inherit",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "52px", height: "52px", background: "var(--ticket)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid var(--ink)", flexShrink: 0 }}>
                <Code2 size={26} color="var(--ink)" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.3rem", letterSpacing: "-0.25px", lineHeight: 1.2 }}>
                  Group A — {mission.groupA.role}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, paddingLeft: 3 }}>
                  {mission.groupA.challenge}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.825rem", fontWeight: 700 }}>{mission.groupA.questions.length} Qs</span>
              <ArrowRight size={19} color="var(--ink)" />
            </div>
          </div>

        </motion.button>

        {/* Group B - chunky borders */}
        <motion.button
          type="button"
          onClick={() => onSelectTeam("GroupB")}
          whileHover={{ y: -2 }}
          style={{
            padding: "1.25rem", background: "var(--bg-elevated)",
            border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--accent-indigo)",
            borderRadius: 0, cursor: "pointer", textAlign: "left", width: "100%",
            color: "inherit", font: "inherit",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "52px", height: "52px", background: "var(--ticket)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid var(--ink)", flexShrink: 0 }}>
                <Users size={26} color="var(--ink)" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.3rem", letterSpacing: "-0.25px", lineHeight: 1.2 }}>
                  Group B — {mission.groupB.role}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, paddingLeft: 3 }}>
                  {mission.groupB.challenge}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.825rem", fontWeight: 700 }}>{mission.groupB.questions.length} Qs</span>
              <ArrowRight size={19} color="var(--ink)" />
            </div>
          </div>

        </motion.button>
      </div>

      <div style={{ marginTop: "1.5rem", padding: "0.875rem 1.25rem", background: "var(--bg-elevated)", borderRadius: 0, border: "2px solid var(--ink)", fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "0.5rem", lineHeight: 1.4 }}>
        <Flame size={13} style={{ display: "inline", marginRight: "0.375rem", verticalAlign: "-2px", color: "var(--ticket)" }} />
        Group A goes first — Group B unlocks after Group A finishes.
      </div>
    </motion.div>
  );
}
