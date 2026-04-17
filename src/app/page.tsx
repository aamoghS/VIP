"use client";

import { motion } from "framer-motion";
import { Code2, Users, ArrowRight } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const { questionsSolved, teamMissionsCompleted } = useProgress();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  // Dynamic Date Calculation
  const now = new Date();
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d.setDate(diff));
    return mon;
  };
  
  const monday = getMonday(new Date(now));
  const dateStr = monday.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  
  const weekDates = [...Array(6)].map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } }
  };

  if (!mounted) return null;

  return (
    <div style={{ position: "relative", minHeight: "100%", width: "100%" }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* Header Section */}
        <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontFamily: "var(--font-vt323)", 
            fontSize: "6rem", 
            fontWeight: 'normal',
            color: "black", 
            textShadow: "4px 4px 0px rgba(0,0,0,0.2)",
            marginBottom: "1.5rem",
            lineHeight: 1
          }}>
            Welcome back!
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(10px)',
              padding: '0.6rem 1.25rem', 
              borderRadius: '999px',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'black', fontWeight: 700, fontSize: '0.9rem'
            }}>
              <Code2 size={16} color="black" /> 
              <span>{questionsSolved} Questions solved</span>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(10px)',
              padding: '0.6rem 1.25rem', 
              borderRadius: '999px',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'black', fontWeight: 700, fontSize: '0.9rem'
            }}>
              <Users size={16} color="black" /> 
              <span>{teamMissionsCompleted} Sprints completed</span>
            </div>
            
            <div style={{ flex: 1 }} />

            <Link href="/toolbox" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.4)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                }}
              >
                Start Learning <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Glass Pane */}
        <motion.div variants={itemVariants} style={{
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          marginTop: '4rem'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            fontWeight: 800, 
            color: 'black',
            marginBottom: '3rem' 
          }}>
            Week of {dateStr}
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '300px', position: 'relative' }}>
            {/* Y Axis Labels */}
            <div style={{ position: 'absolute', left: '-1rem', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#444', fontSize: '0.7rem', fontWeight: 600 }}>
              <span>5 questions</span>
              <span>0 questions</span>
            </div>

            {/* Bars */}
            {[
              { fill: 60 }, { fill: 0 }, { fill: 40 }, { fill: 15 }, { fill: 0 }, { fill: 0 }
            ].map((day, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '40px' }}>
                <div style={{ 
                  height: '240px', 
                  width: '8px', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  overflow: 'hidden'
                }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${day.fill}%` }}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 1, type: "spring", bounce: 0.2 }}
                    style={{ 
                      width: '100%', 
                      background: 'radial-gradient(circle at top, #a5f3fc, #06b6d4)',
                      borderRadius: '4px' 
                    }} 
                  />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'black' }}>
                  {weekDates[idx]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}