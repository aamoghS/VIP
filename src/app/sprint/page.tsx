"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { CheckCircle, AlertTriangle, Lock, Users, ArrowRight, Loader2 } from "lucide-react";

export default function SprintPage() {
  const { sprintStage, advanceSprint, addXp } = useProgress();
  const [team, setTeam] = useState<"GroupA" | "GroupB" | null>(null);
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [temp, setTemp] = useState("");

  const handleSprint1Submit = () => {
    if (rate === "5" && time === "10") {
      advanceSprint();
      addXp(200);
    }
  };

  const handleSprint2Submit = () => {
    if (parseInt(temp) > 85) {
      advanceSprint();
      addXp(300);
    }
  };

  if (!team) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="page-title" style={{ fontSize: "4rem" }}>Select Your Team</h1>
          <p className="page-subtitle" style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            The City Reservoir is in crisis. We need two specialized teams to calculate the rainfall and design the smart lid logic. Which team will you join?
          </p>
        </motion.div>

        <div className="grid-2" style={{ width: "100%", maxWidth: "800px" }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card" 
            style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            onClick={() => setTeam("GroupA")}
          >
            <div style={{ background: "rgba(199, 125, 255, 0.1)", padding: "1.5rem", borderRadius: "50%" }}>
              <Users size={40} color="var(--primary)" />
            </div>
            <h2 style={{ color: "var(--primary)" }}>Group A</h2>
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Data Gatherers. Calculate the rate and time.</p>
            <div style={{ marginTop: "1rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
              Join Group A <ArrowRight size={18} />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card" 
            style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            onClick={() => setTeam("GroupB")}
          >
            <div style={{ background: "rgba(78, 168, 222, 0.1)", padding: "1.5rem", borderRadius: "50%" }}>
              <Users size={40} color="var(--secondary)" />
            </div>
            <h2 style={{ color: "var(--secondary)" }}>Group B</h2>
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Logic Engineers. Control the reservoir lid.</p>
            <div style={{ marginTop: "1rem", color: "var(--secondary)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
              Join Group B <ArrowRight size={18} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 className="page-title">The Sprint</h1>
          <p className="page-subtitle">Mission: Save the City Reservoir.</p>
        </div>
        <div className="badge" style={{ fontSize: "1.1rem", border: `1px solid ${team === "GroupA" ? "var(--primary)" : "var(--secondary)"}` }}>
          Team: {team === "GroupA" ? "Group A (Data)" : "Group B (Logic)"}
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", flexDirection: "column", maxWidth: "800px" }}>
        
        {/* Sprint 1: Group A */}
        <motion.div className="glass-card" style={{ borderLeft: sprintStage === 1 ? "4px solid var(--primary)" : "1px solid var(--glass-border)", opacity: team === "GroupA" || sprintStage > 1 ? 1 : 0.5 }}>
          <div className="flex-between" style={{ marginBottom: "1rem" }}>
            <h2 style={{ color: "var(--primary)" }}>Sprint 1: The Gathering (Group A)</h2>
            {sprintStage > 1 ? <CheckCircle color="var(--primary)" /> : sprintStage === 1 ? <span className="badge">Active</span> : null}
          </div>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            The city needs to know how much rain fell. Define the variables for Rate and Time.
            (Hint: Rate = 5, Time = 10)
          </p>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem", fontFamily: "monospace" }}>
            <span style={{ color: "#c77dff" }}>int</span> rainRate = 
            <input type="text" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: "60px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "#fff", padding: "0.5rem", borderRadius: "4px" }} disabled={sprintStage > 1 || team !== "GroupA"}/>;
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem", fontFamily: "monospace" }}>
            <span style={{ color: "#c77dff" }}>int</span> rainTime = 
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "60px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "#fff", padding: "0.5rem", borderRadius: "4px" }} disabled={sprintStage > 1 || team !== "GroupA"}/>;
          </div>

          {sprintStage === 1 && team === "GroupA" && (
            <button className="btn-primary" onClick={handleSprint1Submit}>Submit Data to Group B</button>
          )}
          {sprintStage === 1 && team === "GroupB" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
              <Loader2 size={18} className="icon" style={{ animation: "spin 2s linear infinite" }} /> Waiting for Group A out in the field...
            </div>
          )}
        </motion.div>

        {/* Sprint 2: Group B */}
        <AnimatePresence>
          <motion.div 
            className="glass-card"
            style={{ 
              opacity: sprintStage >= 2 ? 1 : 0.5,
              borderLeft: sprintStage === 2 ? "4px solid var(--secondary)" : "1px solid var(--glass-border)" 
            }}
          >
            <div className="flex-between" style={{ marginBottom: "1rem" }}>
              <h2 style={{ color: "var(--secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {sprintStage < 2 && <Lock size={20} />} Sprint 2: The Logic (Group B)
              </h2>
              {sprintStage > 2 ? <CheckCircle color="var(--secondary)" /> : sprintStage === 2 ? <span className="badge">Active</span> : null}
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              The water is evaporating! Group A sent us the total volume. Now, write an if-statement to close the reservoir lid if the temperature is greater than 85.
            </p>
            
            <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "1.5rem", borderRadius: "var(--radius-sm)", fontFamily: "monospace", marginBottom: "2rem" }}>
              <div><span style={{ color: "#4ea8de" }}>if</span> ( temperature &gt; 
                <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} disabled={sprintStage !== 2 || team !== "GroupB"} style={{ width: "60px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--secondary)", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", margin: "0 0.5rem" }} />
              ) {"{"}</div>
              <div style={{ paddingLeft: "2rem", color: "var(--text-muted)" }}>closeReservoirLid();</div>
              <div>{"}"}</div>
            </div>

            {sprintStage === 2 && team === "GroupB" && (
              <button 
                className="btn-primary" 
                style={{ background: "linear-gradient(135deg, var(--secondary), #0077b6)" }}
                onClick={handleSprint2Submit}
              >
                Execute Logic
              </button>
            )}
            {sprintStage === 2 && team === "GroupA" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
                <CheckCircle size={18} className="icon" color="var(--primary)" /> Data sent! Waiting for Group B to execute logic...
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {sprintStage === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ border: "2px solid var(--accent)", background: "rgba(255, 158, 0, 0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <AlertTriangle color="var(--accent)" size={32} />
              <h2 style={{ color: "var(--accent)" }}>Mission Accomplished!</h2>
            </div>
            <p style={{ fontSize: "1.1rem" }}>
              The reservoir is safe. Group A collected the data, and Group B executed the logic just in time.
              You earned <strong>+500 XP</strong> and unlocked the <strong>Smart Lid Trophy</strong> for your Room!
            </p>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
