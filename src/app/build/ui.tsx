"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { AlertTriangle } from "lucide-react";

/* Design tokens. Each falls back to the value from the spec so a page still reads right
   if globals.css has not defined it. Yellow (--ticket) means one thing: you / your turn /
   current / the primary action. */
export const INK = "var(--ink)";
export const INK2 = "var(--ink-2, #314052)";
export const SURFACE = "var(--surface, #f7fbfc)";
export const GROUND = "var(--ground, #e4ebf0)";
export const TICKET = "var(--ticket, #e3a008)";
export const OK = "var(--ok, #0e7c66)";
export const BAD = "var(--bad, #c5363a)";
export const HAIRLINE = "1px solid color-mix(in srgb, var(--ink) 30%, transparent)";

export const MONO = "var(--font-mono, 'JetBrains Mono'), ui-monospace, Menlo, Consolas, monospace";

export const STEP = {
  s1: "var(--step--1, 0.8125rem)",
  s0: "var(--step-0, 1rem)",
  s1up: "var(--step-1, 1.25rem)",
  s2: "var(--step-2, 1.625rem)",
  s3: "var(--step-3, 2.5rem)",
  s4: "var(--step-4, 4rem)",
} as const;

export const SPACE = {
  1: "var(--space-1, 4px)",
  2: "var(--space-2, 8px)",
  3: "var(--space-3, 12px)",
  4: "var(--space-4, 16px)",
  5: "var(--space-5, 24px)",
  6: "var(--space-6, 32px)",
  7: "var(--space-7, 48px)",
} as const;

/** Top-level container: the only box that casts the offset shadow (with the primary button). */
const panel: CSSProperties = {
  background: SURFACE,
  border: `3px solid ${INK}`,
  boxShadow: `4px 4px 0 ${INK}`,
  padding: SPACE[5],
  color: INK,
  minWidth: 0,
};

export const fieldStyle: CSSProperties = {
  width: "100%",
  minHeight: 44,
  padding: "10px 12px",
  border: `2px solid ${INK}`,
  borderRadius: 0,
  background: SURFACE,
  color: INK,
  font: "inherit",
  fontSize: STEP.s0,
  boxSizing: "border-box",
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 700,
  fontSize: STEP.s0,
  marginBottom: SPACE[1],
  color: INK,
};

export const hint: CSSProperties = { fontSize: STEP.s1, color: INK2, lineHeight: 1.5, margin: 0 };

/** Section heading (.section-title). */
export const heading: CSSProperties = {
  fontSize: STEP.s2,
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  margin: 0,
  color: INK,
};

/** Page title (.page-title). Scales down on phones so long class names fit. */
export const pageTitle: CSSProperties = {
  fontSize: `clamp(${STEP.s2}, 7vw, ${STEP.s3})`,
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  margin: 0,
  color: INK,
  overflowWrap: "anywhere",
};

/** Card title (step 1). */
export const cardTitle: CSSProperties = {
  fontSize: STEP.s1up,
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
  color: INK,
};

/** Selected-state style for a full-row radio label. Neutral: ink ring, not yellow. */
export const choiceStyle = (selected: boolean, disabled = false): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: SPACE[3],
  minHeight: 44,
  padding: "10px 14px",
  border: `2px solid ${INK}`,
  background: selected ? GROUND : SURFACE,
  boxShadow: selected ? `inset 0 0 0 2px ${INK}` : "none",
  fontWeight: selected ? 700 : 400,
  color: INK,
  cursor: disabled ? "default" : "pointer",
});

export const radioStyle: CSSProperties = { width: 20, height: 20, margin: 0, flexShrink: 0, accentColor: "var(--ink)" };

/** Shared responsive rules for the sprint pages. */
export const sprintCss = `
.sprint-root button:focus-visible,.sprint-root input:focus-visible,.sprint-root textarea:focus-visible,.sprint-root pre:focus-visible,.sprint-root a:focus-visible,.sprint-root h2:focus-visible,.sprint-root [tabindex]:focus-visible{outline:3px solid var(--ink);outline-offset:2px}
.sprint-root textarea,.sprint-root input[type=text],.sprint-root input[type=password]{box-sizing:border-box}
.sprint-root{min-width:0;overflow-wrap:anywhere}
.sprint-root *{font-variant-ligatures:none}
.sprint-root pre{overflow-wrap:normal}
.poker{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;max-width:28rem}
.poker button{width:100%;padding-left:0 !important;padding-right:0 !important}
.on-accent p,.on-accent label,.on-accent span,.on-accent div,.on-accent h2{color:var(--ink) !important}
.on-accent [role=alert],.on-accent [role=alert] *{color:var(--bad,#c5363a) !important}
.sprint-root .result-box:focus-visible,.sprint-root .result-box:focus{outline:none}
.story-chips{display:none}
.you-bar{border-left:8px solid var(--ticket,#e3a008) !important}
.est{position:relative}
.est::before{content:"";position:absolute;left:-3px;top:50%;width:8px;height:16px;margin-top:-8px;border-radius:0 8px 8px 0;background:var(--ground,#e4ebf0);border:3px solid var(--ink);border-left:0;box-sizing:border-box}
.scroll-fade{position:relative}
.scroll-fade>.sf-in{overflow-x:auto}
.scroll-fade[data-more=true]::after{content:"";position:absolute;top:0;right:0;bottom:0;width:28px;pointer-events:none;background:linear-gradient(90deg,transparent,var(--fade,var(--surface,#f7fbfc)))}
.mat-help-short{display:none}
.mat-help-short summary{list-style:none}
.mat-help-short summary::-webkit-details-marker{display:none}
.mat-help-short .chev{transition:transform .2s}
.mat-help-short details[open] .chev{transform:rotate(180deg)}
.on-accent .btn-locked{background:transparent !important;border:3px solid var(--ink) !important;color:color-mix(in srgb,var(--ink) 55%,transparent) !important}
@media (prefers-reduced-motion:reduce){.mat-help-short .chev{transition:none}}
.mat thead th{word-break:keep-all;overflow-wrap:normal}
.mat td{min-width:120px}
.mat td input{min-width:120px}
.mat-wrap{margin:0;border:3px solid var(--ink);width:max-content;min-width:100%}
.mat{border-collapse:collapse;width:100%;font-family:${MONO}}
.mat th,.mat td{padding:0}
.mat thead th{background:var(--surface,#f7fbfc);color:var(--ink);font-weight:700;text-align:center;vertical-align:bottom;padding:8px 12px;border-bottom:3px solid var(--ink);border-left:3px solid var(--ink)}
.mat thead th.mat-head-code{background:#1B2333;color:#f7fbfc;text-align:left;border-left:0;font-weight:400}
.mat tbody th.mat-code{background:#1B2333;color:#f7fbfc;text-align:left;font-weight:400;white-space:pre;box-shadow:inset 0 0 0 0 var(--ticket);min-width:12rem}
.mat-code-in{display:flex;align-items:stretch;min-height:48px}
.mat-n{flex:0 0 32px;display:flex;align-items:center;justify-content:center;color:#8fa0b8;font-size:var(--step--1,0.8125rem)}
.mat-line{display:flex;align-items:center;padding:0 12px 0 4px;white-space:pre}
.mat tbody tr:focus-within th.mat-code{box-shadow:inset 6px 0 0 0 var(--ticket)}
.mat td{background:var(--surface,#f7fbfc);border-top:3px solid var(--ink);border-left:3px solid var(--ink);min-width:5rem}
.mat td input{border:0 !important;width:100%;min-width:5rem}
.mat tbody tr:first-child td{border-top:0}
@media (max-width:640px){
.role-strip{grid-template-columns:repeat(2,minmax(0,1fr)) !important}
.story-list{display:none !important}
.story-chips{display:flex}
.mat-help-full{display:none}
.mat-wrap{width:auto;min-width:0;border:0}
.mat,.mat tbody,.mat tr,.mat td,.mat tbody th{display:block;width:100%;box-sizing:border-box}
.mat thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.mat tr{margin:0 0 12px;border:3px solid var(--ink)}
.mat tbody th.mat-code{min-width:0;white-space:pre-wrap}
.mat td{border:0 !important;border-top:3px solid var(--ink) !important;padding:8px 10px;min-width:0}
.mat td::before{content:attr(data-var);display:block;font-family:${MONO};font-size:13px;margin-bottom:4px;color:var(--ink)}
.mat td input{min-width:0;min-height:44px;border:3px solid var(--ink) !important}
.mat tbody tr:first-child td{border-top:3px solid var(--ink) !important}
.mat-help-short{display:block}
}
`;

/** Wraps a wide table: scrolls sideways and shows a right-edge fade while more is hidden. */
export function ScrollFade({ children, fade, className, style, ...rest }: { children: ReactNode; fade?: string; className?: string; style?: CSSProperties } & Record<string, unknown>) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = inner.current;
    const w = wrap.current;
    if (!el || !w) return;
    const update = () => w.setAttribute("data-more", String(el.scrollWidth > el.clientWidth + 1 && el.scrollLeft + el.clientWidth < el.scrollWidth - 1));
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);
  return (
    <div ref={wrap} className={`scroll-fade ${className ?? ""}`} style={{ ...(fade ? { ["--fade" as string]: fade } : null), ...style }}>
      <div ref={inner} className="sf-in" {...(rest as object)}>{children}</div>
    </div>
  );
}

export function Panel({ children, style, tight }: { children: ReactNode; style?: CSSProperties; tight?: boolean }) {
  return <section style={{ ...panel, ...(tight ? { padding: SPACE[4] } : null), ...style }}>{children}</section>;
}

type Variant = "primary" | "secondary" | "quiet" | "solid" | "ghost";

export function Btn({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
  pressed,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: Variant;
  pressed?: boolean;
  style?: CSSProperties;
}) {
  // "solid" and "ghost" are the old names: solid = primary, ghost = secondary.
  const kind = variant === "solid" ? "primary" : variant === "ghost" ? "secondary" : variant;
  const on = pressed ? { background: INK, color: SURFACE } : null;
  const lockedPrimary = kind === "primary" && disabled;
  const dim: CSSProperties = lockedPrimary
    ? { background: INK, color: "color-mix(in srgb, var(--ticket, #e3a008) 50%, transparent)", opacity: 1, boxShadow: "none", transform: "none", cursor: "not-allowed" }
    : disabled
      ? { color: "color-mix(in srgb, var(--ink) 55%, transparent)", opacity: 1, cursor: "not-allowed" }
      : {};
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={kind === "primary" ? (lockedPrimary ? "btn btn-primary btn-locked" : "btn btn-primary") : "btn"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACE[2],
        padding: "8px 16px",
        minHeight: 44,
        borderRadius: 0,
        font: "inherit",
        fontSize: kind === "quiet" ? STEP.s1 : STEP.s0,
        fontWeight: 600,
        ...on,
        ...dim,
        ...style,
      }}
    >
      {lockedPrimary ? <Lock size={16} aria-hidden="true" /> : null}
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
        gap: SPACE[2],
        alignItems: "flex-start",
        margin: `${SPACE[3]} 0 0`,
        padding: "8px 12px",
        border: `2px solid ${BAD}`,
        background: `color-mix(in srgb, ${BAD} 10%, ${SURFACE})`,
        fontSize: STEP.s0,
        fontWeight: 700,
        color: INK,
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
      <div style={{ fontWeight: 700, fontSize: STEP.s0, marginBottom: SPACE[1] }}>
        {label}: <span style={{ fontFamily: MONO }}>{done}</span> of <span style={{ fontFamily: MONO }}>{total}</span> done
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        style={{ height: 16, border: `2px solid ${INK}`, background: SURFACE }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: INK, transition: "width 0.3s" }} />
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
        background: "#1B2333",
        color: "#f7fbfc",
        fontVariantLigatures: "none",
        padding: `${SPACE[3]} ${SPACE[4]}`,
        fontFamily: MONO,
        fontSize: STEP.s0,
        lineHeight: 1.6,
        overflowX: "auto",
        margin: `${SPACE[3]} 0`,
      }}
    >
      {code}
    </pre>
  );
}

/** Quiet badge (.badge): 1px ink border, no fill, no shadow. */
export function Badge({ children, mono }: { children: ReactNode; mono?: boolean }) {
  return (
    <span
      className="badge"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        border: `1px solid ${INK}`,
        background: "transparent",
        color: INK,
        fontFamily: mono ? MONO : "inherit",
        fontSize: STEP.s1,
        fontWeight: 400,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}

/* ---------- TanStack Form field ---------- */

/** The slice of a TanStack Form field the inputs need. */
export type FieldLike = {
  name: string;
  state: { value: string; meta: { errors: unknown[]; isTouched: boolean } };
  handleChange: (v: string) => void;
  handleBlur: () => void;
};

const errorText = (e: unknown) => (typeof e === "string" ? e : e && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message) : "");

function fieldErrors(field: Pick<FieldLike, "state">): string[] {
  return field.state.meta.isTouched ? field.state.meta.errors.map(errorText).filter(Boolean) : [];
}

export function TextField({
  field,
  id,
  label,
  help,
  multiline,
  rows = 3,
  maxLength,
  type = "text",
  autoComplete,
  autoCapitalize,
  readOnly,
  counter,
  inputStyle,
  transform,
}: {
  field: FieldLike;
  id: string;
  label: ReactNode;
  help?: ReactNode;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  type?: "text" | "password";
  autoComplete?: string;
  autoCapitalize?: string;
  readOnly?: boolean;
  /** Show "N of MAX characters" under the field. */
  counter?: boolean;
  inputStyle?: CSSProperties;
  /** Applied to the typed value before it is stored (e.g. upper-casing a room code). */
  transform?: (v: string) => string;
}) {
  const errors = fieldErrors(field);
  const describedBy = [help ? `${id}-help` : "", errors.length ? `${id}-err` : "", counter ? `${id}-count` : ""].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: field.name,
    value: field.state.value,
    maxLength,
    readOnly,
    autoComplete,
    autoCapitalize,
    "aria-invalid": errors.length ? true : undefined,
    "aria-describedby": describedBy,
    onBlur: field.handleBlur,
    onChange: (e: { target: { value: string } }) => field.handleChange(transform ? transform(e.target.value) : e.target.value),
    style: { ...fieldStyle, ...(multiline ? { resize: "vertical" as const } : null), ...(errors.length ? { borderColor: BAD } : null), ...inputStyle },
  };
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {multiline ? <textarea rows={rows} {...common} /> : <input type={type} {...common} />}
      {counter && maxLength ? (
        <p id={`${id}-count`} style={{ ...hint, marginTop: SPACE[1] }}>{field.state.value.length} of {maxLength} characters</p>
      ) : null}
      {help ? <p id={`${id}-help`} style={{ ...hint, marginTop: SPACE[1] }}>{help}</p> : null}
      {errors.length ? (
        <p id={`${id}-err`} role="alert" style={{ margin: `${SPACE[1]} 0 0`, fontSize: STEP.s1, fontWeight: 700, color: BAD }}>
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}

/** Submit button plus the reason it is disabled ("Missing: ..."). The reason stays hidden until the
    user first touches a field in the surrounding form (or `touched` is passed). */
export function SubmitRow({
  disabled,
  missing,
  children,
  extra,
  touched,
}: {
  disabled: boolean;
  missing: string[];
  children: ReactNode;
  extra?: ReactNode;
  touched?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const on = () => setSeen(true);
    form.addEventListener("input", on);
    form.addEventListener("focusout", on);
    return () => {
      form.removeEventListener("input", on);
      form.removeEventListener("focusout", on);
    };
  }, []);
  const show = touched ?? seen;
  return (
    <div ref={ref} style={{ display: "flex", gap: SPACE[3], alignItems: "center", flexWrap: "wrap" }}>
      <Btn type="submit" disabled={disabled}>{children}</Btn>
      {extra}
      {show && missing.length > 0 ? (
        <span role="status" style={{ fontWeight: 700, fontSize: STEP.s0, color: INK2 }}>Missing: {missing.join(", ")}</span>
      ) : null}
    </div>
  );
}

export const requiredText = (what: string) => ({ value }: { value: string }) => (value.trim() ? undefined : `Enter ${what}.`);

/** "1 pt", "2 pts". */
export const pts = (n: number) => `${n} ${n === 1 ? "pt" : "pts"}`;

export { OBJECTIVE_LABEL } from "@/lib/sprint/objectives";
