"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UnlockedItem = {
  id: string;
  name: string;
  icon: string;
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
};

const PROGRESS_COOKIE_NAME = "codedash_progress";

function readProgressFromCookie(): { xp: number; unlockedItems: UnlockedItem[]; sprintStage: number; questionsSolved: number; teamMissionsCompleted: number } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${PROGRESS_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function writeProgressToCookie(data: { xp: number; unlockedItems: UnlockedItem[]; sprintStage: number; questionsSolved: number; teamMissionsCompleted: number }) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30;
  const json = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${PROGRESS_COOKIE_NAME}=${json}; path=/; max-age=${maxAge}; samesite=lax`;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<UnlockedItem[]>([]);
  const [sprintStage, setSprintStage] = useState(1);
  const [questionsSolved, setQuestionsSolved] = useState(0);
  const [teamMissionsCompleted, setTeamMissionsCompleted] = useState(0);
  const [hydrated, setHydrated] = useState(false);


  useEffect(() => {
    const saved = readProgressFromCookie();
    if (saved) {
      setXp(saved.xp);
      setUnlockedItems(saved.unlockedItems || []);
      setSprintStage(saved.sprintStage || 1);
      setQuestionsSolved(saved.questionsSolved || 0);
      setTeamMissionsCompleted(saved.teamMissionsCompleted || 0);
    }
    setHydrated(true);
  }, []);


  useEffect(() => {
    if (hydrated) {
      writeProgressToCookie({ xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted });
    }
  }, [xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, hydrated]);

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const unlockItem = (item: UnlockedItem) => {
    setUnlockedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const advanceSprint = () => {
    setSprintStage((prev) => Math.min(prev + 1, 3));
  };

  const incrementQuestionsSolved = () => {
    setQuestionsSolved((prev) => prev + 1);
  };

  const incrementTeamMissions = () => {
    setTeamMissionsCompleted((prev) => prev + 1);
  };

  return (
    <ProgressContext.Provider value={{
      xp, addXp, unlockedItems, unlockItem, sprintStage, advanceSprint,
      questionsSolved, incrementQuestionsSolved, teamMissionsCompleted, incrementTeamMissions
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
