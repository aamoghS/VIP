"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export function XpBurst({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, y: 0 }}
      animate={{ scale: 1.4, opacity: 1, y: -60 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 999, pointerEvents: "none", textAlign: "center",
      }}
    >
      <div style={{
        fontSize: "3rem", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace",
        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 0 20px rgba(245,158,11,0.8))",
      }}>
        +{amount} XP ⚡
      </div>
    </motion.div>
  );
}
