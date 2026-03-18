"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wrench, Zap, Trophy, ArrowRight, Star, Code2, Users } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

export default function Home() {
  const { xp, unlockedItems } = useProgress();
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
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex-between" style={{ marginBottom: '3.5rem' }}>
          <div className="page-header">
            <h1 className="page-title">Welcome back</h1>
            <p className="page-subtitle">Ready to level up your coding skills?</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {/* Level Badge */}
            <div className="xp-display">
              <div className="flex-center" style={{ gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-purple)', marginBottom: '0.25rem' }}>Level</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{level}</div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div className="xp-label">XP</div>
                  <div className="xp-value">{xp}</div>
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

        {/* Stats Row */}
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <div className="badge-premium" style={{ background: 'var(--accent-purple-dim)' }}>
            <Star size={16} color="var(--accent-purple)" />
            <span>{unlockedItems.length} Achievements</span>
          </div>
          <div className="badge-premium" style={{ background: 'var(--accent-blue-dim)' }}>
            <Code2 size={16} color="var(--accent-blue)" />
            <span>42 Questions Solved</span>
          </div>
          <div className="badge-premium" style={{ background: 'var(--accent-amber-dim)' }}>
            <Users size={16} color="var(--accent-amber)" />
            <span>3 Team Missions</span>
          </div>
        </motion.div>

        {/* Hero Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <h3>The Toolbox</h3>
                <p>Practice your skills with bite-sized, interactive coding challenges. Master variables, logic, and loops.</p>
                <div className="hero-card-action">
                  Start Practicing <ArrowRight size={18} />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/sprint" style={{ textDecoration: 'none' }}>
              <motion.div
                className="hero-card"
                data-variant="blue"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '320px' }}
              >
                <div className="hero-card-icon">
                  <Zap size={32} color="var(--accent-blue)" />
                </div>
                <h3>The Sprint</h3>
                <p>Team up with classmates to solve real-world coding missions. Coordinate, collaborate, and conquer!</p>
                <div className="hero-card-action">
                  Join Mission <ArrowRight size={18} />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/room" style={{ textDecoration: 'none' }}>
              <motion.div
                className="hero-card"
                data-variant="amber"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '320px' }}
              >
                <div className="hero-card-icon">
                  <Trophy size={32} color="var(--accent-amber)" />
                </div>
                <h3>The Room</h3>
                <p>Your personal trophy space. Showcase achievements and track your progress through the ranks.</p>
                <div className="hero-card-action">
                  View Collection <ArrowRight size={18} />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}