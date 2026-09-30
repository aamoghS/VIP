"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { Star, Sparkles, Crown, Trophy, Gem, Code2, Users, GitBranch, Repeat2, Bug, Map, Braces } from "lucide-react";

const TrophyIcons = {
  variables: Code2,
  logic: GitBranch,
  loops: Repeat2,
  functions: Braces,
  debugging: Bug,
  algorithms: Map,
};

function renderTrophyIcon(iconKey: string, size: number = 28) {
  const Icon = TrophyIcons[iconKey as keyof typeof TrophyIcons];
  return Icon ? <Icon size={size} strokeWidth={2} /> : null;
}

const allTrophies = [
  { id: "variables", skill: "Variables", name: "Variables Wrench", desc: "Master variables and data types", color: "#a855f7", icon: "variables" },
  { id: "logic", skill: "If / else", name: "Logic Brain", desc: "Master if/else conditionals", color: "#3b82f6", icon: "logic" },
  { id: "loops", skill: "Loops", name: "Infinity Loop", desc: "Master repeating actions", color: "#10b981", icon: "loops" },
  { id: "functions", skill: "Functions", name: "Functions Flask", desc: "Master reusable code blocks", color: "#f59e0b", icon: "functions" },
  { id: "debugging", skill: "Debugging", name: "Debugging Bug", desc: "Master finding and fixing errors", color: "#ef4444", icon: "debugging" },
  { id: "algorithms", skill: "Algorithms", name: "Algorithms Map", desc: "Master step-by-step problem solving", color: "#06b6d4", icon: "algorithms" },
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
  const weakSkill = allTrophies.find(t => {
    const stat = topicStats[t.id];
    return !stat || stat.attempted === 0 || stat.correct / stat.attempted < 0.6;
  });

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
            <div className="hud" style={{
              padding: '0.2rem 0.6rem',
              background: 'var(--ink)',
              fontSize: '1.35rem',
              color: 'var(--ticket)',
              border: '3px solid var(--ink)'
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
            Locker
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", fontWeight: 400 }}>
            Trophies you clear by practicing and building.
          </p>
          {weakSkill && (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
              {weakSkill.skill} still needs work.{" "}
              <Link href={`/toolbox?topic=${weakSkill.id}`} style={{ color: "var(--accent-blue)", fontWeight: 600 }}>
                Practice it
              </Link>
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

          <motion.div
            style={{
              padding: '1.25rem 1.5rem',
              minWidth: '180px',
              flex: '1 1 180px',
              background: 'var(--bg-elevated)',
              border: '3px solid var(--ink)',
              borderRadius: 0,
              boxShadow: '4px 4px 0 var(--ticket)'
            }}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'var(--ticket)',
                border: '3px solid var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Crown size={20} color="var(--ink)" />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: 'var(--ink)' }}>{xp} XP</span>
                <span style={{ color: 'var(--ink)' }}>Lv {currentLevel + 1}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '0', overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--ink)', borderRadius: '0' }}
                />
              </div>
            </div>
          </motion.div>


          <motion.div
            style={{
              padding: '1.25rem 1.5rem',
              minWidth: '140px',
              background: 'var(--bg-elevated)',
              border: '3px solid var(--ink)',
              borderRadius: 0,
              boxShadow: '4px 4px 0 var(--ticket)',
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
        <div className="badge-premium" style={{ background: 'var(--ticket)', border: '2px solid var(--ink)', borderRadius: 0, color: 'var(--ink)' }}>
          <Trophy size={16} color="var(--accent-purple)" />
          <span>{unlockedCount} / {totalTrophies} Achievements</span>
        </div>
        <div className="status-chip" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--ink)', borderRadius: 0, color: 'var(--ink)' }}>
          <Star size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>ROLE: {currentLevel >= 5 ? 'EXPERT' : currentLevel >= 3 ? 'ADVANCED' : 'NOVICE'}</span>
        </div>
        <div className="status-chip" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--ink)', borderRadius: 0, color: 'var(--ink)' }}>
          <Gem size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>TIER: {currentLevel <= 2 ? 'BRONZE' : currentLevel <= 4 ? 'SILVER' : currentLevel <= 6 ? 'GOLD' : 'PLATINUM'}</span>
        </div>
      </motion.div>


      <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <Trophy size={22} color="var(--accent-purple)" style={{ filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.25))' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
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
                  background: 'var(--bg-elevated)',
                  border: isUnlocked ? '3px solid var(--ink)' : '3px dashed var(--ink)',
                  borderRadius: 0,
                  padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
                  opacity: isUnlocked ? 1 : 0.55,
                  boxShadow: isUnlocked ? '4px 4px 0 var(--ticket)' : 'none',
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
                  {isUnlocked ? renderTrophyIcon(unlockedItem?.icon || trophy.icon) : renderTrophyIcon(trophy.icon)}
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
                    color: 'var(--accent-emerald)',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                  >
                    <CheckCircle size={14} color="var(--accent-emerald)" />
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

          <div style={{ background: 'var(--bg-elevated)', border: '3px solid var(--ink)', borderRadius: 0, padding: '1.5rem', boxShadow: '4px 4px 0 var(--ticket)' }}>
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
                      <span style={{ color: progress >= 80 ? 'var(--accent-emerald)' : progress > 0 && progress < 60 ? 'var(--accent-rose)' : 'var(--ink)', fontWeight: 700, textTransform: 'uppercase' }}>{isComplete ? 'Done' : `${progress}%`}</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.06)', borderRadius: '0', overflow: 'hidden', position: 'relative' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ height: '100%', background: progress >= 60 ? 'var(--accent-emerald)' : 'var(--ticket)' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          </div>


          <div style={{ background: 'var(--bg-elevated)', border: '3px solid var(--ink)', borderRadius: 0, padding: '1.5rem', boxShadow: '4px 4px 0 var(--ticket)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.75rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Milestones
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { name: 'First Challenge', achieved: questionsSolved >= 1 },
                { name: '10 Questions Solved', achieved: questionsSolved >= 10 },
                { name: 'Complete a Sprint', achieved: teamMissionsCompleted >= 1 },
                { name: 'Unlock 5 Trophies', achieved: unlockedCount >= 5 },
                { name: 'Reach Level 10', achieved: currentLevel >= 10 },
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
                    background: milestone.achieved ? 'var(--accent-emerald-dim)' : 'transparent',
                    opacity: milestone.achieved ? 1 : 0.5,
                    border: milestone.achieved ? '2px solid var(--ink)' : '2px dashed var(--ink)',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                >
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
          <Users size={22} color="var(--ink)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px' }}>
            Quick Stats
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '3px solid var(--ink)', borderRadius: 0, padding: '1.25rem', boxShadow: '4px 4px 0 var(--ticket)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Questions</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{questionsSolved}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>challenges solved</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', border: '3px solid var(--ink)', borderRadius: 0, padding: '1.25rem', boxShadow: '4px 4px 0 var(--ticket)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Achievements</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ink)', fontFamily: "'JetBrains Mono', monospace" }}>{unlockedCount} / {totalTrophies}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>trophies unlocked</div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', border: '3px solid var(--ink)', borderRadius: 0, padding: '1.25rem', boxShadow: '4px 4px 0 var(--ticket)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>XP Progress</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ink)', fontFamily: "'JetBrains Mono', monospace" }}>{xp}</div>
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