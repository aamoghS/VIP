"use client";

import { useState, type ReactNode } from "react";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { useProgress, type PlayerRole } from "@/context/ProgressContext";
import { Btn, ErrorLine, HUD, Panel, fieldStyle, hint, labelStyle } from "@/app/sprint/ui";

const ROLE_LABEL: Record<PlayerRole, string> = { student: "Student", teacher: "Teacher" };

/** Shows children only for a signed-in account. Otherwise a sign-in / create-account card. */
export function SignInGate({ defaultRole, children }: { defaultRole: PlayerRole; children: ReactNode }) {
  const { playerName, authReady, signIn, signUp } = useProgress();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<PlayerRole>(defaultRole);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!authReady) return <p style={hint} role="status">Checking sign-in...</p>;
  if (playerName) return <>{children}</>;

  async function submit(mode: "login" | "create") {
    setPending(true);
    setError("");
    const message = mode === "create" ? await signUp(name, password, role) : await signIn(name, password);
    setPending(false);
    if (message) setError(message);
  }

  const ready = name.trim().length > 0 && password.length > 0;

  return (
    <Panel style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1 style={{ fontFamily: HUD, fontSize: "2.4rem", fontWeight: 400, margin: "0 0 0.25rem" }}>
        {creating ? "Create your account" : "Sign in"}
      </h1>
      <p style={{ ...hint, marginTop: 0 }}>
        {defaultRole === "teacher" ? "Teachers sign in to run a class sprint." : "Sign in to join your class sprint."}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) void submit(creating ? "create" : "login");
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="gate-name" style={labelStyle}>Name</label>
          <input
            id="gate-name"
            type="text"
            value={name}
            maxLength={24}
            autoComplete="username"
            onChange={(e) => setName(e.target.value)}
            style={fieldStyle}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="gate-password" style={labelStyle}>Password</label>
          <input
            id="gate-password"
            type="password"
            value={password}
            autoComplete={creating ? "new-password" : "current-password"}
            onChange={(e) => setPassword(e.target.value)}
            style={fieldStyle}
          />
        </div>
        {creating ? (
          <fieldset style={{ border: "none", padding: 0, margin: "0 0 1rem" }}>
            <legend style={labelStyle}>I am a</legend>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {(["student", "teacher"] as const).map((r) => (
                <label
                  key={r}
                  style={{
                    flex: "1 1 8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    border: "3px solid var(--ink)",
                    background: role === r ? "var(--ticket)" : "var(--bg-elevated)",
                    color: role === r ? "var(--ink)" : "var(--text-primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <input type="radio" name="gate-role" value={r} checked={role === r} onChange={() => setRole(r)} />
                  {ROLE_LABEL[r]}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Btn type="submit" disabled={!ready || pending}>
            {creating ? <UserPlus size={18} aria-hidden /> : <LogIn size={18} aria-hidden />}
            {pending ? "Working..." : creating ? "Create account" : "Sign in"}
          </Btn>
          <Btn
            variant="ghost"
            onClick={() => {
              setCreating((c) => !c);
              setError("");
            }}
            style={{ fontSize: "1.1rem" }}
          >
            {creating ? "I already have an account" : "Create account"}
          </Btn>
        </div>
        <ErrorLine message={error} />
      </form>
    </Panel>
  );
}

/** "Signed in as NAME (Student) - Sign out" for page headers. */
export function SignedInAs() {
  const { playerName, playerRole, signOut } = useProgress();
  if (!playerName) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <span style={{ fontWeight: 700 }}>
        Signed in as {playerName} ({playerRole ? ROLE_LABEL[playerRole] : "Student"})
      </span>
      <Btn variant="ghost" onClick={() => void signOut()} style={{ fontSize: "1.1rem", minHeight: "2.5rem" }}>
        <LogOut size={16} aria-hidden /> Sign out
      </Btn>
    </div>
  );
}
