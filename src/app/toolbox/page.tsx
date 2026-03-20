"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { CheckCircle, XCircle, Loader2, ArrowRight, Sparkles, Target, Zap } from "lucide-react";

type Question = {
  id: number;
  topic: string;
  type: string;
  question: string;
  options: string[];
};

type EvaluationResult = {
  isCorrect: boolean;
  message: string;
  reasoning?: string;
  correctAnswer?: string;
};

async function fetchQuestion(): Promise<Question> {
  const res = await fetch("/api/questions");
  if (!res.ok) throw new Error("Failed to fetch question");
  return res.json();
}

const topicColors: Record<string, { main: string; glow: string; bg: string }> = {
  variables: { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', bg: 'rgba(168, 85, 247, 0.15)' },
  logic: { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', bg: 'rgba(59, 130, 246, 0.15)' },
  loops: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.15)' },
  math: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.15)' },
  science: { main: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', bg: 'rgba(6, 182, 212, 0.15)' },
  ela: { main: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)', bg: 'rgba(236, 72, 153, 0.15)' },
  history: { main: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)', bg: 'rgba(139, 92, 246, 0.15)' },
};

export default function ToolboxPage() {
  const queryClient = useQueryClient();
  const { addXp, unlockItem, incrementQuestionsSolved } = useProgress();
  const [attempts, setAttempts] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [evaluated, setEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [evalMessage, setEvalMessage] = useState("");
  const [reasoningText, setReasoningText] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: question, isLoading, refetch } = useQuery({
    queryKey: ["question"],
    queryFn: fetchQuestion,
    staleTime: Infinity,
  });

  const colors = question ? (topicColors[question.topic] || topicColors.variables) : topicColors.variables;

  const evaluateMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: number; answer: string }): Promise<EvaluationResult> => {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, studentAnswer: answer })
      });
      if (!res.ok) throw new Error("Failed to evaluate");
      return res.json();
    },
    onSuccess: (data) => {
      setIsCorrect(data.isCorrect);

      if (data.isCorrect) {
        setEvalMessage(data.message);
        setReasoningText(data.reasoning || "");
        setShowConfetti(true);
        addXp(100);
        incrementQuestionsSolved?.();

        const itemMap: Record<string, { id: string; name: string; icon: string }> = {
          variables: { id: "wrench", name: "Variables Wrench", icon: "🔧" },
          logic: { id: "brain", name: "Logic Brain", icon: "🧠" },
          loops: { id: "loop", name: "Infinity Loop", icon: "♾️" },
          math: { id: "ruler", name: "Golden Ruler", icon: "📐" },
          science: { id: "flask", name: "Science Flask", icon: "🧪" },
        };

        const item = itemMap[question?.topic || ""];
        if (item) unlockItem(item);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 2) {
          setEvalMessage(`Incorrect. The correct answer was: ${data.correctAnswer}`);
          setReasoningText(data.reasoning || "");
        } else {
          setEvalMessage("Incorrect! Give it another shot.");
          setReasoningText("");
          setTimeout(() => {
            setEvaluated(false);
            setSelectedAnswer(null);
            setIsCorrect(false);
          }, 2500);
        }
      }
    },
  });

  const handleNextQuestion = () => {
    setEvaluated(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setAttempts(0);
    setReasoningText("");
    setShowConfetti(false);
    refetch();
  };

  const handleEvaluate = (answer: string) => {
    if (!question) return;
    setSelectedAnswer(answer);
    setEvaluated(true);
    evaluateMutation.mutate({ questionId: question.id, answer });
  };

  // DND Components
  const DraggableVar = ({ id, text }: { id: string; text: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled: evaluated });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 } : undefined;

    return (
      <motion.button
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="draggable-item"
        disabled={evaluated}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {text}
      </motion.button>
    );
  };

  const DroppableArea = () => {
    const { isOver, setNodeRef } = useDroppable({ id: "drop-zone" });

    let borderColor = isOver ? colors.main : "var(--glass-border)";
    if (evaluated) {
      borderColor = isCorrect ? "#10b981" : "#ef4444";
    }

    return (
      <div
        ref={setNodeRef}
        className="droppable-area"
        style={{
          borderColor,
          background: isOver || (evaluated && isCorrect) ? colors.bg : "rgba(0,0,0,0.2)",
          boxShadow: isOver ? `0 0 20px ${colors.glow}` : "none"
        }}
      >
        {selectedAnswer ? (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="draggable-item"
            style={{
              transform: "none",
              cursor: "default",
              border: `2px solid ${borderColor}`,
              background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"
            }}
          >
            {selectedAnswer}
          </motion.span>
        ) : (
          <span style={{ color: "var(--text-muted)", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} />
            Drop your answer here
          </span>
        )}
      </div>
    );
  };

  const handleDragEnd = (event: any) => {
    if (event.over && event.over.id === "drop-zone" && !evaluated) {
      handleEvaluate(event.active.id);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1.5rem' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} color="var(--accent-indigo)" />
        </motion.div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading your next challenge...</p>
      </div>
    );
  }

  if (!question) return <div>Error loading question.</div>;

  const isDragAndDrop = ["fill-in-blank", "categorization"].includes(question.type) || question.question.includes("store your name");

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '2.5rem', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: "0.25rem" }}>
            The Toolbox
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            Interactive coding challenges.
          </p>
        </div>
        <div className="status-chip live" style={{
          background: colors.bg,
          borderColor: colors.main,
          color: colors.main,
        }}
        >
          <Sparkles size={14} style={{ marginRight: '0.25rem' }} />
          <span>{question.topic}</span>
        </div>
      </div>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 100
            }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 1,
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: [colors.main, '#10b981', '#f59e0b', '#3b82f6'][i % 4]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Card using Terminal Chrome */}
      <motion.div
        className="terminal-chrome"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem' }}
      >
        <div className="terminal-titlebar">
          <div className="terminal-dots"><span /><span /><span /></div>
          <span>challenge.sh — {question.id}</span>
        </div>

        <div style={{ padding: '2rem 2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Zap size={18} color={colors.main} />
            <span style={{ color: colors.main, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace" }}>
              Task
            </span>
          </div>

          {/* Question Text */}
          <h2 style={{
            marginBottom: '2.5rem',
            fontSize: '1.35rem',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            fontWeight: 500
          }}>
            {question.question}
          </h2>

          {/* Answers Section */}
          {isDragAndDrop ? (
            <DndContext onDragEnd={handleDragEnd}>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>
                  // Available Options
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {question.options.map((opt) => (
                    <DraggableVar key={opt} id={opt} text={opt} />
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '2rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                fontSize: '1.15rem',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                <DroppableArea />
                {question.topic === "variables" && (
                  <span style={{ color: colors.main }}>myName = "Sona";</span>
                )}
              </div>
            </DndContext>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {question.options.map((opt, index) => (
                <motion.button
                  key={opt}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={evaluated ? {} : { x: 4 }}
                  whileTap={evaluated ? {} : { scale: 0.99 }}
                  onClick={() => !evaluated && handleEvaluate(opt)}
                  disabled={evaluated}
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: selectedAnswer === opt
                      ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)')
                      : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: evaluated && selectedAnswer === opt
                      ? isCorrect ? '#10b981' : '#ef4444'
                      : 'rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: evaluated ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    fontFamily: "'JetBrains Mono', monospace",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    color: selectedAnswer === opt ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    [{String.fromCharCode(65 + index)}]
                  </div>
                  {opt}
                </motion.button>
              ))}
            </div>
          )}

          {/* Result Feedback */}
          <AnimatePresence>
            {evaluated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  padding: '1.5rem',
                  background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {isCorrect ? (
                        <CheckCircle size={36} color="#10b981" />
                      ) : (
                        <XCircle size={36} color="#ef4444" />
                      )}
                    </motion.div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                        {evalMessage}
                      </strong>
                      {reasoningText && (
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: isCorrect ? '0.5rem' : '0' }}>
                          {reasoningText}
                        </p>
                      )}
                      {isCorrect && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={{ color: 'var(--accent-purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Sparkles size={16} /> +100 XP added to your profile!
                        </motion.span>
                      )}
                    </div>

                    {(isCorrect || attempts >= 2) && (
                      <motion.button
                        className="btn-primary"
                        onClick={handleNextQuestion}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                      >
                        Next <ArrowRight size={18} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}