"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Zap, Trophy, BarChart3, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import PlayerLogin from "@/components/PlayerLogin";

export default function Navigation() {
  const pathname = usePathname();
  const { xp, currentLevel, xpToNext, levelProgress } = useProgress();

  const links = [
    { href: '/', icon: Home, label: 'Brief' },
    { href: '/toolbox', icon: Wrench, label: 'Practice' },
    { href: '/sprint', icon: Zap, label: 'Build' },
    { href: '/room', icon: Trophy, label: 'Locker' },
    { href: '/metrics', icon: BarChart3, label: 'Score' },
  ];

  return (
    <nav className="glass-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="logo" style={{ marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>codedash</h1>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ticket)", marginTop: "0.1rem" }}>
            Critical thinking
          </div>
        </div>
      </div>

      <ul className="nav-links" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", listStyle: "none", padding: 0 }}>
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{
                  padding: "0.7rem 0.85rem",
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  textDecoration: "none", fontWeight: isActive ? 700 : 400,
                }}
              >
                <Icon size={18} className="icon" style={{ strokeWidth: isActive ? 2.5 : 1.5 }} />
                <span title={link.label}>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="nav-foot" style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(247,251,252,0.15)' }}>
        <PlayerLogin />
        <div className="nav-level">LV {currentLevel}</div>
        <div style={{ fontSize: '0.8rem', color: '#d5e0e8', margin: '0.2rem 0 0.6rem' }}>
          {xp} XP · {xpToNext} to next
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(247,251,252,0.15)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: '100%', background: 'var(--ticket)' }}
          />
        </div>
      </div>
    </nav>
  );
}