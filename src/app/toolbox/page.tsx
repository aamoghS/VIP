"use client";

import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";

type Question = {
  id: number;
  topic: string;
  type: string;
  question: string;
  options: string[];
};

export default function ToolboxPage() {
  const { addXp, unlockItem } = useProgress();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [evaluated, setEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [evalMessage, setEvalMessage] = useState("");

  const fetchQuestion = async () => {
    setLoading(true);
    setEvaluated(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setAttempts(0);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestion(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleEvaluate = async (answer: string) => {
    if (!question) return;
    setSelectedAnswer(answer);
    setEvaluated(true);
    
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, studentAnswer: answer })
      });
      const data = await res.json();
      
      setIsCorrect(data.isCorrect);

      if (data.isCorrect) {
        setEvalMessage(data.message);
        addXp(100);
        // Randomly unlock an item sometimes for fun, or fixed based on topic
        if (question.topic === "variables") unlockItem({ id: "wrench", name: "Variables Wrench", icon: "🔧" });
        if (question.topic === "logic") unlockItem({ id: "brain", name: "Logic Brain", icon: "🧠" });
        if (question.topic === "loops") unlockItem({ id: "loop", name: "Infinity Loop", icon: "♾️" });
        if (question.topic === "math") unlockItem({ id: "ruler", name: "Golden Ruler", icon: "📐" });
        if (question.topic === "science") unlockItem({ id: "flask", name: "Science Flask", icon: "🧪" });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 2) {
          setEvalMessage(`Incorrect. The correct answer was: ${data.correctAnswer}`);
        } else {
          setEvalMessage("Incorrect! Try again. Clearing drop zone in 2 seconds...");
          setTimeout(() => {
            setEvaluated(false);
            setSelectedAnswer(null);
            setIsCorrect(false);
          }, 2500);
        }
      }
    } catch (err) {
      console.error(err);
      setEvaluated(false);
      setSelectedAnswer(null);
    }
  };

  // DND Components
  const DraggableVar = ({ id, text }: { id: string; text: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled: evaluated });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 } : undefined;

    return (
      <button ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-item" disabled={evaluated}>
        {text}
      </button>
    );
  };

  const DroppableArea = () => {
    const { isOver, setNodeRef } = useDroppable({ id: "drop-zone" });

    let borderColor = isOver ? "var(--secondary)" : "rgba(255, 255, 255, 0.2)";
    if (evaluated) {
      borderColor = isCorrect ? "var(--accent)" : "red";
    }

    return (
      <div 
        ref={setNodeRef} 
        className={`droppable-area ${isOver ? "active" : ""}`}
        style={{ borderColor, transition: "all 0.3s ease" }}
      >
        {selectedAnswer ? (
          <span className="draggable-item" style={{ transform: "none", cursor: "default", border: `1px solid ${borderColor}` }}>
            {selectedAnswer}
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>Drop answer here</span>
        )}
      </div>
    );
  };

  const handleDragEnd = (event: any) => {
    if (event.over && event.over.id === "drop-zone" && !evaluated) {
      handleEvaluate(event.active.id);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <Loader2 className="icon" size={48} color="var(--primary)" style={{ animation: "spin 2s linear infinite" }} />
        <p style={{ color: "var(--text-muted)" }}>Loading your next challenge...</p>
      </div>
    );
  }

  if (!question) return <div>Error loading question.</div>;

  const isDragAndDrop = ["fill-in-blank", "categorization"].includes(question.type) || question.question.includes("store your name");

  return (
    <div>
      <div className="flex-between">
        <div>
          <h1 className="page-title">The Toolbox</h1>
          <p className="page-subtitle">Sharpen your tools before the big mission.</p>
        </div>
        <div className="badge" style={{ background: "rgba(199, 125, 255, 0.1)", color: "var(--primary)", borderColor: "var(--primary)" }}>
          Topic: {question.topic.toUpperCase()}
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary)", fontSize: "1.5rem" }}>
          Challenge
        </h2>
        <p style={{ marginBottom: "2.5rem", fontSize: "1.2rem", lineHeight: "1.6" }}>
          {question.question}
        </p>

        {isDragAndDrop ? (
          <DndContext onDragEnd={handleDragEnd}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
              {question.options.map((opt) => (
                <DraggableVar key={opt} id={opt} text={opt} />
              ))}
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", padding: "2.5rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "1.2rem", fontFamily: "monospace" }}>
              <DroppableArea />
              {question.topic === "variables" ? <span>myName = "Sona";</span> : <span></span>}
            </div>
          </DndContext>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {question.options.map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ scale: evaluated ? 1 : 1.02 }}
                whileTap={{ scale: evaluated ? 1 : 0.98 }}
                onClick={() => !evaluated && handleEvaluate(opt)}
                disabled={evaluated}
                style={{
                  padding: "1.5rem",
                  background: selectedAnswer === opt ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${
                    evaluated && selectedAnswer === opt
                      ? isCorrect ? "#00b4d8" : "#e63946"
                      : "var(--glass-border)"
                  }`,
                  borderRadius: "var(--radius-sm)",
                  color: "#fff",
                  fontSize: "1.1rem",
                  cursor: evaluated ? "default" : "pointer",
                  textAlign: "left",
                  transition: "all 0.3s ease"
                }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {evaluated && (
            <motion.div 
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ 
                marginTop: "2rem", 
                padding: "1.5rem", 
                background: isCorrect ? "rgba(199, 125, 255, 0.1)" : "rgba(230, 57, 70, 0.1)", 
                borderRadius: "var(--radius-sm)", 
                border: `1px solid ${isCorrect ? 'rgba(199, 125, 255, 0.3)' : 'rgba(230, 57, 70, 0.3)'}`, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {isCorrect ? <CheckCircle color="var(--primary)" size={32} /> : <XCircle color="#e63946" size={32} />}
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "1.2rem" }}>
                      {evalMessage}
                    </strong>
                    {isCorrect && (
                      <span style={{ color: "var(--text-muted)" }}>+100 XP added to your profile!</span>
                    )}
                  </div>
                </div>
                
                {(isCorrect || attempts >= 2) && (
                  <button className="btn-primary" onClick={fetchQuestion} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.5rem" }}>
                    Next Question <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
