"use client";
import { useEffect, useState } from "react";

export default function MouseSpotlight() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Using requestAnimationFrame for absolute zero-lag buttery smoothness
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
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
