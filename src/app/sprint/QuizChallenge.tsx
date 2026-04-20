"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, BookOpen, Terminal, CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react";
import { QuizQuestion } from "./types";

export function QuizChallenge({
  questions, onComplete, teamColor, teamName, isActive, isCompleted,
}: {
  questions: QuizQuestion[];
  onComplete: (correct: number, total: number) => void;
  teamColor: string;
  teamName: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIndex];
  const isCorrect = selected === q?.answer;

  // Get next question - simple sequential progression
  const nextQIndex = useCallback(() => {
    if (qIndex + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setQIndex(qIndex + 1);
  }, [qIndex, questions.length]);

  const handleSelect = (opt: string) => {
    if (revealed || !isActive) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === q.answer) setCorrectCount(c => c + 1);
  };

  const handleNext = useCallback(() => {
    nextQIndex();
  }, [nextQIndex]);

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "2.25rem", background: `${teamColor}15`,
          border: `3px solid ${teamColor}40`, borderRadius: "var(--radius-lg)",
          textAlign: "center", boxShadow: `0 12px 40px -8px ${teamColor}30, 4px 4px 0px ${teamColor}30`,
          position: "relative", overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: `radial-gradient(circle, ${teamColor}25 0%, transparent 70%)` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
          style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</motion.div>
        <div style={{ color: teamColor, fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Challenge Complete!</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
          {teamName} successfully finished their round
        </div>

        {/* Pixel corner accents */}
        <div style={{ position: "absolute", top: "-3px", left: "-3px", width: "12px", height: "12px", background: teamColor, border: "3px solid " + teamColor }} />
        <div style={{ position: "absolute", bottom: "-3px", right: "-3px", width: "12px", height: "12px", background: teamColor, border: "3px solid " + teamColor }} />
      </motion.div>
    );
  }

  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: "2rem",
          background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
          border: "3px dashed rgba(255,255,255,0.2)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          minHeight: "240px", position: "relative"
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          style={{
            background: "rgba(0,0,0,0.1)", width: "72px", height: "72px",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", marginBottom: "1rem", border: "2px solid rgba(255,255,255,0.15)"
          }}
        >
          <Lock size={30} color="#94a3b8" />
        </motion.div>
        <h3 style={{ color: "var(--text-primary)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "-0.25px" }}>
          Group B is Locked
        </h3>
        <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Waiting for Group A to clear their path first...
        </div>

        {/* Corner accents */}
        <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "14px", height: "14px", background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.15)" }} />
      </motion.div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          padding: "2.5rem", background: `linear-gradient(135deg, ${teamColor}15 0%, ${teamColor}05 100%)`,
          border: `3px solid ${teamColor}40`, borderRadius: "var(--radius-lg)",
          textAlign: "center", position: "relative", overflow: "hidden"
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ position: "absolute", top: "-60px", right: "-60px", width: "180px", height: "180px", background: `radial-gradient(circle, ${teamColor}25 0%, transparent 70%)` }}
        />
        <motion.div initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0.6 }}
          style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🎯</motion.div>
        <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.7rem", marginBottom: "0.5rem" }}>
          Answers Submitted!
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Awesome job. Awaiting synchronization...
        </div>

        {/* Pixel corner accents */}
        <div style={{ position: "absolute", top: "-4px", left: "-4px", width: "14px", height: "14px", background: teamColor }} />
        <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "14px", height: "14px", background: teamColor }} />
      </motion.div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Progress bar - chunky style */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "8px", borderRadius: "4px",
            background: i < qIndex ? teamColor : i === qIndex ? `${teamColor}70` : "rgba(0,0,0,0.1)",
            transition: "background 0.3s",
            border: i < qIndex ? `none` : i === qIndex ? `2px solid ${teamColor}` : "none",
          }} />
        ))}
      </div>

      {/* Question counter */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.625rem",
        marginBottom: "1.25rem", fontSize: "0.75rem", color: "var(--text-muted)",
        fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1.2px",
        background: "rgba(0,0,0,0.1)", padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <BookOpen size={14} />
        Question {qIndex + 1} of {questions.length}
      </div>

      {/* Prompt */}
      <p style={{ color: "var(--text-primary)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1rem", fontWeight: 500, textAlign: "center" }}>
        {q.prompt}
      </p>

      {/* Code block */}
      {q.code && (
        <div style={{
          background: "rgba(0, 0, 0, 0.3)", border: "2px solid var(--glass-border)",
          borderRadius: "var(--radius-sm)", padding: "1.25rem 1.5rem",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem",
          color: "var(--text-primary)", marginBottom: "1.5rem",
          whiteSpace: "pre", overflowX: "auto", position: "relative"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", opacity: 0.5 }}>
            <Terminal size={14} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "1px", textTransform: "uppercase" }}>Python</span>
          </div>
          {q.code}

          {/* Scanline effect on code */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)"
          }} />
        </div>
      )}

      {/* Options - chunky buttons with better contrast */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const correct = opt === q.answer;
          let bg = "var(--glass-surface)";
          let border = "2px solid var(--glass-border)";
          let color = "var(--text-primary)";
          if (revealed) {
            if (correct) { bg = "rgba(16,185,129,0.15)"; border = "3px solid #10b981"; color = "#10b981"; }
            else if (isSelected) { bg = "rgba(239,68,68,0.15)"; border = "3px solid #ef4444"; color = "#ef4444"; }
          } else if (isSelected) {
            bg = `${teamColor}15`; border = `3px solid ${teamColor}`;
          }
          return (
            <motion.button
              key={opt}
              whileHover={!revealed ? { x: 4, scale: 1.01 } : {}}
              whileTap={!revealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              style={{
                padding: "1.125rem 1.25rem", background: bg, border, borderRadius: "var(--radius-sm)",
                cursor: revealed ? "default" : "pointer", textAlign: "left",
                color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem",
                display: "flex", alignItems: "center", gap: "1rem", transition: "all 0.2s",
                boxShadow: isSelected && !revealed ? `0 4px 0px ${border}` : "none",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              <span style={{
                width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: revealed && correct ? "#10b981" : revealed && isSelected ? "#ef4444" : "rgba(0,0,0,0.08)",
                border: "2px solid rgba(255,255,255,0.1)",
                fontSize: "0.8rem", fontWeight: 800,
                color: revealed && (correct || isSelected) ? "white" : "var(--text-muted)",
              }}>
                {revealed && correct ? "✓" : revealed && isSelected ? "✕" : String.fromCharCode(65 + i)}
              </span>
              <span style={{ paddingLeft: 2, fontWeight: 500 }}>{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: "hidden", padding: "1.125rem", marginBottom: "1.25rem",
              background: isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.08)",
              border: `2px solid ${isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
              {isCorrect
                ? <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isCorrect ? "#10b981" : "#ef4444", marginBottom: "0.3rem" }}>
                  {isCorrect ? "Correct! 🔥" : `Incorrect — Answer: ${q.answer}`}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                  {q.explanation}
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                marginTop: "1rem", width: "100%", padding: "0.75rem",
                background: teamColor, border: "none", borderRadius: "var(--radius-sm)",
                color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}
            >
              {qIndex + 1 < questions.length ? <><ArrowRight size={16} /> Next Question</> : <><Trophy size={16} /> Finish Challenge</>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
