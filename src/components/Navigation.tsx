"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Zap, Trophy, Sparkles, BarChart3, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";

export default function Navigation() {
  const pathname = usePathname();
  const { xp } = useProgress();
  const progressPercent = xp % 100;

  const links = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/toolbox', icon: Wrench, label: 'The Toolbox' },
    { href: '/sprint', icon: Zap, label: 'The Sprint' },
    { href: '/room', icon: Trophy, label: 'The Room' },
    { href: '/metrics', icon: BarChart3, label: 'Metrics' },
  ];

  return (
    <nav className="glass-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="logo" style={{ marginBottom: "2rem" }}>
        <div className="logo-icon">
          <Sparkles size={20} color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <h1 style={{ letterSpacing: "-1px" }}>VIP</h1>
      </div>
      
      <ul className="nav-links" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", listStyle: "none", padding: 0 }}>
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <li key={link.href} style={{ position: "relative" }}>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    borderLeft: "3px solid var(--accent-purple)",
                    zIndex: 0
                  }}
                />
              )}
              <Link
                href={link.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ 
                  position: "relative", zIndex: 1, padding: "0.85rem 1rem", 
                  display: "flex", alignItems: "center", gap: "1rem",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  textDecoration: "none", fontSize: "0.95rem", fontWeight: isActive ? 600 : 400,
                  transition: "color 0.2s ease"
                }}
              >
                <Icon size={18} style={{ color: isActive ? "var(--accent-purple)" : "inherit" }} />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>
          Level Progress
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', borderRadius: '3px' }} 
            />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, minWidth: "30px", textAlign: "right" }}>
            {progressPercent}%
          </span>
        </div>
      </div>
    </nav>
  );
}