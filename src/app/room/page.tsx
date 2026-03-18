"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { PlusSquare, Lock, Star, Sparkles, Crown, Trophy, Gem, Zap, Code2, Users, Target } from "lucide-react";

const allTrophies = [
  { id: "wrench", name: "Variables Wrench", icon: "🔧", desc: "Master variables", color: "#a855f7" },
  { id: "brain", name: "Logic Brain", icon: "🧠", desc: "Master logic", color: "#3b82f6" },
  { id: "loop", name: "Infinity Loop", icon: "♾️", desc: "Master loops", color: "#10b981" },
  { id: "ruler", name: "Golden Ruler", icon: "📐", desc: "Master math", color: "#f59e0b" },
  { id: "flask", name: "Science Flask", icon: "🧪", desc: "Master science", color: "#06b6d4" },
  { id: "book", name: "History Tome", icon: "📚", desc: "Master history", color: "#ec4899" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  }
};

export default function RoomPage() {
  const { xp, unlockedItems } = useProgress();
  const level = Math.floor(xp / 100) + 1;

  // Calculate level progress
  const currentLevelXp = xp % 100;
  const xpToNextLevel = 100;
  const progressPercent = (currentLevelXp / xpToNextLevel) * 100;

  // Get achievement stats
  const unlockedCount = unlockedItems.length;
  const totalTrophies = allTrophies.length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div className="page-header">
          <h1 className="page-title">Your Room</h1>
          <p className="page-subtitle">Your personal trophy space and achievements.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* Level Card */}
          <motion.div
            className="glass-card"
            style={{ padding: '1.25rem 1.75rem', minWidth: '180px' }}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px var(--accent-purple-glow)'
              }}>
                <Crown size={24} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>
                  Level
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {level}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                <span>{currentLevelXp} XP</span>
                <span>{xpToNextLevel} XP</span>
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
          </motion.div>

          {/* XP Card */}
          <motion.div
            className="glass-card"
            style={{ padding: '1.25rem 1.75rem', minWidth: '140px' }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="xp-label" style={{ marginBottom: '0.25rem' }}>Total XP</div>
            <div className="xp-value" style={{ fontSize: '1.75rem' }}>{xp}</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div className="badge-premium" style={{ background: 'var(--accent-purple-dim)' }}>
          <Trophy size={16} color="var(--accent-purple)" />
          <span>{unlockedCount} / {totalTrophies} Achievements</span>
        </div>
        <div className="badge-premium" style={{ background: 'var(--accent-blue-dim)' }}>
          <Star size={16} color="var(--accent-blue)" />
          <span>Level {level} {level >= 5 ? '- Expert' : level >= 3 ? '- Advanced' : '- Novice'}</span>
        </div>
        <div className="badge-premium" style={{ background: 'var(--accent-amber-dim)' }}>
          <Gem size={16} color="var(--accent-amber)" />
          <span>Rank {level <= 2 ? 'Bronze' : level <= 4 ? 'Silver' : level <= 6 ? 'Gold' : 'Platinum'}</span>
        </div>
      </motion.div>

      {/* Trophies Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Trophy size={24} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Trophy Wall</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}>
          {allTrophies.map((trophy, index) => {
            const isUnlocked = unlockedItems.some(item => item.id === trophy.id);
            const unlockedItem = unlockedItems.find(item => item.id === trophy.id);

            return (
              <motion.div
                key={trophy.id}
                variants={itemVariants}
                className={`trophy-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                whileHover={isUnlocked ? { scale: 1.03, y: -5 } : {}}
                style={{
                  borderColor: isUnlocked ? trophy.color : 'var(--glass-border)',
                  minHeight: '200px'
                }}
              >
                <div
                  className="trophy-icon"
                  style={{
                    fontSize: '3.5rem',
                    filter: isUnlocked ? `drop-shadow(0 0 15px ${trophy.color}80)` : 'grayscale(1) brightness(0.5)'
                  }}
                >
                  {isUnlocked ? (unlockedItem?.icon || trophy.icon) : trophy.icon}
                </div>
                <div style={{
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                    marginBottom: '0.25rem'
                  }}>
                    {isUnlocked ? (unlockedItem?.name || trophy.name) : trophy.name}
                  </h3>
                  <p style={{
                    fontSize: '0.8rem',
                    color: isUnlocked ? 'var(--text-secondary)' : 'var(--text-muted)',
                    opacity: isUnlocked ? 1 : 0.6
                  }}>
                    {isUnlocked ? 'Unlocked!' : trophy.desc}
                  </p>
                </div>
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: trophy.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle size={14} color="white" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity / Progress */}
      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sparkles size={24} color="var(--accent-purple)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Progress Overview</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {/* Skills Progress */}
          <motion.div className="glass-card" whileHover={{ y: -3 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Skills Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { name: 'Variables', icon: '🔧', progress: 80, color: '#a855f7' },
                { name: 'Logic', icon: '🧠', progress: 65, color: '#3b82f6' },
                { name: 'Loops', icon: '♾️', progress: 45, color: '#10b981' },
                { name: 'Math', icon: '📐', progress: 70, color: '#f59e0b' },
              ].map(skill => (
                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{skill.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{skill.name}</span>
                      <span style={{ color: skill.color, fontWeight: 600 }}>{skill.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ height: '100%', background: skill.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Milestones */}
          <motion.div className="glass-card" whileHover={{ y: -3 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { name: 'First Challenge', icon: '🎯', achieved: true },
                { name: '10 Questions Solved', icon: '📝', achieved: true },
                { name: 'Complete a Sprint', icon: '🏃', achieved: true },
                { name: 'Unlock 5 Trophies', icon: '🏆', achieved: unlockedCount >= 5 },
                { name: 'Reach Level 10', icon: '⬆️', achieved: level >= 10 },
              ].map(milestone => (
                <div
                  key={milestone.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: milestone.achieved ? 'var(--accent-purple-dim)' : 'rgba(0,0,0,0.2)',
                    opacity: milestone.achieved ? 1 : 0.5
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{milestone.icon}</span>
                  <span style={{
                    flex: 1,
                    color: milestone.achieved ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '0.9rem'
                  }}>
                    {milestone.name}
                  </span>
                  {milestone.achieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle size={18} color="#10b981" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CheckCircle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}