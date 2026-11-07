"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { LogIn, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useProgress } from "@/context/ProgressContext";
import type { Role } from "@/server/db/schema";
import {
  Btn,
  ErrorLine,
  Panel,
  SPACE,
  STEP,
  SubmitRow,
  TextField,
  choiceStyle,
  heading,
  hint,
  labelStyle,
  radioStyle,
  requiredText,
} from "@/app/build/ui";

const ROLE_LABEL: Record<Role, string> = { student: "Student", teacher: "Teacher" };

/** Shows children only for a signed-in account. Otherwise a sign-in / create-account card. */
export function SignInGate({ defaultRole, children }: { defaultRole: Role; children: ReactNode }) {
  const { playerName, authReady, signIn, signUp } = useProgress();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: { name: "", password: "", role: defaultRole },
    onSubmit: async ({ value }) => {
      setError("");
      const message = creating ? await signUp(value.name, value.password, value.role) : await signIn(value.name, value.password);
      if (message) setError(message);
    },
  });

  if (!authReady) return <p style={hint} role="status">Checking sign-in...</p>;
  if (playerName) return <>{children}</>;

  return (
    <Panel style={{ maxWidth: 560 }}>
      <h1 style={{ ...heading, fontSize: "var(--step-3, 2.5rem)", marginBottom: SPACE[1] }}>
        {creating ? "Create your account" : "Sign in"}
      </h1>
      <p style={{ ...hint, fontSize: STEP.s0, marginBottom: SPACE[5] }}>
        {defaultRole === "teacher" ? "Teachers sign in to run a class sprint." : "Sign in to join your class sprint."}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        style={{ display: "grid", gap: SPACE[4] }}
      >
        <form.Field name="name" validators={{ onChange: requiredText("your name"), onBlur: requiredText("your name") }}>
          {(field) => (
            <TextField field={field} id="gate-name" label="Name" maxLength={24} autoComplete="username" />
          )}
        </form.Field>
        <form.Field name="password" validators={{ onChange: requiredText("your password"), onBlur: requiredText("your password") }}>
          {(field) => (
            <TextField
              field={field}
              id="gate-password"
              label="Password"
              type="password"
              autoComplete={creating ? "new-password" : "current-password"}
            />
          )}
        </form.Field>
        {creating ? (
          <form.Field name="role">
            {(field) => (
              <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                <legend style={labelStyle}>I am a</legend>
                <div style={{ display: "flex", gap: SPACE[3], flexWrap: "wrap" }}>
                  {(["student", "teacher"] as const).map((r) => (
                    <label key={r} style={{ ...choiceStyle(field.state.value === r), flex: "1 1 8rem" }}>
                      <input
                        type="radio"
                        name="gate-role"
                        value={r}
                        data-hit-expanded
                        checked={field.state.value === r}
                        onChange={() => field.handleChange(r)}
                        style={radioStyle}
                      />
                      {ROLE_LABEL[r]}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </form.Field>
        ) : null}
        <form.Subscribe selector={(s) => ({ values: s.values, submitting: s.isSubmitting })}>
          {({ values, submitting }) => {
            const missing = [!values.name.trim() && "name", !values.password && "password"].filter(Boolean) as string[];
            return (
              <SubmitRow
                disabled={missing.length > 0 || submitting}
                missing={missing}
                extra={
                  <Btn
                    variant="secondary"
                    onClick={() => {
                      setCreating((c) => !c);
                      setError("");
                    }}
                  >
                    {creating ? "I already have an account" : "Create account"}
                  </Btn>
                }
              >
                {creating ? <UserPlus size={18} aria-hidden /> : <LogIn size={18} aria-hidden />}
                {submitting ? "Working..." : creating ? "Create account" : "Sign in"}
              </SubmitRow>
            );
          }}
        </form.Subscribe>
        <ErrorLine message={error} />
      </form>
    </Panel>
  );
}

/** Page header with the account menu (name, role, Sign out, plus any extra items like Leave room / All rooms). */
export function AccountHeader({
  title,
  meta,
  actions,
  extra,
}: {
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  extra?: { label: string; onClick: () => void; icon?: ReactNode }[];
}) {
  const { playerName, playerRole, signOut } = useProgress();
  return (
    <PageHeader
      title={title}
      meta={meta}
      actions={actions}
      account={
        playerName
          ? { name: playerName, role: playerRole ? ROLE_LABEL[playerRole].toLowerCase() : "student", onSignOut: () => void signOut(), extra }
          : undefined
      }
    />
  );
}
