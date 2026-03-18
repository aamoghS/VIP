"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import {
  CheckCircle,
  AlertTriangle,
  Lock,
  Users,
  ArrowRight,
  Loader2,
  Key,
  Radio,
  Play,
  Shield,
  Target,
  Sparkles,
  Cpu
} from "lucide-react";

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

type TeamApiResponse = {
  state: SessionState;
  mission: MissionData;
};

async function fetchSessionState(sessionId: string): Promise<TeamApiResponse> {
  const res = await fetch(`/api/teams?sessionId=${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export default function SprintPage() {
  const queryClient = useQueryClient();
  const { addXp, unlockItem } = useProgress();

  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [roomMode, setRoomMode] = useState<"choose" | "join">("choose");
  const [team, setTeam] = useState<"GroupA" | "GroupB" | null>(null);

  const [var1, setVar1] = useState("");
  const [var2, setVar2] = useState("");
  const [temp, setTemp] = useState("");

  const [rewardClaimed, setRewardClaimed] = useState(false);

  const { data: sessionData, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session", sessionCode],
    queryFn: () => fetchSessionState(sessionCode!),
    enabled: !!sessionCode,
    refetchInterval: 2000,
  });

  const sessionState = sessionData?.state || null;
  const mission = sessionData?.mission || null;

  const submitSprintMutation = useMutation({
    mutationFn: async ({ sessionId, teamId, action, payload }: { sessionId: string; teamId: string; action: string; payload: unknown }) => {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, teamId, action, payload })
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionCode] });
    },
  });

  const handleCreateRoom = () => {
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    setSessionCode(randomCode);
  };

  const handleJoinSession = () => {
    if (sessionCodeInput.trim().length > 0) {
      setSessionCode(sessionCodeInput.trim().toUpperCase());
    }
  };

  const handleSprint1Submit = () => {
    if (!mission) return;
    if (var1 === mission.groupA.vars[0].target && var2 === mission.groupA.vars[1].target) {
      addXp(200);
      submitSprintMutation.mutate({
        sessionId: sessionCode!,
        teamId: "GroupA",
        action: "completeSprint1",
        payload: { var1, var2 }
      });
    }
  };

  const handleSprint2Submit = () => {
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
      submitSprintMutation.mutate({
        sessionId: sessionCode!,
        teamId: "GroupB",
        action: "completeSprint2",
        payload: null
      });
    }
  };

  const handleClaimReward = () => {
    if (!rewardClaimed && mission) {
      addXp(500);
      unlockItem(mission.reward);
      setRewardClaimed(true);
    }
  };

  let sprintStage = 1;
  if (sessionState) {
    if (sessionState.GroupA.sprint1Completed) sprintStage = 2;
    if (sessionState.GroupA.sprint1Completed && sessionState.GroupB.sprint2Completed) sprintStage = 3;
  }

  // 1. Session Setup Screen
  if (!sessionCode) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Radio size={28} color="var(--accent-blue)" className="animate-pulse-glow" />
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Live Session</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '3rem' }}>Mission Control</h1>
          <p className="page-subtitle text-xl max-w-2xl mx-auto">
            Create a secure room or join your teammates in a live coding mission.
          </p>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ padding: '2.5rem', width: '100%', maxWidth: '480px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {roomMode === "choose" ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <Shield size={40} color="var(--accent-indigo)" />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.75rem' }}>Lobby Access</h2>
                </div>

                <motion.button
                  className="btn-primary"
                  onClick={handleCreateRoom}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                >
                  <Sparkles size={20} style={{ marginRight: '0.5rem' }} />
                  Create New Room
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ height: '1px', background: 'var(--glass-border)', flex: 1 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                  <div style={{ height: '1px', background: 'var(--glass-border)', flex: 1 }} />
                </div>

                <motion.button
                  className="btn-secondary"
                  onClick={() => setRoomMode("join")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                >
                  Join Existing Room
                </motion.button>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center' }}>
                  <Key size={36} color="var(--accent-blue)" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.75rem', color: 'var(--accent-blue)' }}>
                    Enter Room Code
                  </h2>
                </div>

                <input
                  type="text"
                  placeholder="e.g. A1B2"
                  value={sessionCodeInput}
                  onChange={(e) => setSessionCodeInput(e.target.value)}
                  className="input-premium"
                  style={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '0.5rem',
                    padding: '1.5rem'
                  }}
                  maxLength={6}
                />

                <motion.button
                  className="btn-primary"
                  onClick={handleJoinSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                >
                  <Radio size={20} style={{ marginRight: '0.5rem' }} />
                  Connect to Session
                </motion.button>

                <button
                  onClick={() => setRoomMode("choose")}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Back to options
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Wait for mission to load
  if (!mission) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: '1.5rem' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} color="var(--accent-indigo)" />
        </motion.div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading mission data...</p>
      </div>
    );
  }

  // 2. Team Selection Screen
  if (!team) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '70vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="session-code"
            style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
          >
            {sessionCode}
          </motion.div>
          <p className="page-subtitle text-xl max-w-2xl mx-auto mt-2">
            {mission.description}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card"
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: '2.5rem',
              borderLeft: '4px solid var(--accent-indigo)'
            }}
            onClick={() => setTeam("GroupA")}
          >
            <motion.div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-indigo-dim), rgba(168, 85, 247, 0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 0 30px var(--accent-indigo-glow)'
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Users size={36} color="var(--accent-indigo)" />
            </motion.div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-indigo)', marginBottom: '0.5rem' }}>
              Group A
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{mission.groupA.role}</p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-indigo)',
              fontWeight: 600,
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-indigo-dim)',
              borderRadius: 'var(--radius-xl)'
            }}>
              Join Team <ArrowRight size={18} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card"
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: '2.5rem',
              borderLeft: '4px solid var(--accent-blue)'
            }}
            onClick={() => setTeam("GroupB")}
          >
            <motion.div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-blue-dim), rgba(59, 130, 246, 0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 0 30px var(--accent-blue-glow)'
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Users size={36} color="var(--accent-blue)" />
            </motion.div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
              Group B
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{mission.groupB.role}</p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-blue)',
              fontWeight: 600,
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-blue-dim)',
              borderRadius: 'var(--radius-xl)'
            }}>
              Join Team <ArrowRight size={18} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 3. The Live Sprint Logic UI
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div className="page-header">
          <h1 className="page-title">The Sprint</h1>
          <p className="page-subtitle">Mission: {mission.title}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div className="badge-premium" style={{ background: 'var(--bg-elevated)' }}>
            <Radio size={14} />
            <span className="session-code" style={{ fontSize: '1.25rem' }}>{sessionCode}</span>
          </div>
          <div className={`badge-premium ${team === "GroupA" ? "badge-indigo" : "badge-blue"}`}>
            <Users size={14} />
            <span style={{ fontWeight: 600 }}>Team {team === "GroupA" ? "A" : "B"}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Sprint 1: Group A */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            borderLeft: sprintStage === 1 ? '4px solid var(--accent-indigo)' : '1px solid var(--glass-border)',
            opacity: team === "GroupA" || sprintStage > 1 ? 1 : 0.5
          }}
        >
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: sprintStage > 1 ? 'var(--accent-emerald)' : (sprintStage === 1 ? 'var(--accent-indigo)' : 'var(--bg-elevated)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {sprintStage > 1 ? <CheckCircle size={18} color="white" /> : <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>1</span>}
              </div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>Sprint 1: Data Collection</h2>
            </div>
            {sprintStage === 1 && team === "GroupA" && (
              <div className="badge-premium badge-indigo" style={{ fontSize: '0.75rem' }}>Active</div>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {mission.groupA.instruction}
          </p>

          <div className="code-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--accent-indigo)', fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[0].type}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[0].name}</span>
              <span style={{ color: 'var(--text-muted)' }}>=</span>
              <input
                type="text"
                value={var1}
                onChange={(e) => setVar1(e.target.value)}
                className="input-premium"
                style={{ width: '100px', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                disabled={sprintStage > 1 || team !== "GroupA"}
                placeholder={mission.groupA.vars[0].target}
              />
              <span style={{ color: 'var(--text-muted)' }}>;</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: 'var(--accent-indigo)', fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[1].type}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[1].name}</span>
              <span style={{ color: 'var(--text-muted)' }}>=</span>
              <input
                type="text"
                value={var2}
                onChange={(e) => setVar2(e.target.value)}
                className="input-premium"
                style={{ width: '100px', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                disabled={sprintStage > 1 || team !== "GroupA"}
                placeholder={mission.groupA.vars[1].target}
              />
              <span style={{ color: 'var(--text-muted)' }}>;</span>
            </div>
          </div>

          {sprintStage === 1 && team === "GroupA" && (
            <motion.button
              className="btn-primary"
              onClick={handleSprint1Submit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              <Play size={18} style={{ marginRight: '0.5rem' }} />
              Submit Data
            </motion.button>
          )}
          {sprintStage === 1 && team === "GroupB" && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-muted)',
              background: 'var(--accent-indigo-dim)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              marginTop: '1.5rem'
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={20} />
              </motion.div>
              Waiting for Group A to complete their data...
            </div>
          )}
        </motion.div>

        {/* Sprint 2: Group B */}
        <AnimatePresence>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              opacity: sprintStage >= 2 ? 1 : 0.5,
              borderLeft: sprintStage === 2 ? '4px solid var(--accent-blue)' : '1px solid var(--glass-border)'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: sprintStage > 2 ? 'var(--accent-emerald)' : (sprintStage === 2 ? 'var(--accent-blue)' : 'var(--bg-elevated)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {sprintStage > 2 ? <CheckCircle size={18} color="white" /> : sprintStage >= 2 ? <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>2</span> : <Lock size={16} />}
                </div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>Sprint 2: Logic Processing</h2>
              </div>
              {sprintStage === 2 && team === "GroupB" && (
                <div className="badge-premium badge-blue" style={{ fontSize: '0.75rem' }}>Active</div>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {mission.groupB.instruction}
            </p>

            <div className="code-block" style={{ fontSize: '1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--accent-blue)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>if</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>(</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupB.logic.variable}</span>
                <span style={{ color: 'var(--accent-blue)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{mission.groupB.logic.operator}</span>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  disabled={sprintStage !== 2 || team !== "GroupB"}
                  className="input-premium"
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    fontSize: '1rem',
                    textAlign: 'center',
                    borderColor: mission.groupB.logic.bgClass,
                    boxShadow: sprintStage === 2 && team === "GroupB" ? `0 0 10px ${mission.groupB.logic.bgClass}40` : 'none'
                  }}
                  placeholder="?"
                />
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>) {"{"}</span>
              </div>
              <div style={{ paddingLeft: '2rem', paddingTop: '0.5rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {mission.groupB.logic.action}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>{"}"}</div>
            </div>

            {sprintStage === 2 && team === "GroupB" && (
              <motion.button
                className="btn-primary"
                onClick={handleSprint2Submit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  background: `linear-gradient(135deg, ${mission.groupB.logic.bgClass}, #1e293b)`
                }}
              >
                <Cpu size={18} style={{ marginRight: '0.5rem' }} />
                Execute Logic
              </motion.button>
            )}
            {sprintStage === 2 && team === "GroupA" && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text-muted)',
                background: 'var(--accent-blue-dim)',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '1.5rem'
              }}>
                <CheckCircle size={20} color="var(--accent-emerald)" />
                Data received! Waiting for Group B to execute logic...
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mission Complete */}
        {sprintStage === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{
              borderColor: 'var(--accent-amber)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(22, 25, 34, 0.8))',
              textAlign: 'center',
              padding: '3rem'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <AlertTriangle size={56} color="var(--accent-amber)" style={{ marginBottom: '1.5rem' }} />
            </motion.div>
            <h2 style={{ color: 'var(--accent-amber)', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Mission Accomplished!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
              {mission.successMessage}
            </p>
            <p style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>
              You unlocked <strong style={{ color: 'var(--accent-amber)' }}>{mission.reward.icon} {mission.reward.name}</strong> for your Room!
            </p>

            {!rewardClaimed ? (
              <motion.button
                className="btn-primary"
                onClick={handleClaimReward}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-amber), #d97706)',
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem'
                }}
              >
                <Sparkles size={20} style={{ marginRight: '0.5rem' }} />
                Claim Reward (+500 XP)
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="badge-premium badge-amber"
                style={{ display: 'inline-flex', padding: '1rem 2rem', fontSize: '1rem' }}
              >
                <CheckCircle size={20} />
                Reward Claimed!
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}