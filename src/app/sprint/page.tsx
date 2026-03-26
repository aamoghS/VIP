"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, getDoc, getDocs, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { User } from "firebase/auth";
import {
  CheckCircle,
  Lock,
  Users,
  ArrowRight,
  Loader2,
  Radio,
  Play,
  Target,
  Sparkles,
  Cpu,
  LogOut,
  User as UserIcon,
  Terminal,
  Trophy,
  Zap,
  Code2,
  Hash,
  X,
  RotateCcw,
  Crown,
  Medal,
  Flame,
} from "lucide-react";


type SprintState = {
  sprint1Completed: boolean;
  sprint2Completed: boolean;
  points: number;
};

type RoundResult = {
  missionId: string;
  winner: 'GroupA' | 'GroupB' | 'tie' | null;
  groupAPoints: number;
  groupBPoints: number;
};

type RoomData = {
  missionId: string;
  currentRound: number;
  totalRounds: number;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  GroupA: SprintState;
  GroupB: SprintState;
  roundHistory: RoundResult[];
};

const defaultRoomData = (missionId: string, user: User): RoomData => ({
  missionId,
  currentRound: 1,
  totalRounds: 3,
  createdBy: user.uid,
  createdByName: user.displayName || user.email || "Unknown",
  createdAt: Date.now(),
  GroupA: { sprint1Completed: false, sprint2Completed: false, points: 0 },
  GroupB: { sprint1Completed: false, sprint2Completed: false, points: 0 },
  roundHistory: [],
});

export default function SprintPage() {
  const { addXp, unlockItem, incrementTeamMissions } = useProgress();
  const { user, loading: authLoading, signIn, signUp, logout } = useAuth();

  const [missions, setMissions] = useState<any[]>([]);

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
  const [showRoundResults, setShowRoundResults] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [roundWinner, setRoundWinner] = useState<'GroupA' | 'GroupB' | 'tie' | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"create" | null>(null);

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

  // Load missions from Firestore
  useEffect(() => {
    let mounted = true;
    async function loadMissions() {
      try {
        const { getDocs, collection } = await import('firebase/firestore');
        const qSnap = await getDocs(collection(db, 'missions'));
        const loaded = qSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        if (mounted) setMissions(loaded);
      } catch (err) {
        console.error('Failed to load missions from Firestore', err);
      }
    }
    loadMissions();
    return () => { mounted = false; };
  }, []);

  // client-side session handling: ensure cookie exists and prompt for display name once
  useEffect(() => {
    // client-only cookie handling and first-time displayName prompt
    if (typeof window === 'undefined') return;
    const getClientSessionIdLocal = () => {
      const match = document.cookie.match(new RegExp(`vip_session=([^;]+)`));
      return match ? decodeURIComponent(match[1]) : null;
    };
    const setClientSessionIdLocal = (id: string) => {
      const maxAge = 60 * 60 * 24 * 30;
      document.cookie = `vip_session=${id}; path=/; max-age=${maxAge}; samesite=lax`;
    };

    const existing = getClientSessionIdLocal();
    if (!existing) {
      const gen = () => 'sess_' + Math.random().toString(36).substring(2, 14);
      const newId = gen();
      setClientSessionIdLocal(newId);
      const name = window.prompt('Welcome to codedash! Enter a display name to use:');
      if (name && name.trim()) {
        setDoc(doc(db, 'sessions', newId), { sessionId: newId, displayName: name.trim(), createdAt: Date.now(), lastActiveAt: Date.now() }, { merge: true });
      } else {
        setDoc(doc(db, 'sessions', newId), { sessionId: newId, createdAt: Date.now(), lastActiveAt: Date.now() }, { merge: true });
      }
    }
  }, []);


  const mission = roomData ? missions.find((m) => m.id === roomData.missionId) : null;

  const handleCreateRoom = async () => {
    let currentUser = user;
    if (!currentUser) {
      setAuthModalOpen(true);
      setPendingAction("create");
      return;
    }

    createRoomWithUser(currentUser);
  };

  const createRoomWithUser = async (currentUser: User) => {
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomMission = missions.length ? missions[Math.floor(Math.random() * missions.length)] : null;

    if (!randomMission) {
      setRoomError('Cannot create room – no missions available');
      return;
    }

    const newRoom = defaultRoomData(randomMission.id, currentUser);
    await setDoc(doc(db, "sprint_rooms", randomCode), newRoom);
    setSessionCode(randomCode);
  };

  const handleAuthSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isLoginMode) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }

      const authInstance = getAuth();
      await new Promise(r => setTimeout(r, 500));

      const currentUser = authInstance.currentUser;

      if (currentUser && pendingAction === "create") {
         await createRoomWithUser(currentUser);
      }

      setAuthModalOpen(false);
      setPendingAction(null);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Please check your credentials.");
    }
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
    if (!mission || !sessionCode || !roomData) return;
    if (var1 === mission.groupA.vars[0].target && var2 === mission.groupA.vars[1].target) {
      addXp(200);
      incrementTeamMissions?.();
      const newPoints = (roomData.GroupA.points || 0) + 200;
      const roomRef = doc(db, "sprint_rooms", sessionCode);
      await setDoc(roomRef, {
        GroupA: { sprint1Completed: true, sprint2Completed: false, points: newPoints }
      }, { merge: true });
    }
  };

  const handleSprint2Submit = async () => {
    if (!mission || !sessionCode || !roomData) return;
    let isCorrect = false;
    const val = parseInt(temp);
    const target = parseInt(mission.groupB.logic.target);
    const op = mission.groupB.logic.operator;
    if (op === ">" && val > target) isCorrect = true;
    if (op === "<" && val < target) isCorrect = true;
    if (op === "==" && val === target) isCorrect = true;
    if (isCorrect) {
      addXp(300);
      incrementTeamMissions?.();
      const newPoints = (roomData.GroupB.points || 0) + 300;
      const roomRef = doc(db, "sprint_rooms", sessionCode);
      await setDoc(roomRef, {
        GroupB: { sprint1Completed: true, sprint2Completed: true, points: newPoints }
      }, { merge: true });
    }
  };

  const handleCompleteRound = async () => {
    if (!sessionCode || !roomData) return;

    const groupAPoints = roomData.GroupA.points || 0;
    const groupBPoints = roomData.GroupB.points || 0;

    let winner: 'GroupA' | 'GroupB' | 'tie' | null = null;
    if (groupAPoints > groupBPoints) winner = 'GroupA';
    else if (groupBPoints > groupAPoints) winner = 'GroupB';
    else winner = 'tie';

    setRoundWinner(winner);
    setShowRoundResults(true);

    addXp(500);
    incrementTeamMissions?.();

    const roundResult: RoundResult = {
      missionId: roomData.missionId,
      winner,
      groupAPoints,
      groupBPoints
    };

    const newRoundHistory = [...(roomData.roundHistory || []), roundResult];

    // Check if this is the final round
    if (roomData.currentRound >= roomData.totalRounds) {
      setShowFinalResults(true);
      return;
    }

    // Get next mission
    const availableMissions = missions.filter(m => m.id !== roomData.missionId);
    const nextMission = availableMissions[Math.floor(Math.random() * availableMissions.length)] || missions[0];

    const roomRef = doc(db, "sprint_rooms", sessionCode);
    await setDoc(roomRef, {
      currentRound: roomData.currentRound + 1,
      missionId: nextMission.id,
      roundHistory: newRoundHistory,
      GroupA: { sprint1Completed: false, sprint2Completed: false, points: 0 },
      GroupB: { sprint1Completed: false, sprint2Completed: false, points: 0 },
    }, { merge: true });
  };

  const handleNextRound = () => {
    setShowRoundResults(false);
    setRoundWinner(null);
    setVar1("");
    setVar2("");
    setTemp("");
    setRewardClaimed(false);
  };

  const handlePlayAgain = async () => {
    if (!sessionCode) return;

    const randomMission = missions[Math.floor(Math.random() * missions.length)];
    const roomRef = doc(db, "sprint_rooms", sessionCode);

    await setDoc(roomRef, {
      missionId: randomMission.id,
      currentRound: 1,
      roundHistory: [],
      GroupA: { sprint1Completed: false, sprint2Completed: false, points: 0 },
      GroupB: { sprint1Completed: false, sprint2Completed: false, points: 0 },
    }, { merge: true });

    setShowFinalResults(false);
    setShowRoundResults(false);
    setRoundWinner(null);
    setVar1("");
    setVar2("");
    setTemp("");
    setRewardClaimed(false);
    setTeam(null);
  };

  const getTotalPoints = (teamId: 'GroupA' | 'GroupB') => {
    if (!roomData) return 0;
    const historyPoints = (roomData.roundHistory || []).reduce((sum, r) => {
      return sum + (teamId === 'GroupA' ? r.groupAPoints : r.groupBPoints);
    }, 0);
    return historyPoints + (roomData[teamId].points || 0);
  };

  let sprintStage = 1;
  if (roomData) {
    if (roomData.GroupA.sprint1Completed) sprintStage = 2;
    if (roomData.GroupA.sprint1Completed && roomData.GroupB.sprint2Completed) sprintStage = 3;
  }

  // Calculate cumulative scores from round history
  const getTeamTotalScore = (teamId: 'GroupA' | 'GroupB') => {
    if (!roomData) return 0;
    let total = 0;
    for (const round of roomData.roundHistory || []) {
      total += teamId === 'GroupA' ? round.groupAPoints : round.groupBPoints;
    }
    total += roomData[teamId].points || 0;
    return total;
  };

  // Determine overall winner
  const getOverallWinner = () => {
    if (!roomData) return null;
    const groupATotal = getTeamTotalScore('GroupA');
    const groupBTotal = getTeamTotalScore('GroupB');
    if (groupATotal > groupBTotal) return 'GroupA';
    if (groupBTotal > groupATotal) return 'GroupB';
    return 'tie';
  };

  if (!sessionCode) {
    return (
      <>
        <div className="lobby-split">

        <motion.div
          className="lobby-hero"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
            <span className="status-dot live" />
            <span style={{ color: "var(--accent-emerald)", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>Live Sprint</span>
          </div>

          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}>
            Team up.<br />
            <span style={{ color: "var(--text-muted)" }}>Solve missions.</span>
          </h1>

          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "360px" }}>
            Create a room and share the code with your teammate, or join one that&apos;s already running.
          </p>


          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "2rem" }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.375rem 0.75rem", borderRadius: "999px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.8rem", color: "var(--text-secondary)"
              }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" style={{ width: 18, height: 18, borderRadius: "50%" }} />
                ) : (
                  <UserIcon size={14} />
                )}
                {user.displayName || user.email}
              </div>
              <button
                onClick={logout}
                style={{
                  background: "none", border: "none", color: "var(--text-muted)",
                  cursor: "pointer", fontSize: "0.75rem", textDecoration: "underline",
                  textUnderlineOffset: "3px"
                }}
              >
                sign out
              </button>
            </motion.div>
          )}
        </motion.div>


        <motion.div
          className="lobby-action"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {roomMode === "choose" ? (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <motion.button
                  onClick={handleCreateRoom}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Sparkles size={18} color="rgba(255,255,255,0.9)" />
                    <span style={{ color: "white", fontSize: "1.1rem", fontWeight: 600 }}>Create Room</span>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    Start a new mission and get a code to share
                  </span>
                </motion.button>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 0.5rem" }}>
                  <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>or</span>
                  <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <motion.button
                  onClick={() => setRoomMode("join")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Hash size={18} color="var(--accent-blue)" />
                    <span style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 600 }}>Join Room</span>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Enter a room code from your teammate
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="join"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >

                <div className="terminal-chrome">
                  <div className="terminal-titlebar">
                    <div className="terminal-dots">
                      <span /><span /><span />
                    </div>
                    <span>enter code</span>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", justifyContent: "center" }}>
                    <input
                      type="text"
                      placeholder="_ _ _ _"
                      value={sessionCodeInput}
                      onChange={(e) => { setSessionCodeInput(e.target.value); setRoomError(null); }}
                      className="room-code-input"
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                </div>

                {roomError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      color: "#ef4444", background: "rgba(239,68,68,0.08)",
                      padding: "0.625rem 1rem", borderRadius: "var(--radius-sm)",
                      fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace"
                    }}
                  >
                    {roomError}
                  </motion.div>
                )}

                <motion.button
                  className="btn-primary"
                  onClick={handleJoinSession}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
                >
                  <ArrowRight size={18} style={{ marginRight: "0.5rem" }} />
                  Go
                </motion.button>

                <button
                  onClick={() => { setRoomMode("choose"); setRoomError(null); }}
                  style={{
                    background: "none", border: "none", color: "var(--text-muted)",
                    cursor: "pointer", fontSize: "0.8rem", textAlign: "center",
                  }}
                >
                  ← back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>


      <AnimatePresence>
        {authModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 100
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="terminal-chrome"
              style={{ width: "100%", maxWidth: "400px", background: "var(--bg-secondary)" }}
            >
              <div className="terminal-titlebar" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                   <div className="terminal-dots"><span /><span /><span /></div>
                   <span>{isLoginMode ? "authenticate.sh" : "register.sh"}</span>
                </div>
                <button onClick={() => setAuthModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  {isLoginMode ? "Sign In" : "Create Account"}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  You need an account to create a room.
                </p>

                {authError && (
                  <div style={{
                    background: "rgba(239, 68, 68, 0.1)", color: "#ef4444",
                    padding: "0.75rem", borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.2)"
                  }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-premium"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-premium"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
                    {isLoginMode ? "Sign In" : "Sign Up"}
                  </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <button
                    onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        setAuthError(null);
                    }}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
                  >
                    {isLoginMode ? "Need an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
    );
  }

  // Round Results Modal
  const RoundResultsModal = () => {
    if (!showRoundResults || !roomData) return null;

    const isLastRound = roomData.currentRound >= roomData.totalRounds;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "1rem"
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-lg)",
            padding: "2.5rem",
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            {roundWinner === 'tie' ? '🤝' : roundWinner === 'GroupA' ? '🏆' : '⭐'}
          </div>
          <h2 style={{
            fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)",
            marginBottom: "0.5rem"
          }}>
            Round {roomData.currentRound} Complete!
          </h2>

          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {roundWinner === 'tie'
              ? "It's a tie! Both teams performed equally well!"
              : `${roundWinner === 'GroupA' ? 'Group A' : 'Group B'} won this round!`
            }
          </p>

          <div style={{
            display: "flex", justifyContent: "center", gap: "2rem",
            marginBottom: "2rem",
          }}>
            <div style={{
              background: "rgba(99,102,241,0.1)", borderRadius: "var(--radius-md)",
              padding: "1rem 1.5rem", minWidth: "120px",
              border: roundWinner === 'GroupA' ? "2px solid var(--accent-indigo)" : "1px solid rgba(99,102,241,0.2)"
            }}>
              <div style={{ color: "var(--accent-indigo)", fontSize: "0.8rem", marginBottom: "0.25rem" }}>Group A</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {roomData.GroupA.points}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>points</div>
            </div>
            <div style={{
              background: "rgba(59,130,246,0.1)", borderRadius: "var(--radius-md)",
              padding: "1rem 1.5rem", minWidth: "120px",
              border: roundWinner === 'GroupB' ? "2px solid var(--accent-blue)" : "1px solid rgba(59,130,246,0.2)"
            }}>
              <div style={{ color: "var(--accent-blue)", fontSize: "0.8rem", marginBottom: "0.25rem" }}>Group B</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {roomData.GroupB.points}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>points</div>
            </div>
          </div>

          {!isLastRound ? (
            <motion.button
              onClick={handleNextRound}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                border: "none", borderRadius: "var(--radius-md)",
                padding: "0.875rem 2rem", cursor: "pointer",
                color: "white", fontWeight: 600, fontSize: "1rem",
                display: "inline-flex", alignItems: "center", gap: "0.5rem"
              }}
            >
              Next Round <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              onClick={() => { setShowRoundResults(false); setShowFinalResults(true); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                border: "none", borderRadius: "var(--radius-md)",
                padding: "0.875rem 2rem", cursor: "pointer",
                color: "#0a0c10", fontWeight: 600, fontSize: "1rem",
                display: "inline-flex", alignItems: "center", gap: "0.5rem"
              }}
            >
              <Trophy size={18} /> See Final Results
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    );
  };

  // Final Results Modal
  const FinalResultsModal = () => {
    if (!showFinalResults || !roomData) return null;

    const overallWinner = getOverallWinner();
    const groupATotal = getTeamTotalScore('GroupA');
    const groupBTotal = getTeamTotalScore('GroupB');

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(15px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "1rem"
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-lg)",
            padding: "3rem",
            maxWidth: "560px",
            width: "100%",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{ fontSize: "4rem", marginBottom: "1.5rem" }}
          >
            {overallWinner === 'tie' ? '🤝' : <Crown size={64} color="#f59e0b" />}
          </motion.div>

          <h2 style={{
            fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)",
            marginBottom: "0.5rem"
          }}>
            Game Complete!
          </h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "2rem" }}>
            {overallWinner === 'tie'
              ? "Both teams showed incredible teamwork!"
              : `${overallWinner === 'GroupA' ? 'Group A' : 'Group B'} is the champion!`
            }
          </p>

          {/* Score Summary */}
          <div style={{
            display: "flex", justifyContent: "center", gap: "1.5rem",
            marginBottom: "2rem", flexWrap: "wrap"
          }}>
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                background: overallWinner === 'GroupA'
                  ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))"
                  : "rgba(99,102,241,0.05)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem", minWidth: "160px",
                border: overallWinner === 'GroupA'
                  ? "2px solid var(--accent-indigo)"
                  : "1px solid rgba(99,102,241,0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {overallWinner === 'GroupA' && <Crown size={16} color="#f59e0b" />}
                <span style={{ color: "var(--accent-indigo)", fontWeight: 600 }}>Group A</span>
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {groupATotal}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>total points</div>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                background: overallWinner === 'GroupB'
                  ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))"
                  : "rgba(59,130,246,0.05)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem", minWidth: "160px",
                border: overallWinner === 'GroupB'
                  ? "2px solid var(--accent-blue)"
                  : "1px solid rgba(59,130,246,0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {overallWinner === 'GroupB' && <Crown size={16} color="#f59e0b" />}
                <span style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Group B</span>
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {groupBTotal}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>total points</div>
            </motion.div>
          </div>

          {/* Round History */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Round History
            </h3>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              {(roomData.roundHistory || []).map((round, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.625rem 1rem",
                    fontSize: "0.85rem",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>R{idx + 1}</span>
                  <span style={{
                    marginLeft: "0.5rem",
                    fontWeight: 600,
                    color: round.winner === 'GroupA' ? "var(--accent-indigo)"
                      : round.winner === 'GroupB' ? "var(--accent-blue)"
                      : "var(--text-secondary)"
                  }}>
                    {round.winner === 'GroupA' ? 'A' : round.winner === 'GroupB' ? 'B' : 'Tie'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              onClick={handlePlayAgain}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                border: "none", borderRadius: "var(--radius-md)",
                padding: "0.875rem 2rem", cursor: "pointer",
                color: "white", fontWeight: 600, fontSize: "1rem",
                display: "inline-flex", alignItems: "center", gap: "0.5rem"
              }}
            >
              <RotateCcw size={18} /> Play Again
            </motion.button>
            <motion.button
              onClick={() => { setSessionCode(null); setShowFinalResults(false); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 2rem", cursor: "pointer",
                color: "var(--text-secondary)", fontWeight: 600, fontSize: "1rem",
                display: "inline-flex", alignItems: "center", gap: "0.5rem"
              }}
            >
              Exit Room
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };


  if (!team) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: "720px", margin: "0 auto", paddingTop: "2rem" }}
      >

        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div className="status-chip live">
              <span className="status-dot live" />
              Room {sessionCode}
            </div>
          </div>

          {/* Round Progress */}
          {roomData && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              marginBottom: "1rem",
              background: "rgba(255,255,255,0.03)",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              width: "fit-content"
            }}>
              <Flame size={14} color="#f59e0b" />
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Round <strong>{roomData.currentRound}</strong> of {roomData.totalRounds}
              </span>
            </div>
          )}

          <h1 style={{
            fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-1px",
            color: "var(--text-primary)", marginBottom: "0.625rem", lineHeight: 1.15
          }}>
            {mission?.title}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "560px" }}>
            {mission?.description}
          </p>
        </div>


        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.25rem" }}>
            Pick your team
          </span>

          {/* Team Cards with Current Scores */}
          {roomData && roomData.roundHistory && roomData.roundHistory.length > 0 && (
            <div style={{
              display: "flex", gap: "1rem", marginBottom: "1rem",
              background: "rgba(255,255,255,0.02)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--accent-indigo)", fontWeight: 600, fontSize: "0.85rem" }}>A:</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{getTeamTotalScore('GroupA')}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>pts</span>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--accent-blue)", fontWeight: 600, fontSize: "0.85rem" }}>B:</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{getTeamTotalScore('GroupB')}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>pts</span>
              </div>
            </div>
          )}

          <motion.div
            className="team-card"
            data-team="a"
            onClick={() => setTeam("GroupA")}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "rgba(99, 102, 241, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Code2 size={20} color="var(--accent-indigo)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.125rem" }}>
                    Group A — {mission?.groupA.role}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{mission?.groupA.brief}</p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--text-muted)" />
            </div>
          </motion.div>

          <motion.div
            className="team-card"
            data-team="b"
            onClick={() => setTeam("GroupB")}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "rgba(59, 130, 246, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Cpu size={20} color="var(--accent-blue)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.125rem" }}>
                    Group B — {mission?.groupB.role}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{mission?.groupB.brief}</p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--text-muted)" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }


  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: "760px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "0.25rem" }}>
              {mission?.title}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Round {roomData?.currentRound}/{roomData?.totalRounds} · {team === "GroupA" ? mission?.groupA.role : mission?.groupB.role}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div className={`status-chip ${sprintStage < 3 ? "live" : "done"}`}>
              <span className={`status-dot ${sprintStage < 3 ? "live" : "idle"}`} />
              {sessionCode}
            </div>
            <div className="status-chip" style={{
              background: team === "GroupA" ? "rgba(99,102,241,0.1)" : "rgba(59,130,246,0.1)",
              color: team === "GroupA" ? "var(--accent-indigo)" : "var(--accent-blue)",
              border: `1px solid ${team === "GroupA" ? "rgba(99,102,241,0.2)" : "rgba(59,130,246,0.2)"}`,
            }}>
              <Users size={12} /> {team === "GroupA" ? "A" : "B"}
            </div>
          </div>
        </div>

        {/* Team Scores Bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem",
          background: "rgba(255,255,255,0.02)",
          padding: "1rem 1.5rem",
          borderRadius: "var(--radius-md)",
          marginBottom: "2rem",
          border: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "rgba(99,102,241,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Code2 size={16} color="var(--accent-indigo)" />
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase" }}>Group A</div>
              <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.25rem" }}>
                {getTeamTotalScore('GroupA')}
              </div>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "0.25rem",
            fontSize: "1.25rem", color: "var(--text-muted)"
          }}>
            <span>vs</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase" }}>Group B</div>
              <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.25rem" }}>
                {getTeamTotalScore('GroupB')}
              </div>
            </div>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "rgba(59,130,246,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Cpu size={16} color="var(--accent-blue)" />
            </div>
          </div>
        </div>

        {/* Round Progress Pills */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", justifyContent: "center" }}>
          {Array.from({ length: roomData?.totalRounds || 3 }).map((_, idx) => {
            const roundNum = idx + 1;
            const isComplete = roomData && idx < (roomData.roundHistory?.length || 0);
            const isCurrent = roomData && roundNum === roomData.currentRound;
            const roundWinner = roomData?.roundHistory?.[idx]?.winner;

            return (
              <div
                key={idx}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  background: isComplete
                    ? roundWinner === 'GroupA' ? "rgba(99,102,241,0.2)"
                      : roundWinner === 'GroupB' ? "rgba(59,130,246,0.2)"
                      : "rgba(245,158,11,0.2)"
                    : isCurrent ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                  border: isCurrent ? "2px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  color: isComplete
                    ? roundWinner === 'GroupA' ? "var(--accent-indigo)"
                      : roundWinner === 'GroupB' ? "var(--accent-blue)"
                      : "var(--accent-amber)"
                    : isCurrent ? "var(--text-primary)" : "var(--text-muted)"
                }}
              >
                {isComplete ? (
                  roundWinner === 'GroupA' ? <Medal size={14} />
                  : roundWinner === 'GroupB' ? <Medal size={14} />
                  : <span>🤝</span>
                ) : (
                  <span>{roundNum}</span>
                )}
                {isComplete && (
                  <span>{roundWinner === 'GroupA' ? 'A' : roundWinner === 'GroupB' ? 'B' : '='}</span>
                )}
              </div>
            );
          })}
        </div>


        <div className="sprint-timeline">


          <div className="timeline-node">
            <div className={`timeline-marker ${sprintStage > 1 ? "completed" : sprintStage === 1 ? "active" : "locked"}`}>
              {sprintStage > 1 ? <CheckCircle size={20} /> : "1"}
            </div>
            <div className="timeline-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>Data Collection</h2>
                {sprintStage === 1 && team === "GroupA" && (
                  <div className="status-chip live"><span className="status-dot live" />Your turn</div>
                )}
                {sprintStage === 1 && team === "GroupB" && (
                  <div className="status-chip waiting"><span className="status-dot waiting" />Waiting</div>
                )}
                {sprintStage > 1 && (
                  <div className="status-chip done"><CheckCircle size={12} />+200</div>
                )}
              </div>

              <div className={`sprint-stage-card ${sprintStage === 1 ? "active" : ""}`}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {mission?.groupA.instruction}
                </p>

                {/* Terminal code editor */}
                <div className="terminal-chrome">
                  <div className="terminal-titlebar">
                    <div className="terminal-dots"><span /><span /><span /></div>
                    <span>variables.java</span>
                  </div>
                  <div className="terminal-body">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <span style={{ color: "var(--accent-indigo)", fontWeight: 600 }}>{mission?.groupA.vars[0].type}</span>
                      <span>{mission?.groupA.vars[0].name}</span>
                      <span style={{ color: "var(--text-muted)" }}>=</span>
                      <input
                        type="text" value={var1} onChange={(e) => setVar1(e.target.value)}
                        disabled={sprintStage > 1 || team !== "GroupA"}
                        placeholder={mission?.groupA.vars[0].target}
                        style={{
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "4px", padding: "0.25rem 0.5rem", width: "80px",
                          color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.9rem", textAlign: "center",
                        }}
                      />
                      <span style={{ color: "var(--text-muted)" }}>;</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "var(--accent-indigo)", fontWeight: 600 }}>{mission?.groupA.vars[1].type}</span>
                      <span>{mission?.groupA.vars[1].name}</span>
                      <span style={{ color: "var(--text-muted)" }}>=</span>
                      <input
                        type="text" value={var2} onChange={(e) => setVar2(e.target.value)}
                        disabled={sprintStage > 1 || team !== "GroupA"}
                        placeholder={mission?.groupA.vars[1].target}
                        style={{
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "4px", padding: "0.25rem 0.5rem", width: "80px",
                          color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.9rem", textAlign: "center",
                        }}
                      />
                      <span style={{ color: "var(--text-muted)" }}>;</span>
                    </div>
                  </div>
                </div>

                {sprintStage === 1 && team === "GroupA" && (
                  <motion.button
                    className="btn-primary"
                    onClick={handleSprint1Submit}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{ marginTop: "1.25rem", width: "100%" }}
                  >
                    <Play size={16} style={{ marginRight: "0.375rem" }} /> Submit
                  </motion.button>
                )}
                {sprintStage === 1 && team === "GroupB" && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    color: "var(--text-muted)", fontSize: "0.85rem",
                    marginTop: "1.25rem", fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    <span className="status-dot waiting" />
                    Waiting for Group A...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Stage 2: Logic Processing ─── */}
          <div className="timeline-node">
            <div className={`timeline-marker ${sprintStage > 2 ? "completed" : sprintStage === 2 ? "active" : "locked"}`}>
              {sprintStage > 2 ? <CheckCircle size={20} /> : sprintStage >= 2 ? "2" : <Lock size={16} />}
            </div>
            <div className="timeline-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: sprintStage >= 2 ? "var(--text-primary)" : "var(--text-muted)" }}>Logic Processing</h2>
                {sprintStage === 2 && team === "GroupB" && (
                  <div className="status-chip live"><span className="status-dot live" />Your turn</div>
                )}
                {sprintStage === 2 && team === "GroupA" && (
                  <div className="status-chip waiting"><span className="status-dot waiting" />Waiting</div>
                )}
                {sprintStage > 2 && (
                  <div className="status-chip done"><CheckCircle size={12} />+300</div>
                )}
              </div>

              <div className={`sprint-stage-card ${sprintStage === 2 ? "active" : ""}`} style={{ opacity: sprintStage >= 2 ? 1 : 0.4 }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {mission?.groupB.instruction}
                </p>

                <div className="terminal-chrome">
                  <div className="terminal-titlebar">
                    <div className="terminal-dots"><span /><span /><span /></div>
                    <span>logic.java</span>
                  </div>
                  <div className="terminal-body">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
                      <span style={{ color: "var(--accent-blue)", fontWeight: 600 }}>if</span>
                      <span>(</span>
                      <span>{mission?.groupB.logic.variable}</span>
                      <span style={{ color: "var(--accent-blue)", fontWeight: 600 }}>{mission?.groupB.logic.operator}</span>
                      <input
                        type="text" value={temp} onChange={(e) => setTemp(e.target.value)}
                        disabled={sprintStage !== 2 || team !== "GroupB"}
                        placeholder="?"
                        style={{
                          background: sprintStage === 2 && team === "GroupB" ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${sprintStage === 2 && team === "GroupB" ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}`,
                          borderRadius: "4px", padding: "0.25rem 0.375rem", width: "60px",
                          color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.9rem", textAlign: "center",
                        }}
                      />
                      <span>{")"} {"{"}</span>
                    </div>
                    <div style={{ paddingLeft: "1.5rem", color: "var(--text-secondary)" }}>
                      {mission?.groupB.logic.action}
                    </div>
                    <div>{"}"}</div>
                  </div>
                </div>

                {sprintStage === 2 && team === "GroupB" && (
                  <motion.button
                    className="btn-primary"
                    onClick={handleSprint2Submit}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{ marginTop: "1.25rem", width: "100%" }}
                  >
                    <Cpu size={16} style={{ marginRight: "0.375rem" }} /> Execute
                  </motion.button>
                )}
                {sprintStage === 2 && team === "GroupA" && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    color: "var(--text-muted)", fontSize: "0.85rem",
                    marginTop: "1.25rem", fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    <CheckCircle size={14} color="var(--accent-emerald)" />
                    Data sent — waiting for Group B...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Stage 3: Mission Complete ─── */}
          <AnimatePresence>
            {sprintStage === 3 && (
              <motion.div
                className="timeline-node"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="timeline-marker completed">
                  <Trophy size={20} />
                </div>
                <div className="timeline-content">
                  <div className="victory-section">
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      {mission?.reward.icon}
                    </div>
                    <h2 style={{
                      fontSize: "1.75rem", fontWeight: 700,
                      color: "var(--accent-amber)", marginBottom: "0.75rem",
                      letterSpacing: "-0.5px"
                    }}>
                      Round Complete!
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 1.5rem" }}>
                      {mission?.successMessage}
                    </p>

                    {/* Round Score Summary */}
                    <div style={{
                      display: "flex", justifyContent: "center", gap: "1.5rem",
                      marginBottom: "1.5rem"
                    }}>
                      <div style={{
                        background: "rgba(99,102,241,0.1)",
                        padding: "0.75rem 1.25rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid rgba(99,102,241,0.2)"
                      }}>
                        <div style={{ color: "var(--accent-indigo)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Group A</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                          {roomData?.GroupA.points || 0}
                        </div>
                      </div>
                      <div style={{
                        background: "rgba(59,130,246,0.1)",
                        padding: "0.75rem 1.25rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid rgba(59,130,246,0.2)"
                      }}>
                        <div style={{ color: "var(--accent-blue)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Group B</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
                          {roomData?.GroupB.points || 0}
                        </div>
                      </div>
                    </div>

                    {!rewardClaimed ? (
                      <motion.button
                        onClick={handleCompleteRound}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: "linear-gradient(135deg, #f59e0b, #d97706)",
                          border: "none", borderRadius: "var(--radius-md)",
                          padding: "0.875rem 2rem", cursor: "pointer",
                          color: "#0a0c10", fontWeight: 700, fontSize: "0.95rem",
                          display: "inline-flex", alignItems: "center", gap: "0.5rem"
                        }}
                      >
                        {roomData && roomData.currentRound >= roomData.totalRounds
                          ? <> <Trophy size={16} /> Finish Game</>
                          : <> <ArrowRight size={16} /> Next Round</>
                        }
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)",
                          background: "rgba(245,158,11,0.1)", color: "var(--accent-amber)",
                          fontWeight: 600, fontSize: "0.9rem", border: "1px solid rgba(245,158,11,0.2)"
                        }}
                      >
                        <CheckCircle size={16} /> Claimed
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        <RoundResultsModal />
        <FinalResultsModal />
      </AnimatePresence>
    </>
  );
}