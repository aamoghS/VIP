"use client";

import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { CheckCircle } from "lucide-react";

export default function ToolboxPage() {
  const { addXp, unlockItem } = useProgress();
  const [completed, setCompleted] = useState(false);
  const [droppedItem, setDroppedItem] = useState<string | null>(null);

  const DraggableVar = ({ id, text }: { id: string; text: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

    return (
      <button ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-item">
        {text}
      </button>
    );
  };

  const DroppableArea = () => {
    const { isOver, setNodeRef } = useDroppable({ id: "drop-zone" });

    return (
      <div ref={setNodeRef} className={`droppable-area ${isOver ? "active" : ""}`}>
        {droppedItem ? (
          <span className="draggable-item" style={{ transform: "none", cursor: "default" }}>
            {droppedItem}
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>Drop variable here</span>
        )}
      </div>
    );
  };

  const handleDragEnd = (event: any) => {
    if (event.over && event.over.id === "drop-zone") {
      setDroppedItem(event.active.id);
      if (event.active.id === "String") {
        setCompleted(true);
        addXp(100);
        unlockItem({ id: "bronze-wrench", name: "Bronze Wrench", icon: "🔧" });
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">The Toolbox</h1>
      <p className="page-subtitle">Sharpen your tools before the big mission.</p>

      <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Task 1: Define a Variable</h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem" }}>
          You need to store your name in a variable. Which data type should you use?
        </p>

        <DndContext onDragEnd={handleDragEnd}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem" }}>
            <DraggableVar id="int" text="int" />
            <DraggableVar id="String" text="String" />
            <DraggableVar id="boolean" text="boolean" />
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "2rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.2rem", fontFamily: "monospace" }}>
            <DroppableArea />
            <span>myName = "Sona";</span>
          </div>
        </DndContext>

        {completed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: "2rem", padding: "1rem", background: "rgba(199, 125, 255, 0.1)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(199, 125, 255, 0.3)", display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <CheckCircle color="var(--primary)" />
            <div>
              <strong style={{ display: "block", color: "#fff" }}>Correct!</strong>
              <span style={{ color: "var(--text-muted)" }}>+100 XP. You unlocked the <strong>Bronze Wrench</strong> for Your Room.</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
