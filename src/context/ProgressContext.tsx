"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  resetProgress: () => void;
};

const STORAGE_KEY = "vip_progress";

type SavedProgress = {
  xp: number;
  unlockedItems: UnlockedItem[];
  sprintStage: number;
  questionsSolved: number;
  teamMissionsCompleted: number;
  topicStats: TopicStats;
};

const defaultProgress = (): SavedProgress => ({
  xp: 0,
  unlockedItems: [],
  sprintStage: 1,
  questionsSolved: 0,
  teamMissionsCompleted: 0,
  topicStats: {},
});

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readProgress() ?? defaultProgress();
    setXp(saved.xp);
    setUnlockedItems(saved.unlockedItems || []);
    setSprintStage(saved.sprintStage || 1);
    setQuestionsSolved(saved.questionsSolved || 0);
    setTeamMissionsCompleted(saved.teamMissionsCompleted || 0);
    setTopicStats(saved.topicStats || {});
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      writeProgress({ xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, topicStats });
    }
  }, [xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, topicStats, hydrated]);

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

  const resetProgress = () => {
    const fresh = defaultProgress();
    setXp(fresh.xp);
    setUnlockedItems(fresh.unlockedItems);
    setSprintStage(fresh.sprintStage);
    setQuestionsSolved(fresh.questionsSolved);
    setTeamMissionsCompleted(fresh.teamMissionsCompleted);
    setTopicStats(fresh.topicStats);
  };

  return (
    <ProgressContext.Provider value={{
      xp, addXp, unlockedItems, unlockItem, sprintStage, advanceSprint,
      questionsSolved, incrementQuestionsSolved, teamMissionsCompleted, incrementTeamMissions,
      topicStats, recordAnswer, resetProgress,
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
