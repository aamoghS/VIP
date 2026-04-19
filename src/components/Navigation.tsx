"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Zap, Trophy, Sparkles, BarChart3, Home, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";

export default function Navigation() {
  const pathname = usePathname();
  const { xp, currentLevel, xpPerLevel, levelProgress } = useProgress();

  const links = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/toolbox', icon: Wrench, label: 'The Toolbox' },
    { href: '/sprint', icon: Zap, label: 'The Sprint' },
    { href: '/room', icon: Trophy, label: 'The Room' },
    { href: '/metrics', icon: BarChart3, label: 'Metrics' },
  ];

  return (
    <nav className="glass-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="logo" style={{ marginBottom: "2.5rem" }}>
        <div className="logo-icon" style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--accent-blue)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Code2 size={20} color="white" />
        </div>
        <h1 style={{ letterSpacing: "-1px", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>codedash</h1>
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
                    background: "rgba(0,0,0,0.04)",
                    borderLeft: "3px solid var(--accent-blue)",
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
                  textDecoration: "none", fontSize: "0.95rem", fontWeight: isActive ? 600 : 400,
                }}
              >
                <Icon size={18} className="icon" style={{ strokeWidth: isActive ? 2.5 : 1.5 }} />
                <span title={link.label}>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
          Level {currentLevel} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({xpPerLevel} XP needed)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-indigo))', borderRadius: '3px' }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}