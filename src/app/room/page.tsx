"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { Star, Sparkles, Crown, Trophy, Gem, Code2, Users } from "lucide-react";

const allTrophies = [
  { id: "variables", name: "Variables Wrench", icon: "📦", desc: "Master variables and data types", color: "#a855f7" },
  { id: "logic", name: "Logic Brain", icon: "🧠", desc: "Master if/else conditionals", color: "#3b82f6" },
  { id: "loops", name: "Infinity Loop", icon: "♾️", desc: "Master repeating actions", color: "#10b981" },
  { id: "functions", name: "Functions Flask", icon: "⚙️", desc: "Master reusable code blocks", color: "#f59e0b" },
  { id: "debugging", name: "Debugging Bug", icon: "🐛", desc: "Master finding and fixing errors", color: "#ef4444" },
  { id: "algorithms", name: "Algorithms Map", icon: "🗺️", desc: "Master step-by-step problem solving", color: "#06b6d4" },
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
  const { xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, topicStats } = useProgress();
  const level = Math.floor(xp / 100) + 1;


  const currentLevelXp = xp % 100;
  const xpToNextLevel = 100;
  const progressPercent = (currentLevelXp / xpToNextLevel) * 100;


  const unlockedCount = unlockedItems.length;
  const totalTrophies = allTrophies.length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >

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

          <motion.div
            style={{
              padding: '1.25rem 1.5rem',
              minWidth: '180px',
              background: 'var(--glass-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{ y: -2 }}
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
              <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '0', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))' }}
                />
              </div>
            </div>
          </motion.div>


          <motion.div
            style={{
              padding: '1.25rem 1.5rem',
              minWidth: '140px',
              background: 'var(--glass-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}
            whileHover={{ y: -2 }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.25rem', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL XP</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{xp}</div>
          </motion.div>
        </div>
      </motion.div>


      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div className="badge-premium" style={{ background: 'var(--accent-purple-dim)' }}>
          <Trophy size={16} color="var(--accent-purple)" />
          <span>{unlockedCount} / {totalTrophies} Achievements</span>
        </div>
        <div className="status-chip" style={{ background: 'var(--glass-surface)', borderColor: 'var(--glass-border)' }}>
          <Star size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>ROLE: {level >= 5 ? 'EXPERT' : level >= 3 ? 'ADVANCED' : 'NOVICE'}</span>
        </div>
        <div className="status-chip" style={{ background: 'var(--glass-surface)', borderColor: 'var(--glass-border)' }}>
          <Gem size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>TIER: {level <= 2 ? 'BRONZE' : level <= 4 ? 'SILVER' : level <= 6 ? 'GOLD' : 'PLATINUM'}</span>
        </div>
      </motion.div>


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
                  background: isUnlocked ? 'var(--glass-surface)' : 'rgba(255, 255, 255, 0.2)',
                  border: isUnlocked ? `1px solid ${trophy.color}` : '1px dashed rgba(0,0,0,0.15)',
                  borderRadius: 'var(--radius-sm)',
                  backdropFilter: 'blur(8px)',
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


      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sparkles size={24} color="var(--accent-purple)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Progress Overview</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>Skills Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { key: 'variables', name: 'Variables', icon: '📦', color: '#a855f7' },
                { key: 'logic', name: 'If / Else', icon: '🤔', color: '#3b82f6' },
                { key: 'loops', name: 'Loops', icon: '🔁', color: '#10b981' },
                { key: 'functions', name: 'Functions', icon: '⚙️', color: '#f59e0b' },
                { key: 'debugging', name: 'Debugging', icon: '🐛', color: '#ef4444' },
                { key: 'algorithms', name: 'Algorithms', icon: '🗺️', color: '#06b6d4' },
              ].map(skill => {
                const stat = topicStats[skill.key];
                const progress = stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
                return (
                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', width: '24px', textAlign: 'center' }}>{skill.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{skill.name.toUpperCase()}</span>
                      <span style={{ color: skill.color, fontWeight: 700 }}>{progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ height: '100%', background: skill.color }}
                      />
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>


          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'First Challenge', icon: '🎯', achieved: questionsSolved >= 1 },
                { name: '10 Questions Solved', icon: '📝', achieved: questionsSolved >= 10 },
                { name: 'Complete a Sprint', icon: '🏃', achieved: teamMissionsCompleted >= 1 },
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
                    background: milestone.achieved ? 'var(--accent-purple-dim)' : 'rgba(255, 255, 255, 0.3)',
                    opacity: milestone.achieved ? 1 : 0.5
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