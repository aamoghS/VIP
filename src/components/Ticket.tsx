import React from "react";
import s from "./ticket.module.css";

type TicketProps = {
  stub?: React.ReactNode;
  /** Small secondary line under the stub label (13px). */
  stubNote?: React.ReactNode;
  tone?: "accent" | "plain" | "dashed";
  /** Draws the punch hole. On a plain ticket the hole gets a 4px yellow ring (the "received" look). */
  punched?: boolean;
  size?: "md" | "sm";
  /** Stub-less variant: cuts a small semicircle notch into the left edge. */
  notch?: boolean;
  tearing?: boolean;
  as?: "div" | "section" | "button";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
} & React.HTMLAttributes<HTMLElement>;

export function Ticket({
  stub,
  stubNote,
  tone = "plain",
  punched = false,
  size = "md",
  notch = false,
  tearing = false,
  as = "div",
  className,
  style,
  children,
  type,
  ...rest
}: TicketProps) {
  const hasStub = stub !== undefined && stub !== null && stub !== false;
  const classes = [
    s.ticket,
    s[tone],
    size === "sm" ? s.sm : "",
    tearing ? s.tearing : "",
    notch && !hasStub && !punched ? s.notch : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const extra = as === "button" ? { type: type ?? "button" } : {};
  const stubClass = [s.stub, punched ? s.hasPunch : ""].filter(Boolean).join(" ");
  const labelClass = [s.label, typeof stub === "string" && stub.length > 4 ? s.vertical : ""].filter(Boolean).join(" ");
  return React.createElement(
    as,
    { ...rest, ...extra, className: classes, style },
    hasStub || punched || stubNote ? (
      <span className={stubClass} aria-hidden={punched && !hasStub && !stubNote ? true : undefined}>
        {punched && <span className={s.punch} aria-hidden="true" />}
        {hasStub && <span className={labelClass}>{stub}</span>}
        {stubNote && <span className={s.note}>{stubNote}</span>}
      </span>
    ) : null,
    <span className={s.body} style={{ display: "block" }}>{children}</span>,
  );
}
