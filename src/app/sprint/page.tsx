"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { CheckCircle, AlertTriangle, Lock, Users, ArrowRight, Loader2, Key } from "lucide-react";

type SessionState = {
  missionId: string;
  GroupA: { sprint1Completed: boolean; sprint2Completed: boolean; sprint3Completed: boolean };
  GroupB: { sprint1Completed: boolean; sprint2Completed: boolean; sprint3Completed: boolean };
};

type MissionData = {
  id: string;
  title: string;
  description: string;
  groupA: {
    role: string;
    instruction: string;
    vars: { name: string; type: string; target: string }[];
  };
  groupB: {
    role: string;
    instruction: string;
    logic: { variable: string; operator: string; target: string; action: string; bgClass: string };
  };
  successMessage: string;
  reward: { id: string; name: string; icon: string };
};

export default function SprintPage() {
  const { addXp, unlockItem } = useProgress();
  
  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [team, setTeam] = useState<"GroupA" | "GroupB" | null>(null);
  
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [mission, setMission] = useState<MissionData | null>(null);

  const [var1, setVar1] = useState("");
  const [var2, setVar2] = useState("");
  const [temp, setTemp] = useState("");
  
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Polling for live sync
  useEffect(() => {
    if (!sessionCode) return;
    
    const fetchState = async () => {
      try {
        const res = await fetch(`/api/teams?sessionId=${sessionCode}`);
        const data = await res.json();
        if (data.state) {
          setSessionState(data.state);
        }
        if (data.mission) {
          setMission(data.mission);
        }
      } catch (e) {
        console.error("Failed to fetch session state", e);
      }
    };

    fetchState(); // Initial fetch
    const interval = setInterval(fetchState, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [sessionCode]);

  const handleJoinSession = () => {
    if (sessionCodeInput.trim().length > 0) {
      setSessionCode(sessionCodeInput.trim().toUpperCase());
    }
  };

  const handleSprint1Submit = async () => {
    if (!mission) return;
    if (var1 === mission.groupA.vars[0].target && var2 === mission.groupA.vars[1].target) {
      addXp(200);
      try {
        await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionCode, teamId: "GroupA", action: "completeSprint1", payload: { var1, var2 } })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSprint2Submit = async () => {
    if (!mission) return;
    let isCorrect = false;
    const val = parseInt(temp);
    const target = parseInt(mission.groupB.logic.target);
    const op = mission.groupB.logic.operator;

    if (op === ">" && val > target) isCorrect = true;
    if (op === "<" && val < target) isCorrect = true;
    if (op === "==" && val === target) isCorrect = true;
    
    if (isCorrect) {
      addXp(300);
      try {
        await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionCode, teamId: "GroupB", action: "completeSprint2", payload: null })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClaimReward = () => {
    if (!rewardClaimed && mission) {
      addXp(500);
      unlockItem(mission.reward);
      setRewardClaimed(true);
    }
  };

  // Compute the current stage strictly from the synchronized remote state
  let sprintStage = 1;
  if (sessionState) {
    if (sessionState.GroupA.sprint1Completed) sprintStage = 2;
    if (sessionState.GroupA.sprint1Completed && sessionState.GroupB.sprint2Completed) sprintStage = 3;
  }

  // 1. Session Setup Screen
  if (!sessionCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="page-title text-6xl">Mission Control</h1>
          <p className="page-subtitle text-xl max-w-2xl mx-auto">
            Join a live session to sync progress with your classmates.
          </p>
        </motion.div>

        <motion.div className="glass-card flex items-center justify-center p-8 w-full max-w-lg mx-auto" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <div className="flex flex-col gap-6 w-full">
            <h2 className="text-2xl text-[var(--primary)] text-center flex items-center gap-2 justify-center">
              <Key /> Enter Session Code
            </h2>
            <input 
              type="text" 
              placeholder="e.g. ROOM-101" 
              value={sessionCodeInput} 
              onChange={(e) => setSessionCodeInput(e.target.value)}
              className="w-full text-center text-2xl p-4 bg-black/30 border border-white/20 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-[var(--primary)]"
            />
            <button className="btn-primary w-full text-center py-4" onClick={handleJoinSession}>
              Connect to Sandbox
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Wait for mission to load
  if (!mission) {
     return (
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
            <Loader2 size={48} className="animate-spin text-[var(--primary)]" />
            <p className="text-[var(--text-muted)] text-xl">Loading Mission Target...</p>
        </div>
     );
  }

  // 2. Team Selection Screen
  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="badge mb-4 bg-white/10 text-xl px-4 py-2 text-white">
            Session: <span className="text-[var(--primary)] font-bold">{sessionCode}</span>
          </div>
          <h1 className="page-title text-5xl">Select Your Team</h1>
          <p className="page-subtitle text-xl max-w-2xl mx-auto mt-4">
            {mission.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card cursor-pointer flex flex-col items-center gap-4 py-12" 
            onClick={() => setTeam("GroupA")}
          >
            <div className="bg-[rgba(199,125,255,0.1)] p-6 rounded-full shadow-lg shadow-[var(--primary)]/20">
              <Users size={48} color="var(--primary)" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--primary)] mt-2">Group A</h2>
            <p className="text-center text-[var(--text-muted)] text-lg px-4">{mission.groupA.role}</p>
            <div className="mt-4 text-[var(--primary)] flex items-center gap-2 font-bold text-lg bg-white/5 py-2 px-6 rounded-full">
              Join Group A <ArrowRight size={20} />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card cursor-pointer flex flex-col items-center gap-4 py-12" 
            onClick={() => setTeam("GroupB")}
          >
            <div className="bg-[rgba(78,168,222,0.1)] p-6 rounded-full shadow-lg shadow-[var(--secondary)]/20">
              <Users size={48} color="var(--secondary)" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--secondary)] mt-2">Group B</h2>
            <p className="text-center text-[var(--text-muted)] text-lg px-4">{mission.groupB.role}</p>
            <div className="mt-4 text-[var(--secondary)] flex items-center gap-2 font-bold text-lg bg-white/5 py-2 px-6 rounded-full">
              Join Group B <ArrowRight size={20} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 3. The Live Sprint Logic UI
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex-between mb-8">
        <div>
          <h1 className="page-title">The Sprint</h1>
          <p className="page-subtitle">Mission: {mission.title}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="badge border-white/20 text-sm font-mono tracking-wider">
            SESSION: <span className="text-white ml-2">{sessionCode}</span>
          </div>
          <div className={`badge text-lg border ${team === "GroupA" ? "border-[var(--primary)] text-[var(--primary)]" : "border-[var(--secondary)] text-[var(--secondary)]"}`}>
            Team: {team === "GroupA" ? "Group A" : "Group B"}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-3xl">
        
        {/* Sprint 1: Group A */}
        <motion.div className="glass-card" style={{ borderLeft: sprintStage === 1 ? "4px solid var(--primary)" : "1px solid var(--glass-border)", opacity: team === "GroupA" || sprintStage > 1 ? 1 : 0.5 }}>
          <div className="flex-between mb-4">
            <h2 className="text-[var(--primary)] text-2xl font-bold">Sprint 1: The Gathering (Group A)</h2>
            {sprintStage > 1 ? <CheckCircle color="var(--primary)" size={28} /> : sprintStage === 1 ? <span className="badge">Active</span> : null}
          </div>
          <p className="text-[var(--text-muted)] mb-6 text-lg">
            {mission.groupA.instruction}
          </p>
          
          <div className="flex items-center gap-4 mb-4 font-mono text-xl">
            <span className="text-[var(--primary)]">{mission.groupA.vars[0].type}</span> {mission.groupA.vars[0].name} = 
            <input type="text" value={var1} onChange={(e) => setVar1(e.target.value)} className="w-[80px] bg-black/30 border border-white/20 text-white p-2 rounded focus:border-[var(--primary)] focus:outline-none" disabled={sprintStage > 1 || team !== "GroupA"}/>;
          </div>
          <div className="flex items-center gap-4 mb-8 font-mono text-xl">
            <span className="text-[var(--primary)]">{mission.groupA.vars[1].type}</span> {mission.groupA.vars[1].name} = 
            <input type="text" value={var2} onChange={(e) => setVar2(e.target.value)} className="w-[80px] bg-black/30 border border-white/20 text-white p-2 rounded focus:border-[var(--primary)] focus:outline-none" disabled={sprintStage > 1 || team !== "GroupA"}/>;
          </div>

          {sprintStage === 1 && team === "GroupA" && (
            <button className="btn-primary w-full md:w-auto" onClick={handleSprint1Submit}>Submit Data to Group B</button>
          )}
          {sprintStage === 1 && team === "GroupB" && (
            <div className="flex items-center gap-2 text-[var(--text-muted)] bg-white/5 p-4 rounded text-lg">
              <Loader2 size={24} className="icon" style={{ animation: "spin 2s linear infinite" }} /> Waiting for Group A out in the field...
            </div>
          )}
        </motion.div>

        {/* Sprint 2: Group B */}
        <AnimatePresence>
          <motion.div 
            className="glass-card"
            style={{ 
              opacity: sprintStage >= 2 ? 1 : 0.5,
              borderLeft: sprintStage === 2 ? `4px solid ${mission.groupB.logic.bgClass}` : "1px solid var(--glass-border)" 
            }}
          >
            <div className="flex-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: mission.groupB.logic.bgClass }}>
                {sprintStage < 2 && <Lock size={24} />} Sprint 2: The Logic (Group B)
              </h2>
              {sprintStage > 2 ? <CheckCircle color={mission.groupB.logic.bgClass} size={28} /> : sprintStage === 2 ? <span className="badge">Active</span> : null}
            </div>
            <p className="text-[var(--text-muted)] mb-6 text-lg">
               {mission.groupB.instruction}
            </p>
            
            <div className="bg-black/30 p-6 rounded-lg font-mono mb-8 text-xl border border-white/5">
              <div><span style={{ color: mission.groupB.logic.bgClass }}>if</span> ( {mission.groupB.logic.variable} {mission.groupB.logic.operator} 
                <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} disabled={sprintStage !== 2 || team !== "GroupB"} className="w-[80px] bg-black/50 border text-white px-3 py-1 rounded mx-3 focus:outline-none" style={{ borderColor: mission.groupB.logic.bgClass }} />
              ) {"{"}</div>
              <div className="pl-12 py-2 text-[var(--text-muted)]">{mission.groupB.logic.action}</div>
              <div>{"}"}</div>
            </div>

            {sprintStage === 2 && team === "GroupB" && (
              <button 
                className="btn-primary w-full md:w-auto" 
                style={{ background: `linear-gradient(135deg, ${mission.groupB.logic.bgClass}, #000)` }}
                onClick={handleSprint2Submit}
              >
                Execute Logic
              </button>
            )}
            {sprintStage === 2 && team === "GroupA" && (
              <div className="flex items-center gap-2 text-[var(--text-muted)] bg-white/5 p-4 rounded text-lg">
                <CheckCircle size={24} className="icon" color="var(--primary)" /> Data sent! Waiting for Group B to execute logic...
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {sprintStage === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card border-2" style={{ borderColor: "var(--accent)", background: "rgba(255,158,0,0.1)" }}>
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle color="var(--accent)" size={40} />
              <h2 className="text-[var(--accent)] text-3xl font-bold">Mission Accomplished!</h2>
            </div>
            <p className="text-xl mb-6 text-white leading-relaxed">
              {mission.successMessage} <br/><br/>
              You unlocked the <strong className="text-[var(--accent)]">{mission.reward.name}</strong> for your Room!
            </p>
            
            {!rewardClaimed ? (
              <button className="btn-primary" style={{ background: "linear-gradient(135deg, var(--accent), #e85d04)" }} onClick={handleClaimReward}>
                Claim Reward (+500 XP)
              </button>
            ) : (
              <div className="badge border-[var(--accent)] text-[var(--accent)]">Reward Claimed!</div>
            )}
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
