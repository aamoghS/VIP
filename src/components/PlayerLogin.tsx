"use client";

import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useProgress } from "@/context/ProgressContext";

const field = {
  width: "100%",
  minHeight: "44px",
  background: "var(--surface)",
  color: "var(--ink)",
  border: "2px solid var(--ticket)",
  borderRadius: 0,
  padding: "0.35rem 0.5rem",
  font: "inherit",
  fontSize: "var(--step-0)",
} as const;

const errorStyle = { color: "#ffb4b6", fontSize: "var(--step--1)", marginTop: "2px" } as const;

function validateName(value: string) {
  const v = value.trim();
  return v.length < 2 || v.length > 24 ? "Name must be 2 to 24 characters." : undefined;
}

function validatePassword(value: string) {
  return value.length < 4 ? "Password must be 4 or more characters." : undefined;
}

export default function PlayerLogin() {
  const { playerName, playerRole, signIn, signUp, signOut } = useProgress();
  const [error, setError] = useState("");
  const mode = useRef<"login" | "create">("login");
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: { name: "", password: "" },
    onSubmit: async ({ value, formApi }) => {
      setError("");
      const message = mode.current === "create" ? await signUp(value.name, value.password) : await signIn(value.name, value.password);
      if (message) setError(message);
      else formApi.reset();
    },
  });

  if (playerName) {
    return (
      <div className="pl-user" style={{ marginBottom: "0.9rem" }}>
        <div style={{ color: "var(--ticket)", fontWeight: 700, fontSize: "var(--step-0)" }}>{playerName}{playerRole === "teacher" ? " (Teacher)" : ""}</div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="btn"
          style={{ marginTop: "0.35rem", color: "#d5e0e8", borderColor: "#d5e0e8", padding: "0.2rem 0.75rem", fontSize: "var(--step--1)" }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="pl">
    <button type="button" className="btn btn-primary pl-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
      Sign in
    </button>
    <form
      className="pl-form"
      data-open={open}
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.9rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        mode.current = "login";
        void form.handleSubmit();
      }}
    >
      <form.Field name="name" validators={{ onChange: ({ value }) => validateName(value), onSubmit: ({ value }) => validateName(value) }}>
        {(f) => (
          <div>
            <input
              value={f.state.value}
              onChange={(event) => f.handleChange(event.target.value)}
              onBlur={f.handleBlur}
              placeholder="Name"
              aria-label="Name"
              autoComplete="username"
              aria-invalid={f.state.meta.errors.length > 0 && f.state.meta.isTouched}
              style={field}
            />
            {f.state.meta.isTouched && f.state.meta.errors[0] && <div style={errorStyle}>{String(f.state.meta.errors[0])}</div>}
          </div>
        )}
      </form.Field>
      <form.Field name="password" validators={{ onChange: ({ value }) => validatePassword(value), onSubmit: ({ value }) => validatePassword(value) }}>
        {(f) => (
          <div>
            <input
              value={f.state.value}
              onChange={(event) => f.handleChange(event.target.value)}
              onBlur={f.handleBlur}
              placeholder="Password"
              aria-label="Password"
              type="password"
              autoComplete="current-password"
              aria-invalid={f.state.meta.errors.length > 0 && f.state.meta.isTouched}
              style={field}
            />
            {f.state.meta.isTouched && f.state.meta.errors[0] && <div style={errorStyle}>{String(f.state.meta.errors[0])}</div>}
          </div>
        )}
      </form.Field>
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1, padding: "0.25rem 0.5rem" }}>
              Sign in
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="btn"
              onClick={() => {
                mode.current = "create";
                void form.handleSubmit();
              }}
              style={{ flex: 1, padding: "0.25rem 0.5rem", color: "var(--ticket)", borderColor: "var(--ticket)" }}
            >
              Create
            </button>
          </div>
        )}
      </form.Subscribe>
      {error && <div style={errorStyle} role="alert">{error}</div>}
    </form>
    </div>
  );
}
