"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { CheckCircle, AlertTriangle, Lock } from "lucide-react";

export default function SprintPage() {
  const { sprintStage, advanceSprint, addXp } = useProgress();
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

  return (
    <div>
      <h1 className="page-title">The Sprint</h1>
      <p className="page-subtitle">Mission: Save the City Reservoir.</p>

      <div style={{ display: "flex", gap: "2rem", flexDirection: "column", maxWidth: "800px" }}>
        
        {/* Sprint 1: Group A */}
        <motion.div className="glass-card" style={{ borderLeft: sprintStage === 1 ? "4px solid var(--primary)" : "1px solid var(--glass-border)" }}>
          <div className="flex-between" style={{ marginBottom: "1rem" }}>
            <h2 style={{ color: "var(--primary)" }}>Sprint 1: The Gathering (Group A)</h2>
            {sprintStage > 1 ? <CheckCircle color="var(--primary)" /> : <span className="badge">Active</span>}
          </div>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            The city needs to know how much rain fell. Define the variables for Rate and Time.
            (Hint: Rate = 5, Time = 10)
          </p>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem", fontFamily: "monospace" }}>
            <span style={{ color: "#c77dff" }}>int</span> rainRate = 
            <input type="text" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: "60px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "#fff", padding: "0.5rem", borderRadius: "4px" }} disabled={sprintStage > 1}/>;
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem", fontFamily: "monospace" }}>
            <span style={{ color: "#c77dff" }}>int</span> rainTime = 
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "60px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "#fff", padding: "0.5rem", borderRadius: "4px" }} disabled={sprintStage > 1}/>;
          </div>

          {sprintStage === 1 && (
            <button className="btn-primary" onClick={handleSprint1Submit}>Submit Data to Group B</button>
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
                <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} disabled={sprintStage !== 2} style={{ width: "60px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--secondary)", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", margin: "0 0.5rem" }} />
              ) {"{"}</div>
              <div style={{ paddingLeft: "2rem", color: "var(--text-muted)" }}>closeReservoirLid();</div>
              <div>{"}"}</div>
            </div>

            {sprintStage === 2 && (
              <button 
                className="btn-primary" 
                style={{ background: "linear-gradient(135deg, var(--secondary), #0077b6)" }}
                onClick={handleSprint2Submit}
              >
                Execute Logic
              </button>
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
            <button className="btn-primary" style={{ marginTop: "1rem", background: "linear-gradient(135deg, var(--accent), #e85d04)" }} onClick={() => addXp(500)}>
              Claim Reward
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
