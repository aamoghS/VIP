"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
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
  Cpu,
  LogIn,
  LogOut,
  User,
} from "lucide-react";

// ─── Missions (same data, kept local) ───
const missions = [
  {
    id: "reservoir",
    title: "Save the City Reservoir",
    description: "The City Reservoir is in crisis. We need two specialized teams to calculate the rainfall and design the smart lid logic.",
    groupA: {
      role: "Data Gatherers. Calculate the rate and time.",
      instruction: "The city needs to know how much rain fell. Define the variables for Rate and Time. (Hint: Rate = 5, Time = 10)",
      vars: [
        { name: "rainRate", type: "int", target: "5" },
        { name: "rainTime", type: "int", target: "10" },
      ],
    },
    groupB: {
      role: "Logic Engineers. Control the reservoir lid.",
      instruction: "The water is evaporating! Group A sent us the total volume. Now, write an if-statement to close the reservoir lid if the temperature is greater than 85.",
      logic: { variable: "temperature", operator: ">", target: "85", action: "closeReservoirLid();", bgClass: "var(--secondary)" },
    },
    successMessage: "The reservoir is safe. Group A collected the data, and Group B executed the logic just in time.",
    reward: { id: "smart-lid", name: "Smart Lid", icon: "🌐" },
  },
  {
    id: "space-station",
    title: "Defend the Space Station",
    description: "An asteroid field is approaching. Group A must calibrate the engines, and Group B must activate the shields.",
    groupA: {
      role: "Engineers. Calibrate the thrusters.",
      instruction: "We need maximum thrust to dodge the asteroids. Set Oxygen to 100 and Fuel to 50.",
      vars: [
        { name: "oxygenLevel", type: "int", target: "100" },
        { name: "fuelLevel", type: "int", target: "50" },
      ],
    },
    groupB: {
      role: "Defense Tacticians. Activate shields.",
      instruction: "Asteroids are hitting the hull! Write an if-statement to activate the shields if the hull pressure drops below 30.",
      logic: { variable: "hullPressure", operator: "<", target: "30", action: "activateShields();", bgClass: "#fca311" },
    },
    successMessage: "The space station evaded the asteroid field successfully thanks to your teamwork!",
    reward: { id: "station-shield", name: "Deflector Shield", icon: "🛡️" },
  },
  {
    id: "submarine",
    title: "Navigate the Deep Trench",
    description: "The submarine is approaching a dangerous trench. Group A sets the diving parameters, Group B pilots the vessel.",
    groupA: {
      role: "Navigators. Set the depths.",
      instruction: "We must dive quickly. Set the target Depth to 500 and Speed to 20.",
      vars: [
        { name: "targetDepth", type: "int", target: "500" },
        { name: "diveSpeed", type: "int", target: "20" },
      ],
    },
    groupB: {
      role: "Pilots. Watch the sonar.",
      instruction: "We are blind down here! Write an if-statement to fire the flare if the sonar ping equals 1.",
      logic: { variable: "sonarPing", operator: "==", target: "1", action: "fireFlare();", bgClass: "#00b4d8" },
    },
    successMessage: "You safely navigated the trench and illuminated the dark depths!",
    reward: { id: "sonar-badge", name: "Sonar Badge", icon: "🌊" },
  },
];

type SprintState = {
  sprint1Completed: boolean;
  sprint2Completed: boolean;
};

type RoomData = {
  missionId: string;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  GroupA: SprintState;
  GroupB: SprintState;
};

export default function SprintPage() {
  const { addXp, unlockItem } = useProgress();
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();

  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [roomMode, setRoomMode] = useState<"choose" | "join">("choose");
  const [team, setTeam] = useState<"GroupA" | "GroupB" | null>(null);

  const [var1, setVar1] = useState("");
  const [var2, setVar2] = useState("");
  const [temp, setTemp] = useState("");

  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);

  // Real-time Firestore listener for the room
  useEffect(() => {
    if (!sessionCode) return;

    const roomRef = doc(db, "sprint_rooms", sessionCode);
    const unsubscribe = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        setRoomData(snap.data() as RoomData);
        setRoomError(null);
      }
    });

    return () => unsubscribe();
  }, [sessionCode]);

  const mission = roomData ? missions.find((m) => m.id === roomData.missionId) : null;

  const handleCreateRoom = async () => {
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomMission = missions[Math.floor(Math.random() * missions.length)];

    const newRoom: RoomData = {
      missionId: randomMission.id,
      createdBy: user!.uid,
      createdByName: user!.displayName || "Unknown",
      createdAt: Date.now(),
      GroupA: { sprint1Completed: false, sprint2Completed: false },
      GroupB: { sprint1Completed: false, sprint2Completed: false },
    };

    await setDoc(doc(db, "sprint_rooms", randomCode), newRoom);
    setSessionCode(randomCode);
  };

  const handleJoinSession = async () => {
    const code = sessionCodeInput.trim().toUpperCase();
    if (!code) return;

    const roomRef = doc(db, "sprint_rooms", code);
    const snap = await getDoc(roomRef);

    if (!snap.exists()) {
      setRoomError("Room not found. Check the code and try again.");
      return;
    }

    setSessionCode(code);
    setRoomError(null);
  };

  const handleSprint1Submit = async () => {
    if (!mission || !sessionCode) return;
    if (var1 === mission.groupA.vars[0].target && var2 === mission.groupA.vars[1].target) {
      addXp(200);
      const roomRef = doc(db, "sprint_rooms", sessionCode);
      await setDoc(roomRef, { GroupA: { sprint1Completed: true, sprint2Completed: false } }, { merge: true });
    }
  };

  const handleSprint2Submit = async () => {
    if (!mission || !sessionCode) return;
    let isCorrect = false;
    const val = parseInt(temp);
    const target = parseInt(mission.groupB.logic.target);
    const op = mission.groupB.logic.operator;

    if (op === ">" && val > target) isCorrect = true;
    if (op === "<" && val < target) isCorrect = true;
    if (op === "==" && val === target) isCorrect = true;

    if (isCorrect) {
      addXp(300);
      const roomRef = doc(db, "sprint_rooms", sessionCode);
      await setDoc(roomRef, { GroupB: { sprint1Completed: true, sprint2Completed: true } }, { merge: true });
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
  if (roomData) {
    if (roomData.GroupA.sprint1Completed) sprintStage = 2;
    if (roomData.GroupA.sprint1Completed && roomData.GroupB.sprint2Completed) sprintStage = 3;
  }

  // ─── Auth Loading State ───
  if (authLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", gap: "1.5rem" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={48} color="var(--accent-indigo)" />
        </motion.div>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Loading...</p>
      </div>
    );
  }

  // ─── 1. Login Gate ───
  if (!user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Radio size={28} color="var(--accent-blue)" className="animate-pulse-glow" />
            <span style={{ color: "var(--accent-blue)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>Live Session</span>
          </div>
          <h1 className="page-title" style={{ fontSize: "3rem" }}>Mission Control</h1>
          <p className="page-subtitle" style={{ maxWidth: "500px", margin: "0.5rem auto 0" }}>
            Sign in with Google to create or join a live coding mission with your teammates.
          </p>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ padding: "3rem", width: "100%", maxWidth: "420px", textAlign: "center" }}
        >
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-indigo-dim), rgba(59, 130, 246, 0.1))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 0 30px var(--accent-indigo-glow)"
          }}>
            <LogIn size={36} color="var(--accent-indigo)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>Sign In Required</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
            Authentication ensures your sprint progress is tracked and your team can find you.
          </p>
          <motion.button
            className="btn-primary"
            onClick={signInWithGoogle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", padding: "1.25rem", fontSize: "1.1rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.7 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.4-4.7l-6.2-5.2C29.2 35.9 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8h-6.6C9.5 35.3 16.1 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.4 44 34 44 24c0-1.3-.2-2.7-.4-3.9z" />
            </svg>
            Sign in with Google
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── 2. Session Setup Screen (authenticated) ───
  if (!sessionCode) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Radio size={28} color="var(--accent-blue)" className="animate-pulse-glow" />
            <span style={{ color: "var(--accent-blue)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>Live Session</span>
          </div>
          <h1 className="page-title" style={{ fontSize: "3rem" }}>Mission Control</h1>
          <p className="page-subtitle text-xl max-w-2xl mx-auto">
            Create a secure room or join your teammates in a live coding mission.
          </p>
        </motion.div>

        {/* User Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}
        >
          <div className="badge-premium" style={{ background: "var(--accent-indigo-dim)", padding: "0.5rem 1rem" }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: 20, height: 20, borderRadius: "50%" }} />
            ) : (
              <User size={16} />
            )}
            <span style={{ fontWeight: 600 }}>{user.displayName || user.email}</span>
          </div>
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-md)", padding: "0.5rem 0.75rem",
              color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem",
              fontSize: "0.8rem"
            }}
          >
            <LogOut size={14} /> Sign Out
          </motion.button>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ padding: "2.5rem", width: "100%", maxWidth: "480px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {roomMode === "choose" ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                  <Shield size={40} color="var(--accent-indigo)" />
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "0.75rem" }}>Lobby Access</h2>
                </div>

                <motion.button
                  className="btn-primary"
                  onClick={handleCreateRoom}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%", padding: "1.25rem", fontSize: "1.1rem" }}
                >
                  <Sparkles size={20} style={{ marginRight: "0.5rem" }} />
                  Create New Room
                </motion.button>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ height: "1px", background: "var(--glass-border)", flex: 1 }} />
                  <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>OR</span>
                  <div style={{ height: "1px", background: "var(--glass-border)", flex: 1 }} />
                </div>

                <motion.button
                  className="btn-secondary"
                  onClick={() => setRoomMode("join")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ width: "100%", padding: "1.25rem", fontSize: "1.1rem" }}
                >
                  Join Existing Room
                </motion.button>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center" }}>
                  <Key size={36} color="var(--accent-blue)" />
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: "0.75rem", color: "var(--accent-blue)" }}>
                    Enter Room Code
                  </h2>
                </div>

                <input
                  type="text"
                  placeholder="e.g. A1B2"
                  value={sessionCodeInput}
                  onChange={(e) => { setSessionCodeInput(e.target.value); setRoomError(null); }}
                  className="input-premium"
                  style={{
                    textAlign: "center", fontSize: "2rem", fontWeight: 700,
                    letterSpacing: "0.5rem", padding: "1.5rem"
                  }}
                  maxLength={6}
                />

                {roomError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      color: "#ef4444", background: "rgba(239,68,68,0.1)",
                      padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)",
                      fontSize: "0.9rem", textAlign: "center"
                    }}
                  >
                    {roomError}
                  </motion.div>
                )}

                <motion.button
                  className="btn-primary"
                  onClick={handleJoinSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%", padding: "1.25rem", fontSize: "1.1rem" }}
                >
                  <Radio size={20} style={{ marginRight: "0.5rem" }} />
                  Connect to Session
                </motion.button>

                <button
                  onClick={() => { setRoomMode("choose"); setRoomError(null); }}
                  style={{
                    background: "none", border: "none", color: "var(--text-muted)",
                    cursor: "pointer", padding: "0.5rem", fontSize: "0.9rem"
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

  // ─── 3. Waiting for room data ───
  if (!mission) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", gap: "1.5rem" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={48} color="var(--accent-indigo)" />
        </motion.div>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Loading mission data...</p>
      </div>
    );
  }

  // ─── 4. Team Selection Screen ───
  if (!team) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "70vh" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="session-code"
            style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
          >
            {sessionCode}
          </motion.div>
          <p className="page-subtitle text-xl max-w-2xl mx-auto mt-2">
            {mission.description}
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", width: "100%", maxWidth: "800px" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card"
            style={{ cursor: "pointer", textAlign: "center", padding: "2.5rem", borderLeft: "4px solid var(--accent-indigo)" }}
            onClick={() => setTeam("GroupA")}
          >
            <motion.div
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-indigo-dim), rgba(168, 85, 247, 0.05))",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem", boxShadow: "0 0 30px var(--accent-indigo-glow)"
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Users size={36} color="var(--accent-indigo)" />
            </motion.div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent-indigo)", marginBottom: "0.5rem" }}>Group A</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{mission.groupA.role}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-indigo)", fontWeight: 600, padding: "0.75rem 1.5rem", background: "var(--accent-indigo-dim)", borderRadius: "var(--radius-xl)" }}>
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
            style={{ cursor: "pointer", textAlign: "center", padding: "2.5rem", borderLeft: "4px solid var(--accent-blue)" }}
            onClick={() => setTeam("GroupB")}
          >
            <motion.div
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-blue-dim), rgba(59, 130, 246, 0.05))",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem", boxShadow: "0 0 30px var(--accent-blue-glow)"
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Users size={36} color="var(--accent-blue)" />
            </motion.div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent-blue)", marginBottom: "0.5rem" }}>Group B</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{mission.groupB.role}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-blue)", fontWeight: 600, padding: "0.75rem 1.5rem", background: "var(--accent-blue-dim)", borderRadius: "var(--radius-xl)" }}>
              Join Team <ArrowRight size={18} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── 5. The Live Sprint UI ───
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: "2.5rem" }}>
        <div className="page-header">
          <h1 className="page-title">The Sprint</h1>
          <p className="page-subtitle">Mission: {mission.title}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
          <div className="badge-premium" style={{ background: "var(--bg-elevated)" }}>
            <Radio size={14} />
            <span className="session-code" style={{ fontSize: "1.25rem" }}>{sessionCode}</span>
          </div>
          <div className={`badge-premium ${team === "GroupA" ? "badge-indigo" : "badge-blue"}`}>
            <Users size={14} />
            <span style={{ fontWeight: 600 }}>Team {team === "GroupA" ? "A" : "B"}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Sprint 1: Group A */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            borderLeft: sprintStage === 1 ? "4px solid var(--accent-indigo)" : "1px solid var(--glass-border)",
            opacity: team === "GroupA" || sprintStage > 1 ? 1 : 0.5
          }}
        >
          <div className="flex-between" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: sprintStage > 1 ? "var(--accent-emerald)" : (sprintStage === 1 ? "var(--accent-indigo)" : "var(--bg-elevated)"),
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {sprintStage > 1 ? <CheckCircle size={18} color="white" /> : <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>1</span>}
              </div>
              <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 600 }}>Sprint 1: Data Collection</h2>
            </div>
            {sprintStage === 1 && team === "GroupA" && (
              <div className="badge-premium badge-indigo" style={{ fontSize: "0.75rem" }}>Active</div>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
            {mission.groupA.instruction}
          </p>

          <div className="code-block">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--accent-indigo)", fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[0].type}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[0].name}</span>
              <span style={{ color: "var(--text-muted)" }}>=</span>
              <input
                type="text" value={var1} onChange={(e) => setVar1(e.target.value)}
                className="input-premium"
                style={{ width: "100px", padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}
                disabled={sprintStage > 1 || team !== "GroupA"}
                placeholder={mission.groupA.vars[0].target}
              />
              <span style={{ color: "var(--text-muted)" }}>;</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "var(--accent-indigo)", fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[1].type}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupA.vars[1].name}</span>
              <span style={{ color: "var(--text-muted)" }}>=</span>
              <input
                type="text" value={var2} onChange={(e) => setVar2(e.target.value)}
                className="input-premium"
                style={{ width: "100px", padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}
                disabled={sprintStage > 1 || team !== "GroupA"}
                placeholder={mission.groupA.vars[1].target}
              />
              <span style={{ color: "var(--text-muted)" }}>;</span>
            </div>
          </div>

          {sprintStage === 1 && team === "GroupA" && (
            <motion.button className="btn-primary" onClick={handleSprint1Submit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: "1.5rem", width: "100%" }}>
              <Play size={18} style={{ marginRight: "0.5rem" }} /> Submit Data
            </motion.button>
          )}
          {sprintStage === 1 && team === "GroupB" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)", background: "var(--accent-indigo-dim)", padding: "1rem 1.5rem", borderRadius: "var(--radius-md)", marginTop: "1.5rem" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Loader2 size={20} /></motion.div>
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
              borderLeft: sprintStage === 2 ? "4px solid var(--accent-blue)" : "1px solid var(--glass-border)"
            }}
          >
            <div className="flex-between" style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: sprintStage > 2 ? "var(--accent-emerald)" : (sprintStage === 2 ? "var(--accent-blue)" : "var(--bg-elevated)"),
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {sprintStage > 2 ? <CheckCircle size={18} color="white" /> : sprintStage >= 2 ? <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>2</span> : <Lock size={16} />}
                </div>
                <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 600 }}>Sprint 2: Logic Processing</h2>
              </div>
              {sprintStage === 2 && team === "GroupB" && (
                <div className="badge-premium badge-blue" style={{ fontSize: "0.75rem" }}>Active</div>
              )}
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
              {mission.groupB.instruction}
            </p>

            <div className="code-block" style={{ fontSize: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ color: "var(--accent-blue)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>if</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>(</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{mission.groupB.logic.variable}</span>
                <span style={{ color: "var(--accent-blue)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{mission.groupB.logic.operator}</span>
                <input
                  type="text" value={temp} onChange={(e) => setTemp(e.target.value)}
                  disabled={sprintStage !== 2 || team !== "GroupB"}
                  className="input-premium"
                  style={{
                    width: "80px", padding: "0.5rem", fontSize: "1rem", textAlign: "center",
                    borderColor: mission.groupB.logic.bgClass,
                    boxShadow: sprintStage === 2 && team === "GroupB" ? `0 0 10px ${mission.groupB.logic.bgClass}40` : "none"
                  }}
                  placeholder="?"
                />
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{")"} {"{"}</span>
              </div>
              <div style={{ paddingLeft: "2rem", paddingTop: "0.5rem", color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
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
                style={{ marginTop: "1.5rem", width: "100%", background: `linear-gradient(135deg, ${mission.groupB.logic.bgClass}, #1e293b)` }}
              >
                <Cpu size={18} style={{ marginRight: "0.5rem" }} /> Execute Logic
              </motion.button>
            )}
            {sprintStage === 2 && team === "GroupA" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)", background: "var(--accent-blue-dim)", padding: "1rem 1.5rem", borderRadius: "var(--radius-md)", marginTop: "1.5rem" }}>
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
              borderColor: "var(--accent-amber)",
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(22, 25, 34, 0.8))",
              textAlign: "center", padding: "3rem"
            }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
              <AlertTriangle size={56} color="var(--accent-amber)" style={{ marginBottom: "1.5rem" }} />
            </motion.div>
            <h2 style={{ color: "var(--accent-amber)", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>Mission Accomplished!</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", marginBottom: "1.5rem", lineHeight: "1.7" }}>
              {mission.successMessage}
            </p>
            <p style={{ color: "var(--text-primary)", marginBottom: "2rem" }}>
              You unlocked <strong style={{ color: "var(--accent-amber)" }}>{mission.reward.icon} {mission.reward.name}</strong> for your Room!
            </p>

            {!rewardClaimed ? (
              <motion.button
                className="btn-primary"
                onClick={handleClaimReward}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: "linear-gradient(135deg, var(--accent-amber), #d97706)", padding: "1rem 2.5rem", fontSize: "1.1rem" }}
              >
                <Sparkles size={20} style={{ marginRight: "0.5rem" }} /> Claim Reward (+500 XP)
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="badge-premium badge-amber"
                style={{ display: "inline-flex", padding: "1rem 2rem", fontSize: "1rem" }}
              >
                <CheckCircle size={20} /> Reward Claimed!
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}