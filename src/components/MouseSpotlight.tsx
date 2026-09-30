"use client";
import { useEffect, useState } from "react";

export default function MouseSpotlight() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  
  useEffect(() => {
    let frame = 0;
    let x = -1000;
    let y = -1000;
    const handleMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setPosition({ x, y });
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.045), transparent 40%)`,
        mixBlendMode: 'screen'
      }}
    />
  );
}
