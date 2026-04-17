"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import {
  CheckCircle, Lock, ArrowRight, Play, Sparkles,
  Trophy, Code2, RotateCcw, Crown, Medal, Flame, Zap,
  BookOpen, Terminal, XCircle, Users, ChevronDown,
} from "lucide-react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { MISSIONS } from "./missions";
import { SprintMission, TeamResult, freshTeam } from "./types";
import { QuizChallenge } from "./QuizChallenge";
import { XpBurst } from "./XpBurst";
import { MissionSelector } from "./MissionSelector";
import { TeamPicker } from "./TeamPicker";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SprintPage() {
  const { addXp, incrementTeamMissions } = useProgress();

  // Which mission the teacher selected
  const [selectedMission, setSelectedMission] = useState<SprintMission | null>(null);
  // Which team the student picked
  const [team, setTeam] = useState<"GroupA" | "GroupB" | null>(null);

  // Local team results (synced with Firebase)
  const [groupAResult, setGroupAResult] = useState<TeamResult>(freshTeam());
  const [groupBResult, setGroupBResult] = useState<TeamResult>(freshTeam());

  const [showFinalEnd, setShowFinalEnd] = useState(false);
  const [showXpBurst, setShowXpBurst] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  const mission = selectedMission;

  // ── Firebase Sync ────────────────────────────────────────────────────────
  useEffect(() => {
    const roomRef = doc(db, "sprint_rooms", "default");
    const unsub = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.selectedMissionId) {
          const m = MISSIONS.find(m => m.id === data.selectedMissionId);
          if (m) setSelectedMission(m);
        } else {
          setSelectedMission(null);
        }
        if (data.groupAResult) setGroupAResult(data.groupAResult);
        if (data.groupBResult) setGroupBResult(data.groupBResult);
      }
    });
    return () => unsub();
  }, []);

  const selectMissionInDb = async (m: SprintMission) => {
    const roomRef = doc(db, "sprint_rooms", "default");
    await setDoc(roomRef, {
      selectedMissionId: m.id,
      groupAResult: freshTeam(),
      groupBResult: freshTeam()
    });
  };

  // ── Quiz completion handlers ──────────────────────────────────────────────
  const handleGroupAComplete = async (correct: number, total: number) => {
    if (!mission) return;
    const pts = Math.round((correct / total) * mission.xpReward * 0.5);
    addXp(pts);
    setXpAmount(pts);
    setShowXpBurst(true);
    const result = { questionsAnswered: total, questionsCorrect: correct, points: pts, completed: true };
    setGroupAResult(result);
    // sync to Firebase
    const roomRef = doc(db, "sprint_rooms", "default");
    await updateDoc(roomRef, { groupAResult: result });
  };

  const handleGroupBComplete = async (correct: number, total: number) => {
    if (!mission) return;
    const pts = Math.round((correct / total) * mission.xpReward * 0.5);
    addXp(pts);
    setXpAmount(pts);
    setShowXpBurst(true);
    const result = { questionsAnswered: total, questionsCorrect: correct, points: pts, completed: true };
    setGroupBResult(result);
    // sync to Firebase
    const roomRef = doc(db, "sprint_rooms", "default");
    await updateDoc(roomRef, { groupBResult: result });
  };

  // Auto-show final when both done
  useEffect(() => {
    if (groupAResult.completed && groupBResult.completed && !showFinalEnd) {
      const t = setTimeout(() => setShowFinalEnd(true), 600);
      return () => clearTimeout(t);
    }
  }, [groupAResult.completed, groupBResult.completed, showFinalEnd]);

  const handlePlayAgain = async () => {
    setTeam(null);
    setShowFinalEnd(false);
    const roomRef = doc(db, "sprint_rooms", "default");
    await setDoc(roomRef, {
      groupAResult: freshTeam(),
      groupBResult: freshTeam()
    }, { merge: true });
  };

  const handleNewMission = async () => {
    setTeam(null);
    setShowFinalEnd(false);
    const roomRef = doc(db, "sprint_rooms", "default");
    await setDoc(roomRef, {
      selectedMissionId: null,
      groupAResult: freshTeam(),
      groupBResult: freshTeam()
    }, { merge: true });
  };

  const getWinner = () => {
    const a = groupAResult.points, b = groupBResult.points;
    return a > b ? "GroupA" : b > a ? "GroupB" : "tie";
  };

  // Group B unlocks after Group A is done
  const groupBUnlocked = groupAResult.completed;
  const isMyTurnActive = team === "GroupA"
    ? !groupAResult.completed
    : (groupBUnlocked && !groupBResult.completed);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Mission Selector
  // ─────────────────────────────────────────────────────────────────────────
  if (!selectedMission) {
    return <MissionSelector onSelectMission={selectMissionInDb} />;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Team picker
  // ─────────────────────────────────────────────────────────────────────────
  if (!mission) return null;

  if (!team) {
    return <TeamPicker mission={mission} onSelectTeam={setTeam} onBack={handleNewMission} />;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Game view
  // ─────────────────────────────────────────────────────────────────────────
  const teamColor = team === "GroupA" ? "#6366f1" : "#3b82f6";
  const myLabel = team === "GroupA" ? "Group A" : "Group B";

  return (
    <>
      {/* XP Burst */}
      <AnimatePresence>
        {showXpBurst && (
          <XpBurst amount={xpAmount} onDone={() => setShowXpBurst(false)} />
        )}
      </AnimatePresence>

      {/* Final Results Modal */}
      <AnimatePresence>
        {showFinalEnd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}>
            <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }}
              style={{ background: "var(--glass-surface)", borderRadius: "var(--radius-lg)", padding: "3rem", maxWidth: "520px", width: "100%", textAlign: "center", border: "1px solid var(--glass-border)", boxShadow: "var(--glass-glow)" }}>
              {(() => {
                const winner = getWinner();
                return (
                  <>
                    <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.15 }} style={{ marginBottom: "1.5rem" }}>
                      {winner === "tie"
                        ? <span style={{ fontSize: "4rem" }}>🤝</span>
                        : <Crown size={72} color="#f59e0b" style={{ filter: "drop-shadow(0 0 20px rgba(245,158,11,0.5))" }} />}
                    </motion.div>
                    <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                      Sprint Complete!
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      {mission.successMessage}
                    </p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "2rem" }}>
                      {winner === "tie" ? "Both teams tied — great effort!" : `${winner === "GroupA" ? "Group A" : "Group B"} wins this round! 🏆`}
                    </p>

                    {/* Scores */}
                    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "2rem", justifyContent: "center" }}>
                      {(["GroupA", "GroupB"] as const).map(t => {
                        const result = t === "GroupA" ? groupAResult : groupBResult;
                        const isWin = winner === t;
                        return (
                          <div key={t} style={{
                            flex: 1, padding: "1.5rem", borderRadius: "var(--radius-md)",
                            background: isWin ? (t === "GroupA" ? "rgba(99,102,241,0.15)" : "rgba(59,130,246,0.15)") : "var(--glass-surface)",
                            border: isWin ? `2px solid ${t === "GroupA" ? "#6366f1" : "#3b82f6"}` : "1px solid var(--glass-border)",
                          }}>
                            {isWin && <Crown size={20} color="#f59e0b" style={{ marginBottom: "0.5rem" }} />}
                            <div style={{ color: t === "GroupA" ? "var(--accent-indigo)" : "var(--accent-blue)", fontWeight: 700, marginBottom: "0.5rem" }}>
                              {t === "GroupA" ? "Group A" : "Group B"}
                            </div>
                            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                              {result.points}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {result.questionsCorrect}/{result.questionsAnswered} correct
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <motion.button onClick={() => { incrementTeamMissions(); handlePlayAgain(); }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", border: "none", borderRadius: "var(--radius-md)", padding: "0.875rem 1.75rem", cursor: "pointer", color: "white", fontWeight: 700, fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <RotateCcw size={16} /> Play Again
                      </motion.button>
                      <motion.button onClick={() => { incrementTeamMissions(); handleNewMission(); }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", padding: "0.875rem 1.75rem", cursor: "pointer", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <ChevronDown size={16} /> New Mission
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GAME UI ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: "820px", margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{mission.topicIcon}</span>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                {mission.title}
              </h1>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontFamily: "'JetBrains Mono', monospace" }}>
              {myLabel} — {team === "GroupA" ? mission.groupA.role : mission.groupB.role}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem",
              borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
              background: teamColor + "15", color: teamColor, border: `1px solid ${teamColor}30`,
            }}>
              <Users size={12} /> {myLabel}
            </div>
            <button
              onClick={() => setTeam(null)}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
            >
              Switch
            </button>
          </div>
        </div>

        {/* Mission Briefing / Context */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, var(--glass-surface), rgba(255,255,255,0.4))",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem 1.75rem",
            marginBottom: "1.75rem",
            display: "flex",
            gap: "1.25rem",
            alignItems: "center",
            boxShadow: "var(--glass-glow)"
          }}
        >
          <div style={{ 
            width: "50px", height: "50px", borderRadius: "12px", background: mission.topicColor + "20",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem"
          }}>
            {mission.topicIcon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.7rem", color: mission.topicColor, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem" }}>
              Mission Scenario
            </div>
            <p style={{ color: "var(--text-primary)", fontSize: "0.95rem", lineHeight: 1.6, fontWeight: 500 }}>
              {mission.description}
            </p>
          </div>
        </motion.div>

        {/* Score strip */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem",
          background: "var(--glass-surface)", padding: "0.875rem 1.5rem",
          borderRadius: "var(--radius-md)", marginBottom: "1.75rem",
          border: "1px solid var(--glass-border)",
        }}>
          {(["GroupA", "GroupB"] as const).map((t, i) => {
            const result = t === "GroupA" ? groupAResult : groupBResult;
            const tColor = t === "GroupA" ? "#6366f1" : "#3b82f6";
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {i === 1 && <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>vs</div>}
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.65rem", textTransform: "uppercase" }}>
                    {t === "GroupA" ? "Group A" : "Group B"}
                  </div>
                  <div style={{ color: result.completed ? tColor : "var(--text-primary)", fontWeight: 800, fontSize: "1.25rem", fontFamily: "'JetBrains Mono', monospace" }}>
                    {result.completed ? `${result.points} pts` : "—"}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                    {result.completed ? `${result.questionsCorrect}/${result.questionsAnswered} correct` : "In progress"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-column quiz layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {/* Group A panel */}
          <div style={{
            background: team === "GroupA" ? "var(--bg-elevated)" : "var(--glass-surface)",
            border: team === "GroupA" ? "2px solid #6366f1" : "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)", padding: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <Code2 size={16} color="#6366f1" />
              <span style={{ color: "#818cf8", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px" }}>Group A</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>— {mission.groupA.role}</span>
              {groupAResult.completed && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.25rem", color: "#10b981", fontSize: "0.75rem" }}>
                  <Zap size={12} />+{groupAResult.points} XP
                </div>
              )}
            </div>
            <QuizChallenge
              questions={mission.groupA.questions}
              onComplete={handleGroupAComplete}
              teamColor="#6366f1"
              teamName="Group A"
              isActive={team === "GroupA" && !groupAResult.completed}
              isCompleted={groupAResult.completed}
            />
          </div>

          {/* Group B panel */}
          <div style={{
            background: team === "GroupB" ? "var(--bg-elevated)" : "var(--glass-surface)",
            border: team === "GroupB" ? "2px solid #3b82f6" : "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)", padding: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <Users size={16} color="#3b82f6" />
              <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px" }}>Group B</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>— {mission.groupB.role}</span>
              {groupBResult.completed && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.25rem", color: "#10b981", fontSize: "0.75rem" }}>
                  <Zap size={12} />+{groupBResult.points} XP
                </div>
              )}
            </div>
            <QuizChallenge
              questions={mission.groupB.questions}
              onComplete={handleGroupBComplete}
              teamColor="#3b82f6"
              teamName="Group B"
              isActive={team === "GroupB" && groupBUnlocked && !groupBResult.completed}
              isCompleted={groupBResult.completed}
            />
          </div>
        </div>

        {/* Status footer & Handoff Banner */}
        <div style={{
          marginTop: "1.5rem", padding: "1.5rem",
          background: "var(--glass-surface)", borderRadius: "var(--radius-md)",
          border: "1px solid var(--glass-border)",
          display: "flex", flexDirection: "column", gap: "1rem"
        }}>
          {/* Handoff Message (Shown only when A is done and B hasn't finished) */}
          <AnimatePresence>
            {groupAResult.completed && !groupBResult.completed && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.4 }}
                style={{
                   background: "linear-gradient(to right, rgba(99,102,241,0.15), rgba(59,130,246,0.15))",
                   borderLeft: "4px solid #6366f1",
                   borderRight: "4px solid #3b82f6",
                   boxShadow: "0 4px 20px -5px rgba(99,102,241,0.3)",
                   padding: "1.25rem 1.5rem",
                   borderRadius: "var(--radius-sm)",
                   marginBottom: "1rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#818cf8", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                  <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: "inline-flex" }}>
                    <Zap size={16} />
                  </motion.div>
                  Baton Pass
                </div>
                <div style={{ color: "var(--text-primary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {mission.handoffMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <Flame size={13} color="#f59e0b" />
              <span>Group A acts as the foundation — Group B inherits their work.</span>
            </div>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ color: groupAResult.completed ? "#10b981" : "var(--text-muted)" }}>
                A: {groupAResult.completed ? "✓ Done" : `${groupAResult.questionsAnswered}/${mission.groupA.questions.length}`}
              </span>
              <span style={{ color: groupBResult.completed ? "#10b981" : groupBUnlocked ? "var(--accent-blue)" : "var(--text-muted)" }}>
                B: {groupBResult.completed ? "✓ Done" : groupBUnlocked ? `${groupBResult.questionsAnswered}/${mission.groupB.questions.length}` : "Locked"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}