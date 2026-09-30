"use client";

import { useState } from "react";
import { useProgress } from "@/context/ProgressContext";

const field = {
  width: "100%",
  background: "var(--bg-elevated)",
  color: "var(--ink)",
  border: "2px solid var(--ticket)",
  borderRadius: 0,
  padding: "0.35rem 0.45rem",
  font: "inherit",
  fontSize: "0.85rem",
} as const;

export default function PlayerLogin() {
  const { playerName, signIn, signUp, signOut } = useProgress();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (playerName) {
    return (
      <div style={{ marginBottom: "0.9rem" }}>
        <div style={{ color: "var(--ticket)", fontWeight: 700, fontSize: "0.95rem" }}>{playerName}</div>
        <button
          type="button"
          onClick={() => void signOut()}
          style={{ marginTop: "0.35rem", background: "transparent", color: "#d5e0e8", border: "2px solid #d5e0e8", padding: "0.2rem 0.45rem", cursor: "pointer", font: "inherit", fontSize: "0.75rem" }}
        >
          Sign out
        </button>
      </div>
    );
  }

  async function submit(mode: "login" | "create") {
    setPending(true);
    setError("");
    const message = mode === "create" ? await signUp(name, password) : await signIn(name, password);
    setPending(false);
    if (message) setError(message);
    else {
      setName("");
      setPassword("");
    }
  }

  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.9rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        void submit("login");
      }}
    >
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Name"
        aria-label="Name"
        autoComplete="username"
        style={field}
      />
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        aria-label="Password"
        type="password"
        autoComplete="current-password"
        style={field}
      />
      <div style={{ display: "flex", gap: "0.35rem" }}>
        <button type="submit" disabled={pending} className="play-btn" style={{ fontSize: "1.05rem", padding: "0.2rem 0.45rem" }}>
          Sign in
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => void submit("create")}
          style={{ background: "transparent", color: "var(--ticket)", border: "2px solid var(--ticket)", padding: "0.2rem 0.45rem", cursor: "pointer", font: "inherit", fontSize: "0.75rem" }}
        >
          Create
        </button>
      </div>
      {error && <div style={{ color: "#ffb4b6", fontSize: "0.75rem" }}>{error}</div>}
    </form>
  );
}
