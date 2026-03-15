"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { Copy, PlusSquare } from "lucide-react";

export default function RoomPage() {
  const { xp, unlockedItems } = useProgress();

  return (
    <div>
      <h1 className="page-title">The Room</h1>
      <p className="page-subtitle">Your personal space to showcase your coding achievements.</p>

      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem" }}>Trophy Wall</h2>
        <div className="badge" style={{ fontSize: "1.1rem", background: "rgba(199, 125, 255, 0.1)", border: "1px solid rgba(199, 125, 255, 0.3)" }}>
          LVL {Math.floor(xp / 100) + 1}
        </div>
      </div>

      <div className="grid-3">
        {unlockedItems.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "1rem" }}
          >
            <div style={{ fontSize: "4rem", filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))" }}>
              {item.icon}
            </div>
            <h3 style={{ color: "var(--primary-hover)" }}>{item.name}</h3>
          </motion.div>
        ))}

        {/* Empty slots for missing trophies */}
        {Array.from({ length: Math.max(0, 6 - unlockedItems.length) }).map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className="glass-card" 
            style={{ 
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
              minHeight: "200px", background: "rgba(0,0,0,0.2)", borderStyle: "dashed", opacity: 0.5 
            }}
          >
            <PlusSquare size={32} color="var(--text-muted)" />
            <span style={{ color: "var(--text-muted)", marginTop: "1rem" }}>Locked</span>
          </div>
        ))}
      </div>
    </div>
  );
}
