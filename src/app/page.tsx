"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wrench, Zap, Trophy, ArrowRight, Star, Code2, Users } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

export default function Home() {
  const { xp, unlockedItems, questionsSolved, teamMissionsCompleted } = useProgress();
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = level * 100;
  const progressPercent = (xp % 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
    }
  };

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        <motion.div variants={itemVariants} className="flex-between" style={{ marginBottom: '3.5rem', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: "0.25rem", fontFamily: "'JetBrains Mono', monospace" }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
              SYSTEM_STATUS: <span style={{ color: '#10b981' }}>ONLINE</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>

            <div className="xp-display">
              <div className="flex-center" style={{ gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-purple)', marginBottom: '0.25rem' }}>Level</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{level}</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {xp}
                </div>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>Current</span>
                  <span>Next: {nextLevelXp}</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>


        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <div className="badge-premium" style={{ background: 'var(--accent-purple-dim)' }}>
            <Star size={16} color="var(--accent-purple)" />
            <span>{unlockedItems.length} Achievements</span>
          </div>
          <div className="status-chip" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <Code2 size={14} color="var(--text-secondary)" />
            <span style={{ color: 'var(--text-secondary)' }}>{questionsSolved} QUESTIONS SOLVED</span>
          </div>
          <div className="status-chip" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <Users size={14} color="var(--text-secondary)" />
            <span style={{ color: 'var(--text-secondary)' }}>{teamMissionsCompleted} TEAM MISSIONS</span>
          </div>
        </motion.div>


        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <motion.div variants={itemVariants}>
            <Link href="/toolbox" style={{ textDecoration: 'none' }}>
              <motion.div
                className="hero-card"
                data-variant="purple"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '320px' }}
              >
                <div className="hero-card-icon">
                  <Wrench size={32} color="var(--accent-purple)" />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '2rem' }}>
                  Practice your skills with bite-sized, interactive coding challenges. Master concepts like variables, logic, and loops.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-indigo)', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  START_PRACTICING <ArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/sprint" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -4, borderColor: 'var(--accent-blue)' }}
                style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  padding: '2rem', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s ease', cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                    <Zap size={24} color="var(--accent-blue)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.5px' }}>
                    The Sprint
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '2rem' }}>
                  Team up to solve real-world coding missions. Coordinate, collaborate, and conquer challenges together!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  JOIN_MISSION <ArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/room" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -4, borderColor: 'var(--accent-amber)' }}
                style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  padding: '2rem', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s ease', cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                    <Trophy size={24} color="var(--accent-amber)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.5px' }}>
                    The Room
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '2rem' }}>
                  Your personal trophy space. Showcase achievements, track progress through ranks, and view stats.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  VIEW_COLLECTION <ArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}