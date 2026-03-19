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
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }
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
      <motion.div variants={itemVariants} className="flex-between" style={{ marginBottom: '2.5rem', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: "0.25rem" }}>
            Your Room
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            Dashboard & Achievements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Level Card */}
          <motion.div
            style={{ 
              padding: '1.25rem 1.5rem', 
              minWidth: '180px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)'
            }}
            whileHover={{ y: -2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Crown size={20} color="var(--accent-blue)" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.125rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  Level
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {level}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>
                <span>{currentLevelXp} XP</span>
                <span>{xpToNextLevel} XP</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '0', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--accent-blue)' }}
                />
              </div>
            </div>
          </motion.div>

          {/* XP Card */}
          <motion.div
            style={{ 
              padding: '1.25rem 1.5rem', 
              minWidth: '140px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}
            whileHover={{ y: -2 }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.25rem', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL XP</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{xp}</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div className="status-chip" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <Trophy size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>{unlockedCount} / {totalTrophies} ACHIEVEMENTS</span>
        </div>
        <div className="status-chip" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <Star size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>ROLE: {level >= 5 ? 'EXPERT' : level >= 3 ? 'ADVANCED' : 'NOVICE'}</span>
        </div>
        <div className="status-chip" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <Gem size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>TIER: {level <= 2 ? 'BRONZE' : level <= 4 ? 'SILVER' : level <= 6 ? 'GOLD' : 'PLATINUM'}</span>
        </div>
      </motion.div>

      {/* Trophies Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Trophy size={18} color="var(--text-primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>Trophy Wall</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {allTrophies.map((trophy, index) => {
            const isUnlocked = unlockedItems.some(item => item.id === trophy.id);
            const unlockedItem = unlockedItems.find(item => item.id === trophy.id);

            return (
              <motion.div
                key={trophy.id}
                variants={itemVariants}
                whileHover={isUnlocked ? { y: -2 } : {}}
                style={{
                  background: isUnlocked ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)',
                  border: isUnlocked ? `1px solid ${trophy.color}` : '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
                  opacity: isUnlocked ? 1 : 0.4
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    filter: isUnlocked ? 'none' : 'grayscale(1)'
                  }}
                >
                  {isUnlocked ? (unlockedItem?.icon || trophy.icon) : trophy.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {isUnlocked ? (unlockedItem?.name || trophy.name) : trophy.name}
                  </h3>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}>
                    {isUnlocked ? 'UNLOCKED' : trophy.desc}
                  </p>
                </div>
                {isUnlocked && (
                  <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      color: trophy.color
                    }}
                  >
                    <CheckCircle size={14} color={trophy.color} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity / Progress */}
      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sparkles size={18} color="var(--text-primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>Overview</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Skills Progress */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>Skills Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { name: 'Variables', icon: '🔧', progress: 80, color: '#a855f7' },
                { name: 'Logic', icon: '🧠', progress: 65, color: '#3b82f6' },
                { name: 'Loops', icon: '♾️', progress: 45, color: '#10b981' },
                { name: 'Math', icon: '📐', progress: 70, color: '#f59e0b' },
              ].map(skill => (
                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', width: '24px', textAlign: 'center' }}>{skill.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{skill.name.toUpperCase()}</span>
                      <span style={{ color: skill.color, fontWeight: 700 }}>{skill.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
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
          </div>

          {/* Milestones */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    border: '1px solid',
                    borderColor: milestone.achieved ? 'rgba(255,255,255,0.05)' : 'transparent',
                    background: milestone.achieved ? 'rgba(255,255,255,0.02)' : 'transparent',
                    opacity: milestone.achieved ? 1 : 0.4
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{milestone.icon}</span>
                  <span style={{
                    flex: 1,
                    color: milestone.achieved ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {milestone.name}
                  </span>
                  {milestone.achieved && (
                    <CheckCircle size={14} color="#10b981" />
                  )}
                </div>
              ))}
            </div>
          </div>
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