"use client";

import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export const HUD = "var(--font-hud), VT323, monospace";
export const MONO = "'JetBrains Mono', monospace";

export const panel: CSSProperties = {
  background: "var(--bg-elevated)",
  border: "3px solid var(--ink)",
  boxShadow: "5px 5px 0 var(--ticket)",
  padding: "1.25rem",
  color: "var(--text-primary)",
};

export const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.75rem",
  border: "3px solid var(--ink)",
  borderRadius: 0,
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
  fontFamily: "inherit",
  fontSize: "1rem",
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 700,
  fontSize: "1rem",
  marginBottom: "0.35rem",
  color: "var(--text-primary)",
};

export const hint: CSSProperties = { fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 };

export const heading: CSSProperties = {
  fontFamily: HUD,
  fontSize: "1.9rem",
  fontWeight: 400,
  margin: 0,
  color: "var(--text-primary)",
};

export function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ ...panel, ...style }}>{children}</section>;
}

export function Btn({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "solid",
  pressed,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "solid" | "ghost";
  pressed?: boolean;
  style?: CSSProperties;
}) {
  const solid = variant === "solid";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.6rem 1.1rem",
        minHeight: "2.75rem",
        border: "3px solid var(--ink)",
        borderRadius: 0,
        background: solid ? "var(--ink)" : "var(--bg-elevated)",
        color: solid ? "var(--ticket)" : "var(--text-primary)",
        fontFamily: HUD,
        fontSize: "1.35rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        boxShadow: "3px 3px 0 var(--ticket)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function ErrorLine({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "flex-start",
        margin: "0.75rem 0 0",
        padding: "0.6rem 0.75rem",
        border: "3px solid var(--ink)",
        background: "var(--accent-rose-dim)",
        fontSize: "0.95rem",
        fontWeight: 600,
        color: "var(--text-primary)",
      }}
    >
      <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
      <span>Error: {message}</span>
    </p>
  );
}

export function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" }}>
        {label}: {done} of {total} done
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        style={{ height: "1.1rem", border: "3px solid var(--ink)", background: "var(--bg-elevated)" }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--ink)", transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      tabIndex={0}
      aria-label="Python code"
      style={{
        background: "var(--ink)",
        color: "#f7fbfc",
        border: "3px solid var(--ink)",
        padding: "1rem 1.25rem",
        fontFamily: MONO,
        fontSize: "0.95rem",
        lineHeight: 1.6,
        overflowX: "auto",
        margin: "0.75rem 0",
      }}
    >
      {code}
    </pre>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.5rem",
        border: "2px solid var(--ink)",
        background: "var(--ticket)",
        color: "var(--ink)",
        fontFamily: MONO,
        fontSize: "0.8rem",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

export const OBJECTIVE_LABEL: Record<number, string> = {
  1: "Trace loop and if",
  2: "Fix boundary error",
  3: "Explain why",
  4: "Agile",
};
