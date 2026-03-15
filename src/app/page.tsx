"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wrench, Zap, Trophy, ArrowRight } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

export default function Home() {
  const { xp } = useProgress();

  return (
    <div className="home-container">
      <header className="flex-between">
        <div>
          <h1 className="page-title">Welcome to VIP</h1>
          <p className="page-subtitle">Your mission control for learning to code.</p>
        </div>
        <div className="glass-card" style={{ padding: "1rem 2rem" }}>
          <div style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: "bold" }}>TOTAL XP</div>
          <div style={{ fontSize: "2rem", fontWeight: "900", color: "#fff" }}>{xp}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        
        <Link href="/toolbox" style={{ textDecoration: "none" }}>
          <motion.div 
            className="glass-card"
            whileHover={{ scale: 1.02 }}
            style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div style={{ background: "rgba(199, 125, 255, 0.1)", width: "60px", height: "60px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wrench size={32} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>The Toolbox</h2>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.5" }}>Practice your skills with bite-sized, drag-and-drop coding challenges.</p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[var(--primary)] font-bold">
              Enter Toolbox <ArrowRight size={18} />
            </div>
          </motion.div>
        </Link>

        <Link href="/sprint" style={{ textDecoration: "none" }}>
          <motion.div 
            className="glass-card"
            whileHover={{ scale: 1.02 }}
            style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div style={{ background: "rgba(78, 168, 222, 0.1)", width: "60px", height: "60px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={32} color="var(--secondary)" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>The Sprint</h2>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.5" }}>Team up and solve the City Reservoir crisis together.</p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[var(--secondary)] font-bold">
              Join Mission <ArrowRight size={18} />
            </div>
          </motion.div>
        </Link>

        <Link href="/room" style={{ textDecoration: "none" }}>
          <motion.div 
            className="glass-card"
            whileHover={{ scale: 1.02 }}
            style={{ height: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div style={{ background: "rgba(255, 158, 0, 0.1)", width: "60px", height: "60px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trophy size={32} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>The Room</h2>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.5" }}>Your personal trophy space. Show off what you've earned.</p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[var(--accent)] font-bold">
              View Room <ArrowRight size={18} />
            </div>
          </motion.div>
        </Link>

      </div>
    </div>
  );
}
