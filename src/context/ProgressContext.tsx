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
};

const PROGRESS_COOKIE_NAME = "vip_progress";

function readProgressFromCookie(): { xp: number; unlockedItems: UnlockedItem[]; sprintStage: number } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${PROGRESS_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function writeProgressToCookie(data: { xp: number; unlockedItems: UnlockedItem[]; sprintStage: number }) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  const json = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${PROGRESS_COOKIE_NAME}=${json}; path=/; max-age=${maxAge}; samesite=lax`;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<UnlockedItem[]>([]);
  const [sprintStage, setSprintStage] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  // Restore from cookie on mount
  useEffect(() => {
    const saved = readProgressFromCookie();
    if (saved) {
      setXp(saved.xp);
      setUnlockedItems(saved.unlockedItems || []);
      setSprintStage(saved.sprintStage || 1);
    }
    setHydrated(true);
  }, []);

  // Persist to cookie on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      writeProgressToCookie({ xp, unlockedItems, sprintStage });
    }
  }, [xp, unlockedItems, sprintStage, hydrated]);

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

  return (
    <ProgressContext.Provider value={{
      xp, addXp, unlockedItems, unlockItem, sprintStage, advanceSprint
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
