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

  const handleSelect = (opt: string) => {
    if (revealed || !isActive) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === q.answer) setCorrectCount(c => c + 1);
  };

  const handleNext = useCallback(() => {
    if (qIndex + 1 < questions.length) {
      setQIndex(i => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setDone(true);
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      onComplete(finalCorrect, questions.length);
    }
  }, [qIndex, questions.length, isCorrect, correctCount, onComplete]);

  if (isCompleted) {
    return (
      <div style={{
        padding: "1.5rem", background: `${teamColor}15`,
        border: `2px solid ${teamColor}40`, borderRadius: "var(--radius-md)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
        <div style={{ color: teamColor, fontWeight: 700, fontSize: "1.1rem" }}>Challenge Complete!</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          {teamName} finished their round
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div style={{
        padding: "1.5rem", background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)",
        textAlign: "center", opacity: 0.6,
      }}>
        <Lock size={24} color="var(--text-muted)" style={{ marginBottom: "0.5rem" }} />
        <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Waiting for Group A to finish first...
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{
        padding: "1.5rem", background: `${teamColor}10`,
        border: `1px solid ${teamColor}30`, borderRadius: "var(--radius-md)",
        textAlign: "center",
      }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
          style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎯</motion.div>
        <div style={{ color: teamColor, fontWeight: 700, fontSize: "1rem" }}>Answers submitted!</div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem" }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "4px", borderRadius: "2px",
            background: i < qIndex ? teamColor : i === qIndex ? `${teamColor}60` : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Question counter */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        marginBottom: "1rem", fontSize: "0.75rem", color: "var(--text-muted)",
        fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1px",
      }}>
        <BookOpen size={13} />
        Question {qIndex + 1} of {questions.length}
      </div>

      {/* Prompt */}
      <p style={{ color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "1rem", fontWeight: 500 }}>
        {q.prompt}
      </p>

      {/* Code block */}
      {q.code && (
        <div style={{
          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem",
          color: "#e2e8f0", marginBottom: "1.25rem",
          whiteSpace: "pre", overflowX: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", opacity: 0.5 }}>
            <Terminal size={12} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "1px", textTransform: "uppercase" }}>Java</span>
          </div>
          {q.code}
        </div>
      )}

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const correct = opt === q.answer;
          let bg = "rgba(255,255,255,0.03)";
          let border = "1px solid rgba(255,255,255,0.08)";
          let color = "var(--text-primary)";
          if (revealed) {
            if (correct) { bg = "rgba(16,185,129,0.12)"; border = "1px solid #10b981"; color = "#10b981"; }
            else if (isSelected) { bg = "rgba(239,68,68,0.1)"; border = "1px solid #ef4444"; color = "#ef4444"; }
          } else if (isSelected) {
            bg = `${teamColor}15`; border = `1px solid ${teamColor}`;
          }
          return (
            <motion.button
              key={opt}
              whileHover={!revealed ? { x: 3 } : {}}
              whileTap={!revealed ? { scale: 0.99 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              style={{
                padding: "0.875rem 1rem", background: bg, border, borderRadius: "var(--radius-sm)",
                cursor: revealed ? "default" : "pointer", textAlign: "left",
                color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88rem",
                display: "flex", alignItems: "center", gap: "0.875rem", transition: "all 0.2s",
              }}
            >
              <span style={{
                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: revealed && correct ? "#10b981" : revealed && isSelected ? "#ef4444" : "rgba(255,255,255,0.06)",
                fontSize: "0.75rem", fontWeight: 700,
              }}>
                {revealed && correct ? "✓" : revealed && isSelected ? "✕" : String.fromCharCode(65 + i)}
              </span>
              {opt}
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
              overflow: "hidden", padding: "1rem", marginBottom: "1rem",
              background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.06)",
              border: `1px solid ${isCorrect ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
              {isCorrect
                ? <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                : <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: isCorrect ? "#10b981" : "#ef4444", marginBottom: "0.25rem" }}>
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
                marginTop: "0.875rem", width: "100%", padding: "0.625rem",
                background: teamColor, border: "none", borderRadius: "var(--radius-sm)",
                color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
              }}
            >
              {qIndex + 1 < questions.length ? <><ArrowRight size={15} /> Next Question</> : <><Trophy size={15} /> Finish Challenge</>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
