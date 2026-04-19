"use client";

import React from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { Star, Sparkles, Crown, Trophy, Gem, Code2, Users } from "lucide-react";

// Trophy icons as SVG components (no emojis in UI)
const TrophyIcons = {
  variables: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v2m0 16v2M5.6 6.4L9.4 10.2m-8.5 0l3.8 3.8M20.4 10.2l-3.8 3.8m-3.2-12.8v-2m0 16v2"/><path d="M4.2 4h15.6l-3 16H7.2L4.2 4z"/><path d="M12 9a4 4 0 0 0-4 4c0 1.5.8 2.7 2 3.5L12 19l2-2.5c1.2-.8 2-2 2-3.5a4 4 0 0 0-4-4Z"/></svg>,
  logic: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  loops: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M21.5 22a1 1 0 0 0 1-1 1 1 0 0 0-1-1h-2m5 2h-5"/><path d="M21.5 2a1 1 0 0 0 1 1v2H2v-2a1 1 0 0 0 1-1"/></svg>,
  functions: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18a3 3 0 0 0 3 3 3 3 0 0 0 3-3"/><path d="M9 3a3 3 0 0 0 3-3 3 3 0 0 0-3 3"/><path d="M9 3v12a3 3 0 0 0 6 0V3"/><path d="M15 21l-6 0"/></svg>,
  debugging: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10a2 2 0 0 1-2-2v-2m0 0a2 2 0 0 0-4 0v2m0 0H6m6 0a2 2 0 0 0-2 2v2m0 0a2 2 0 0 1-2 2h-2m0 0V6"/><path d="M18 14a2 2 0 0 1-2 2h-2"/></svg>,
  algorithms: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l6-6"/><path d="M15 9l9 9"/><path d="M21 3l-6 6"/><path d="M3 9l9 9"/></svg>,
};

function renderTrophyIcon(iconKey: string, size: number = 24) {
  const Icon = TrophyIcons[iconKey as keyof typeof TrophyIcons];
  return Icon ? <Icon /> : null;
}

function getTrophyIconComponent(iconKey: string, size: number = 24) {
  const Icon = TrophyIcons[iconKey as keyof typeof TrophyIcons];
  return Icon ? <Icon width={size} height={size} /> : null;
}

const allTrophies = [
  { id: "variables", name: "Variables Wrench", desc: "Master variables and data types", color: "#a855f7", icon: "variables" },
  { id: "logic", name: "Logic Brain", desc: "Master if/else conditionals", color: "#3b82f6", icon: "logic" },
  { id: "loops", name: "Infinity Loop", desc: "Master repeating actions", color: "#10b981", icon: "loops" },
  { id: "functions", name: "Functions Flask", desc: "Master reusable code blocks", color: "#f59e0b", icon: "functions" },
  { id: "debugging", name: "Debugging Bug", desc: "Master finding and fixing errors", color: "#ef4444", icon: "debugging" },
  { id: "algorithms", name: "Algorithms Map", desc: "Master step-by-step problem solving", color: "#06b6d4", icon: "algorithms" },
];

const containerVariants = {
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
  const { xp, unlockedItems, sprintStage, questionsSolved, teamMissionsCompleted, topicStats, currentLevel, xpPerLevel, levelProgress } = useProgress();

  const currentLevelXp = xp - 0;
  const xpToNextLevel = 600;
  const progressPercent = levelProgress;


  const unlockedCount = unlockedItems.length;
  const totalTrophies = allTrophies.length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >

      <motion.div variants={itemVariants} style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              padding: '0.5rem 0.75rem',
              background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.5px',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              LEVEL {currentLevel}
            </div>
            <span style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              {currentLevel >= 5 ? 'EXPERT' : currentLevel >= 3 ? 'ADVANCED' : 'NOVICE'}
            </span>
          </div>
          <h1 style={{ fontSize: "2.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: "0.25rem", lineHeight: 1 }}>
            Your Room
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", fontWeight: 400, opacity: 0.8 }}>
            Dashboard & Achievements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>

          <motion.div
            style={{
              padding: '1.25rem 1.5rem',
              minWidth: '180px',
              background: 'var(--glass-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
            }}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4), inset 0 -2px 4px rgba(0,0,0,0.1)'
              }}>
                <Crown size={20} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.125rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  Level
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {currentLevel}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: 'var(--accent-purple)' }}>{xp} XP</span>
                <span style={{ color: 'var(--accent-blue)' }}>Reach Level {currentLevel + 1}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '0', overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #a855f7, #8b5cf6, #6366f1)', borderRadius: '0' }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%)',
                  pointerEvents: 'none'
                }}/>
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
          <span style={{ color: 'var(--text-secondary)' }}>ROLE: {currentLevel >= 5 ? 'EXPERT' : currentLevel >= 3 ? 'ADVANCED' : 'NOVICE'}</span>
        </div>
        <div className="status-chip" style={{ background: 'var(--glass-surface)', borderColor: 'var(--glass-border)' }}>
          <Gem size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>TIER: {currentLevel <= 2 ? 'BRONZE' : currentLevel <= 4 ? 'SILVER' : currentLevel <= 6 ? 'GOLD' : 'PLATINUM'}</span>
        </div>
      </motion.div>


      <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <Trophy size={22} color="var(--accent-purple)" style={{ filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.25))' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', WebkitBackgroundClip: 'text', color: 'transparent', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Trophy Wall
          </h2>
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
                  background: isUnlocked
                    ? `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%)`
                    : 'rgba(255, 255, 255, 0.15)',
                  border: isUnlocked
                    ? `1px solid ${trophy.color}`
                    : '1px dashed rgba(0,0,0,0.12)',
                  borderRadius: 'var(--radius-sm)',
                  backdropFilter: 'blur(8px)',
                  padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
                  opacity: isUnlocked ? 1 : 0.5,
                  boxShadow: isUnlocked
                    ? `0 8px 24px rgba(${trophy.color.replace('#', '')}, 0.15)`
                    : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRight: isUnlocked ? `4px solid ${trophy.color}` : 'none'
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    filter: isUnlocked ? 'none' : 'grayscale(0.8) blur(0.3px)',
                    transform: isUnlocked ? 'scale(1)' : 'scale(0.85)'
                  }}
                >
                  {isUnlocked ? renderTrophyIcon(unlockedItem?.iconKey || trophy.icon) : renderTrophyIcon(trophy.icon)}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: '1.3',
                    maxHeight: '2.6rem',
                    overflow: 'hidden'
                  }}>
                    {isUnlocked ? (unlockedItem?.name || trophy.name) : trophy.name}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    opacity: isUnlocked ? 1 : 0.4,
                    lineHeight: '1.4'
                  }}>
                    {isUnlocked ? 'UNLOCKED' : trophy.desc}
                  </p>
                </div>
                {isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    color: trophy.color,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <Sparkles size={24} color="var(--accent-purple)" style={{ filter: 'drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3))' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
            Progress Overview
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.75rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `2px solid var(--accent-purple)`, paddingBottom: '0.5rem' }}>
              Skills Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { key: 'variables', name: 'Variables', iconKey: 'variables', color: '#a855f7' },
                { key: 'logic', name: 'If / Else', iconKey: 'logic', color: '#3b82f6' },
                { key: 'loops', name: 'Loops', iconKey: 'loops', color: '#10b981' },
                { key: 'functions', name: 'Functions', iconKey: 'functions', color: '#f59e0b' },
                { key: 'debugging', name: 'Debugging', iconKey: 'debugging', color: '#ef4444' },
                { key: 'algorithms', name: 'Algorithms', iconKey: 'algorithms', color: '#06b6d4' },
              ].map((skill, idx) => {
                const stat = topicStats[skill.key];
                const progress = stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
                const isComplete = progress >= 100;
                return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.03)', transition: 'all 0.2s ease', cursor: 'default' }}
                >
                  {renderTrophyIcon(skill.iconKey, 20)}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{skill.name.toUpperCase()}</span>
                      <span style={{ color: skill.color, fontWeight: 700, textTransform: 'uppercase' }}>{isComplete ? '✓ COMPLETE' : progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.06)', borderRadius: '0', overflow: 'hidden', position: 'relative' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)` }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%)',
                        pointerEvents: 'none'
                      }}/>
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          </div>


          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.75rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Milestones
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { name: 'First Challenge', icon: '🎯', achieved: questionsSolved >= 1 },
                { name: '10 Questions Solved', icon: '📝', achieved: questionsSolved >= 10 },
                { name: 'Complete a Sprint', icon: '🏃', achieved: teamMissionsCompleted >= 1 },
                { name: 'Unlock 5 Trophies', icon: '🏆', achieved: unlockedCount >= 5 },
                { name: 'Reach Level 10', icon: '🚀', achieved: level >= 10 },
              ].map((milestone, index) => (
                <motion.div
                  key={milestone.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: milestone.achieved
                      ? `linear-gradient(90deg, ${milestone.achieved ? 'var(--accent-purple-dim)' : 'rgba(255,255,255,0.15)'} 0%, transparent 100%)`
                      : 'rgba(255, 255, 255, 0.1)',
                    opacity: milestone.achieved ? 1 : 0.5,
                    borderLeft: milestone.achieved ? `3px solid ${index % 2 === 0 ? '#a855f7' : '#3b82f6'}` : 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', flexShrink: 0, lineHeight: 1 }}>{milestone.icon}</span>
                  <span style={{
                    flex: 1,
                    color: milestone.achieved ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {milestone.name}
                  </span>
                  {milestone.achieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle size={14} color="#10b981" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <Users size={22} color="var(--accent-blue)" style={{ filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.25))' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
            Quick Stats
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Questions</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{questionsSolved}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>challenges solved</div>
          </div>

          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Achievements</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-purple)', fontFamily: "'JetBrains Mono', monospace" }}>{unlockedCount} / {totalTrophies}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>trophies unlocked</div>
          </div>

          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>XP Progress</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: "'JetBrains Mono', monospace" }}>{xp}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}><motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ opacity: 0.7 }}>current XP</motion.span></div>
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