"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, BookOpen, Terminal, CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react";
import { QuizQuestion } from "./types";
import { useProgress } from "@/context/ProgressContext";

export function QuizChallenge({
  questions, onComplete, teamColor, teamName, isActive, isCompleted, topic,
}: {
  questions: QuizQuestion[];
  onComplete: (correct: number, total: number) => void;
  teamColor: string;
  teamName: string;
  isActive: boolean;
  isCompleted: boolean;
  topic: string;
}) {
  const { saveExplanation } = useProgress();
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [why, setWhy] = useState("");
  const [whySaved, setWhySaved] = useState(false);

  // Call onComplete when quiz is done
  useEffect(() => {
    if (done && !isCompleted) {
      onComplete(correctCount, questions.length);
    }
  }, [done, isCompleted, correctCount, questions.length, onComplete]);

  const q = questions[qIndex];
  const isCorrect = selected === q?.answer;

  // Get next question - simple sequential progression
  const nextQIndex = useCallback(() => {
    if (qIndex + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setQIndex(qIndex + 1);
    // Reset state for new question
    setSelected(null);
    setRevealed(false);
    setWhy("");
    setWhySaved(false);
  }, [qIndex, questions.length]);

  const handleSaveWhy = () => {
    if (!why.trim()) return;
    saveExplanation(topic, why);
    setWhySaved(true);
  };

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
          padding: "2.25rem", background: "var(--bg-elevated)",
          border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ticket)",
          borderRadius: 0, textAlign: "center", position: "relative",
        }}
      >
        <CheckCircle size={36} color="var(--accent-emerald)" style={{ marginBottom: "0.5rem" }} />
        <div style={{ color: teamColor, fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Challenge Complete!</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
          {teamName} finished this round
        </div>
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
          background: "var(--bg-elevated)",
          border: "3px dashed var(--ink)",
          borderRadius: 0,
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
            background: "var(--bg-primary)", width: "72px", height: "72px",
            display: "flex", alignItems: "center",
            justifyContent: "center", marginBottom: "1rem", border: "3px solid var(--ink)"
          }}
        >
          <Lock size={30} color="var(--ink)" />
        </motion.div>
        <h3 style={{ color: "var(--text-primary)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "-0.25px" }}>
          Group B is Locked
        </h3>
        <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Waiting for Group A to clear their path first...
        </div>
      </motion.div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          padding: "2.5rem", background: "var(--bg-elevated)",
          border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ticket)",
          borderRadius: 0, textAlign: "center", position: "relative",
        }}
      >
        <Trophy size={36} color="var(--ticket)" style={{ marginBottom: "0.5rem" }} />
        <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.7rem", marginBottom: "0.5rem" }}>
          Answers Submitted!
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Answers are in. Waiting on the other group.
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Progress bar - chunky style */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "8px", borderRadius: 0,
            background: i < qIndex ? "var(--ink)" : i === qIndex ? "var(--ticket)" : "rgba(26,35,50,0.15)",
            transition: "background 0.3s",
            border: i === qIndex ? "2px solid var(--ink)" : "none",
          }} />
        ))}
      </div>

      {/* Question counter */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.625rem",
        marginBottom: "1.25rem", fontSize: "0.75rem",
        fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1.2px",
        background: "var(--ticket)", padding: "0.35rem 0.75rem", borderRadius: 0,
        border: "2px solid var(--ink)", color: "var(--ink)", fontWeight: 700,
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
          background: "var(--ink)", border: "3px solid var(--ink)",
          borderRadius: "var(--radius-sm)", padding: "1.25rem 1.5rem",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem",
          color: "#f7fbfc", marginBottom: "1.5rem",
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
          let bg = "var(--bg-elevated)";
          let border = "3px solid var(--ink)";
          let color = "var(--text-primary)";
          const showAnswer = revealed && whySaved;
          if (showAnswer) {
            if (correct) { bg = "var(--accent-emerald-dim)"; border = "3px solid var(--accent-emerald)"; color = "var(--accent-emerald)"; }
            else if (isSelected) { bg = "var(--accent-rose-dim)"; border = "3px solid var(--accent-rose)"; color = "var(--accent-rose)"; }
          } else if (isSelected) {
            bg = "var(--accent-amber-dim)"; border = "3px solid var(--ticket)";
          }
          return (
            <motion.button
              key={opt}
              whileHover={!revealed ? { x: 4, scale: 1.01 } : {}}
              whileTap={!revealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              style={{
                padding: "1.125rem 1.25rem", background: bg, border, borderRadius: 0,
                cursor: revealed ? "default" : "pointer", textAlign: "left",
                color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem",
                display: "flex", alignItems: "center", gap: "1rem", transition: "all 0.2s",
                boxShadow: "3px 3px 0 var(--ink)",
              }}
            >
              <span style={{
                width: "28px", height: "28px", borderRadius: 0, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: showAnswer && correct ? "var(--accent-emerald)" : showAnswer && isSelected ? "var(--accent-rose)" : "var(--ink)",
                border: "2px solid var(--ink)",
                fontSize: "0.8rem", fontWeight: 800,
                color: "var(--ticket)",
              }}>
                {showAnswer && correct ? "✓" : showAnswer && isSelected ? "✕" : String.fromCharCode(65 + i)}
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
              background: isCorrect ? "var(--accent-emerald-dim)" : "var(--accent-rose-dim)",
              border: `3px solid ${isCorrect ? "var(--accent-emerald)" : "var(--accent-rose)"}`,
              borderRadius: 0,
            }}
          >
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
              {isCorrect
                ? <CheckCircle size={18} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: "2px" }} />
                : <XCircle size={18} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: "2px" }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isCorrect ? "#10b981" : "#ef4444", marginBottom: "0.3rem" }}>
                  {whySaved
                    ? (isCorrect ? "Correct" : `Incorrect. Answer: ${q.answer}`)
                    : (isCorrect ? "Correct. Say why." : "Incorrect. Say why you picked that.")}
                </div>
                {whySaved && (
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                    {q.explanation}
                  </div>
                )}
              </div>
            </div>
            {!whySaved && (
              <div style={{ marginTop: "0.75rem" }}>
                <label style={{ display: "block", color: "var(--text-primary)", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  Why does that happen?
                </label>
                <textarea
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%", padding: "0.625rem", borderRadius: 0,
                    border: "3px solid var(--ink)", background: "var(--bg-elevated)",
                    color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.85rem", resize: "vertical",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={handleSaveWhy}
                    disabled={!why.trim()}
                    style={{
                      padding: "0.5rem 1rem", background: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 0,
                      color: "var(--ticket)", fontFamily: "var(--font-hud), VT323, monospace", fontSize: "1.15rem",
                      cursor: why.trim() ? "pointer" : "default", opacity: why.trim() ? 1 : 0.5,
                    }}
                  >
                    Use this reason
                  </button>
                </div>
              </div>
            )}
            {whySaved && <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                marginTop: "1rem", width: "100%", padding: "0.75rem",
                background: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 0,
                color: "var(--ticket)", fontFamily: "var(--font-hud), VT323, monospace", cursor: "pointer", fontSize: "1.25rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}
            >
              {qIndex + 1 < questions.length ? <><ArrowRight size={16} /> Next Question</> : <><Trophy size={16} /> Finish Challenge</>}
            </motion.button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
