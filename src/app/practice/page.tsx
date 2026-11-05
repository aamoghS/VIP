"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, useDraggable, useDroppable, DragOverlay, type DragEndEvent } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import { useProgress } from "@/context/ProgressContext";
import { Ticket } from "@/components/Ticket";
import { PromptWithCode, OptionText } from "@/components/RichText";
import { CheckCircle, Lock, XCircle, Loader2, ArrowRight, Target } from "lucide-react";

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

async function fetchQuestion(topic: string | null): Promise<Question> {
  const params = new URLSearchParams({ critical: "1" });
  if (topic) params.set("topic", topic);
  const res = await fetch(`/api/questions?${params}`);
  if (!res.ok) throw new Error("Failed to fetch question");
  return res.json();
}

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

const topicColors ={ main: "var(--ink)", glow: "rgba(26, 35, 50, 0.2)", bg: "var(--ticket)" };

export default function ToolboxPage() {
  return (
    <Suspense fallback={null}>
      <Toolbox />
    </Suspense>
  );
}

function Toolbox() {
  const queryClient = useQueryClient();
  const topic = useSearchParams().get("topic");
  const { addXp, unlockItem, incrementQuestionsSolved, recordAnswer, saveExplanation } = useProgress();
  const [attempts, setAttempts] = useState(0);
  const [answered, setAnswered] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [evaluated, setEvaluated] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [evalMessage, setEvalMessage] = useState("");
  const [reasoningText, setReasoningText] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [whySaved, setWhySaved] = useState(false);
  const whyForm = useForm({
    defaultValues: { why: "" },
    onSubmit: ({ value }) => {
      if (!question || !value.why.trim()) return;
      saveExplanation(question.topic, value.why);
      setWhySaved(true);
    },
  });

  const { data: question, isLoading, refetch } = useQuery({
    queryKey: ["question", topic],
    queryFn: () => fetchQuestion(topic),
    staleTime: Infinity,
  });

  const colors = topicColors;

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
      setEvaluated(true);
      setIsCorrect(data.isCorrect);

      if (question) {
        recordAnswer(question.topic, data.isCorrect);
      }

      if (data.isCorrect) {
        setEvalMessage("");
        setReasoningText(data.reasoning || "");
        setShowConfetti(true);
        addXp(100);
        incrementQuestionsSolved?.();

        const itemMap: Record<string, { id: string; name: string; iconKey: string }> = {
          variables: { id: "variables", name: "Variables Wrench", iconKey: "variables" },
          logic: { id: "logic", name: "Logic Brain", iconKey: "logic" },
          loops: { id: "loops", name: "Infinity Loop", iconKey: "loops" },
          functions: { id: "functions", name: "Functions Flask", iconKey: "functions" },
          debugging: { id: "debugging", name: "Debugging Bug", iconKey: "debugging" },
          algorithms: { id: "algorithms", name: "Algorithms Map", iconKey: "algorithms" },
        };

        const item = itemMap[question?.topic || ""];
        if (item) unlockItem({ ...item, icon: item.iconKey });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 2) {
          setEvalMessage(`The correct answer was: ${data.correctAnswer}`);
          setReasoningText(data.reasoning || "");
        } else {
          setEvalMessage("Try again.");
          setReasoningText("");
          setTimeout(() => {
            setEvaluated(false);
            setSelectedAnswer(null);
            setIsCorrect(false);
          }, 2500);
        }
      }
    },
    onError: () => {
      setEvaluated(false);
      setSelectedAnswer(null);
    },
  });

  const handleNextQuestion = () => {
    setEvaluated(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setAttempts(0);
    setAnswered((n) => n + 1);
    setReasoningText("");
    setShowConfetti(false);
    whyForm.reset();
    setWhySaved(false);
    refetch();
  };

  const handleEvaluate = (answer: string) => {
    if (!question) return;
    setSelectedAnswer(answer);
    evaluateMutation.mutate({ questionId: question.id, answer });
  };


  const DraggableVar = ({ id, text }: { id: string; text: string }) => {
    const displayText = text === "[name]" ? `"Student"` : text;

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, disabled: evaluated || evaluateMutation.isPending });
    return (
      <motion.button
        ref={setNodeRef}
        style={{ opacity: isDragging ? 0.2 : 1 }}
        {...listeners}
        {...attributes}
        className="draggable-item"
        disabled={evaluated || evaluateMutation.isPending}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {displayText}
      </motion.button>
    );
  };

  const DroppableArea = () => {
    const { isOver, setNodeRef } = useDroppable({ id: "drop-zone" });

    let borderColor = isOver ? colors.main : "var(--glass-border)";
    if (evaluated) {
      borderColor = isCorrect ? "var(--ok)" : "var(--bad)";
    } else if (evaluateMutation.isPending && selectedAnswer) {
      borderColor = colors.main;
    }

    return (
      <div
        ref={setNodeRef}
        className="droppable-area"
        style={{
          borderColor,
          background: isOver || (evaluated && isCorrect) ? colors.bg : "var(--surface)",
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
              background: "var(--surface)"
            }}
          >
            {selectedAnswer}
          </motion.span>
        ) : (
          <span style={{ color: "var(--ink-2)", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} />
            Drop your answer here
          </span>
        )}
      </div>
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (event.over && event.over.id === "drop-zone" && !evaluated && !evaluateMutation.isPending) {
      handleEvaluate(String(event.active.id));
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1.5rem' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} color="var(--ink)" />
        </motion.div>
        <p style={{ color: 'var(--ink-2)' }}>Loading your question</p>
      </div>
    );
  }

  if (!question) return <div className="page">Could not load a question. Reload the page to try again.</div>;

  const isDragAndDrop = ["fill-in-blank", "categorization"].includes(question.type) || question.question.includes("store your name");

  const topicName = question.topic.charAt(0).toUpperCase() + question.topic.slice(1);
  const finished = evaluated && (isCorrect || attempts >= 2);

  return (
    <div className="page">
      <h1 className="page-title">Practice</h1>
      <p className="lede" style={{ marginBottom: "var(--space-6)" }}>
        Change one line in your head, pick what happens, then say why.
      </p>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 100 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 0 }}
                animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, scale: 1, rotate: Math.random() * 360 }}
                transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: ['var(--ink)', 'var(--ticket)', 'var(--ok)'][i % 3] }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Ticket tone="plain" stub={`Q ${answered + 1}`} stubNote={topicName}>
        <div style={{ padding: 'var(--space-2)' }}>
          <div style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--step-1)', lineHeight: 1.5, letterSpacing: 0, fontWeight: 700 }}>
            <PromptWithCode text={question.question} />
          </div>

          {isDragAndDrop ? (
            <DndContext
              onDragStart={(e) => setActiveId(String(e.active.id))}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveId(null)}
            >
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <p className="meta" style={{ marginBottom: 'var(--space-3)' }}>Drag an option into the box.</p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  {question.options.map((opt) => (
                    <DraggableVar key={opt} id={opt} text={opt} />
                  ))}
                </div>
              </div>

              <div className="mono" style={{
                borderTop: '1px solid rgba(26, 35, 50, 0.2)',
                paddingTop: 'var(--space-5)',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                fontSize: 'var(--step-1)',
              }}>
                <DroppableArea />
                {question.topic === "variables" && !question.options.includes("[name]") && (
                  <span>myName = "Sona";</span>
                )}
                {question.options.includes("[name]") && (
                  <span>`Welcome, ${"{"}userName{"}"}!`</span>
                )}
              </div>

              <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeId ? (
                  <div className="draggable-item" style={{ cursor: 'grabbing', transform: 'scale(1.05)' }}>
                    {activeId}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div role="group" aria-label="Answer options" style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {question.options.map((opt, index) => {
                const chosen = selectedAnswer === opt;
                const showResult = evaluated && chosen;
                const resultColor = isCorrect ? 'var(--ok)' : 'var(--bad)';
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => !evaluated && !evaluateMutation.isPending && handleEvaluate(opt)}
                    disabled={evaluated || evaluateMutation.isPending}
                    aria-pressed={chosen}
                    style={{
                      minHeight: '44px',
                      padding: 'var(--space-3) var(--space-4)',
                      background: chosen ? 'rgba(26, 35, 50, 0.06)' : 'var(--surface)',
                      border: '2px solid',
                      borderColor: showResult ? resultColor : 'var(--ink)',
                      borderRadius: 0,
                      color: 'var(--ink)',
                      fontSize: 'var(--step-0)',
                      cursor: evaluated || evaluateMutation.isPending ? 'default' : 'pointer',
                      textAlign: 'left',
                                            display: 'flex',
                      alignItems: 'baseline',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <span style={{ fontWeight: 700 }} aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                    <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                      <OptionText text={opt} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div aria-live="polite">
            {evaluated && (
              <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid rgba(26, 35, 50, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: isCorrect ? 'var(--ok)' : 'var(--bad)' }}>
                  {isCorrect ? <CheckCircle size={28} aria-hidden="true" /> : <XCircle size={28} aria-hidden="true" />}
                  <strong style={{ fontSize: 'var(--step-2)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {isCorrect ? "Correct" : "Not quite"}
                  </strong>
                  {isCorrect && <span className="badge" style={{ color: 'var(--ink)' }}>+100 XP</span>}
                </div>

                {evalMessage && <p style={{ marginTop: 'var(--space-3)' }}>{evalMessage}</p>}
                {finished && reasoningText && (
                  <p style={{ marginTop: 'var(--space-3)', color: 'var(--ink-2)', maxWidth: '46rem' }}>{reasoningText}</p>
                )}

                {finished && !whySaved && (
                  <form
                    style={{ marginTop: 'var(--space-5)', maxWidth: '46rem' }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void whyForm.handleSubmit();
                    }}
                  >
                    <whyForm.Field
                      name="why"
                      validators={{ onChange: ({ value }) => (value.trim() ? undefined : "Write a sentence to save your reason.") }}
                    >
                      {(f) => (
                        <div>
                          <label htmlFor="why" style={{ display: 'block', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                            Why does that happen?
                          </label>
                          <textarea
                            id="why"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            rows={3}
                            style={{ width: '100%', padding: 'var(--space-3)', border: '2px solid var(--ink)', background: 'var(--surface)', borderRadius: 0, color: 'var(--ink)', resize: 'vertical' }}
                          />
                          {f.state.meta.isTouched && f.state.meta.errors[0] && (
                            <div className="field-error">{String(f.state.meta.errors[0])}</div>
                          )}
                        </div>
                      )}
                    </whyForm.Field>
                    <whyForm.Subscribe selector={(st) => st.values.why.trim().length > 0}>
                      {(hasText) => (
                        <button type="submit" className="btn btn-primary" disabled={!hasText} style={{ marginTop: 'var(--space-3)' }}>
                          {!hasText && <Lock size={16} aria-hidden="true" />}
                          Save my reason
                        </button>
                      )}
                    </whyForm.Subscribe>
                  </form>
                )}
                {whySaved && <p className="meta" style={{ marginTop: 'var(--space-3)' }}>Reason saved.</p>}

                {finished && whySaved && (
                  <button type="button" className="btn btn-primary" onClick={handleNextQuestion} style={{ marginTop: 'var(--space-5)' }}>
                    Next question <ArrowRight size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        </Ticket>
      </motion.div>
    </div>
  );
}
