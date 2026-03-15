"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<UnlockedItem[]>([]);
  const [sprintStage, setSprintStage] = useState(1); // 1 = Stage 1, 2 = Stage 2, etc.

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
