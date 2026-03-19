"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Zap, Trophy, Sparkles, BarChart3 } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="glass-sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Sparkles size={20} color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <h1>VIP</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link
            href="/toolbox"
            className={`nav-item ${isActive('/toolbox') ? 'active' : ''}`}
          >
            <Wrench className="icon" />
            <span>The Toolbox</span>
          </Link>
        </li>
        <li>
          <Link
            href="/sprint"
            className={`nav-item ${isActive('/sprint') ? 'active' : ''}`}
          >
            <Zap className="icon" />
            <span>The Sprint</span>
          </Link>
        </li>
        <li>
          <Link
            href="/room"
            className={`nav-item ${isActive('/room') ? 'active' : ''}`}
          >
            <Trophy className="icon" />
            <span>The Room</span>
          </Link>
        </li>
        <li>
          <Link
            href="/metrics"
            className={`nav-item ${isActive('/metrics') ? 'active' : ''}`}
          >
            <BarChart3 className="icon" />
            <span>Metrics</span>
          </Link>
        </li>
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
          Progress
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <div style={{ width: '100%', height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-blue))', borderRadius: '2px' }} />
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>35%</span>
        </div>
      </div>
    </nav>
  );
}