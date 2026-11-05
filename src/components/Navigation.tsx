"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Zap, Trophy, BarChart3, Home, GraduationCap } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import PlayerLogin from "@/components/PlayerLogin";

export default function Navigation() {
  const pathname = usePathname();
  const { xp, currentLevel, xpToNext, levelProgress } = useProgress();

  const links = [
    { href: '/', icon: Home, label: 'Brief' },
    { href: '/practice', icon: Wrench, label: 'Practice' },
    { href: '/build', icon: Zap, label: 'Build' },
    { href: '/locker', icon: Trophy, label: 'Locker' },
    { href: '/score', icon: BarChart3, label: 'Score' },
    { href: '/teach', icon: GraduationCap, label: 'Teach' },
  ];

  const tabs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = tabs.current?.querySelector<HTMLElement>(".nav-links");
    const item = strip?.querySelector<HTMLElement>(".nav-item.active");
    if (!strip || !item) return;
    const s = strip.getBoundingClientRect();
    const i = item.getBoundingClientRect();
    strip.scrollLeft += i.left + i.width / 2 - (s.left + s.width / 2);
  }, [pathname]);

  return (
    <nav className="glass-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="logo" style={{ marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>codedash</h1>
          <div style={{ fontSize: "var(--step--1)", fontWeight: 700, color: "var(--ticket)", marginTop: "0.1rem" }}>
            Critical thinking
          </div>
        </div>
      </div>

      <div className="nav-tabs" ref={tabs}>
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
      </div>

      {pathname.startsWith("/print") ? null : <div className="nav-foot" style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(247,251,252,0.15)' }}>
        {/* /build and /teach have their own sign-in gate and header. */}
        {pathname.startsWith("/build") || pathname.startsWith("/teach") ? null : <PlayerLogin />}
        <div className="nav-level">LV {currentLevel}</div>
        <div className="nav-xp" style={{ fontSize: 'var(--step--1)', color: '#d5e0e8', margin: '0.2rem 0 0.6rem' }}>
          {xp} XP · {xpToNext} to next
        </div>
        <div className="nav-bar" style={{ width: '100%', height: '8px', background: 'rgba(247,251,252,0.15)' }}>
          <div
            style={{ width: `${levelProgress}%`, height: '100%', background: 'var(--ticket)', transition: 'width 0.6s ease-out' }}
          />
        </div>
      </div>}
    </nav>
  );
}