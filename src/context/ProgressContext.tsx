"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

type UnlockedItem = {
  id: string;
  name: string;
  icon: string;
};

// Per-topic accuracy tracking
export type TopicStat = {
  attempted: number;
  correct: number;
};

export type TopicStats = Record<string, TopicStat>;

export type Explanation = {
  topic: string;
  text: string;
};

type ProgressContextType = {
  xp: number;
  addXp: (amount: number) => void;
  unlockedItems: UnlockedItem[];
  unlockItem: (item: UnlockedItem) => void;
  sprintStage: number;
  advanceSprint: () => void;
  questionsSolved: number;
  incrementQuestionsSolved: () => void;
  teamMissionsCompleted: number;
  incrementTeamMissions: () => void;
  topicStats: TopicStats;
  recordAnswer: (topic: string, correct: boolean) => void;
  explanations: Explanation[];
  saveExplanation: (topic: string, text: string) => void;
  resetProgress: () => void;
  playerName: string | null;
  signIn: (name: string, password: string) => Promise<string | null>;
  signUp: (name: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  currentLevel: number;
  xpPerLevel: number;
  xpToNext: number;
  levelProgress: number;
};

const STORAGE_KEY = "vip_progress";

type SavedProgress = {
  xp: number;
  unlockedItems: UnlockedItem[];
  sprintStage: number;
  questionsSolved: number;
  teamMissionsCompleted: number;
  topicStats: TopicStats;
  explanations: Explanation[];
};

const defaultProgress = (): SavedProgress => ({
  xp: 0,
  unlockedItems: [],
  sprintStage: 1,
  questionsSolved: 0,
  teamMissionsCompleted: 0,
  topicStats: {},
  explanations: [],
});

// XP requirements increase with level (exponential curve)
function getXpForLevel(level: number): number {
  // Formula: 500 * (1.2 ^ (level - 1))
  // Level 1: 500, Level 2: 600, Level 3: 720, Level 4: 864, etc.
  return Math.round(500 * Math.pow(1.2, level - 1));
}

function getLevelFromXp(xp: number): number {
  if (!Number.isFinite(xp) || xp <= 0) return 1;
  let level = 1;
  let cumulativeXp = 0;
  while (level < 100) {
    const xpForLevel = getXpForLevel(level);
    if (xp < cumulativeXp + xpForLevel) break;
    cumulativeXp += xpForLevel;
    level++;
  }
  return level;
}

function xpAtStartOfLevel(level: number): number {
  let sum = 0;
  for (let i = 1; i < level; i++) sum += getXpForLevel(i);
  return sum;
}

function getXpProgressForLevel(xp: number, level: number): number {
  if (!Number.isFinite(xp) || xp <= 0) return 0;
  const span = getXpForLevel(level);
  if (span <= 0) return 0;
  const into = xp - xpAtStartOfLevel(level);
  return Math.min(100, Math.max(0, Math.round((into / span) * 100)));
}

function getXpToNext(xp: number, level: number): number {
  if (!Number.isFinite(xp) || xp < 0) return getXpForLevel(1);
  const into = Math.max(0, xp - xpAtStartOfLevel(level));
  return Math.max(0, getXpForLevel(level) - into);
}

function readProgress(): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedProgress) : null;
  } catch {
    return null;
  }
}

function writeProgress(data: SavedProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<UnlockedItem[]>([]);
  const [sprintStage, setSprintStage] = useState(1);
  const [questionsSolved, setQuestionsSolved] = useState(0);
  const [teamMissionsCompleted, setTeamMissionsCompleted] = useState(0);
  const [topicStats, setTopicStats] = useState<TopicStats>({});
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const snapshotRef = useRef<SavedProgress>(defaultProgress());

  // Calculate level and XP progress
  const currentLevel = getLevelFromXp(xp);
  const xpPerLevel = getXpForLevel(currentLevel);
  const xpToNext = getXpToNext(xp, currentLevel);
  const levelProgress = getXpProgressForLevel(xp, currentLevel);

  const applyProgress = (saved: SavedProgress) => {
    setXp(Number.isFinite(saved.xp) ? saved.xp : 0);
    setUnlockedItems(saved.unlockedItems || []);
    setSprintStage(saved.sprintStage || 1);
    setQuestionsSolved(saved.questionsSolved || 0);
    setTeamMissionsCompleted(saved.teamMissionsCompleted || 0);
    setTopicStats(saved.topicStats || {});
    setExplanations(saved.explanations || []);
  };

  snapshotRef.current = { xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, topicStats, explanations };

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (cancel) return;
        if (data.player) {
          applyProgress(data.player.progress);
          setPlayerName(data.player.name);
        } else {
          applyProgress(readProgress() ?? defaultProgress());
          setPlayerName(null);
        }
      } catch {
        if (!cancel) applyProgress(readProgress() ?? defaultProgress());
      } finally {
        if (!cancel) setHydrated(true);
      }
    })();
    return () => { cancel = true; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const snapshot = { xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, topicStats, explanations };
    if (!playerName) {
      writeProgress(snapshot);
      return;
    }
    const timer = setTimeout(() => {
      void fetch("/api/auth", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(snapshot),
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, topicStats, explanations, hydrated, playerName]);

  const addXp = (amount: number) => setXp(prev => prev + amount);

  const unlockItem = (item: UnlockedItem) => {
    setUnlockedItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const advanceSprint = () => setSprintStage(prev => Math.min(prev + 1, 3));

  const incrementQuestionsSolved = () => setQuestionsSolved(prev => prev + 1);

  const incrementTeamMissions = () => setTeamMissionsCompleted(prev => prev + 1);

  const recordAnswer = (topic: string, correct: boolean) => {
    setTopicStats(prev => {
      const existing = prev[topic] ?? { attempted: 0, correct: 0 };
      return {
        ...prev,
        [topic]: {
          attempted: existing.attempted + 1,
          correct: existing.correct + (correct ? 1 : 0),
        },
      };
    });
  };

  const saveExplanation = (topic: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setExplanations((prev) => {
      const rest = prev.filter((item) => item.topic !== topic);
      return [...rest, { topic, text: trimmed }];
    });
  };

  const resetProgress = () => applyProgress(defaultProgress());

  const signIn = async (name: string, password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "login", name, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "Could not sign in.";
    applyProgress(data.player.progress);
    setPlayerName(data.player.name);
    return null;
  };

  const signUp = async (name: string, password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "create", name, password, progress: snapshotRef.current }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "Could not create that player.";
    applyProgress(data.player.progress);
    setPlayerName(data.player.name);
    return null;
  };

  const signOut = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    const fresh = defaultProgress();
    writeProgress(fresh);
    applyProgress(fresh);
    setPlayerName(null);
  };

  return (
    <ProgressContext.Provider value={{
      xp, addXp, unlockedItems, unlockItem, sprintStage, advanceSprint,
      questionsSolved, incrementQuestionsSolved, teamMissionsCompleted, incrementTeamMissions,
      topicStats, recordAnswer, explanations, saveExplanation, resetProgress,
      playerName, signIn, signUp, signOut,
      currentLevel, xpPerLevel, xpToNext, levelProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) throw new Error("useProgress must be used within a ProgressProvider");
  return context;
}
