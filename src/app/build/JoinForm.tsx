"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { LogIn } from "lucide-react";
import { api } from "@/trpc/react";
import type { TeamId } from "@/lib/sprint/types";
import { AccountHeader } from "@/components/SignInGate";
import {
  ErrorLine,
  MONO,
  Panel,
  SPACE,
  STEP,
  SubmitRow,
  TextField,
  choiceStyle,
  hint,
  labelStyle,
  radioStyle,
} from "./ui";

export function JoinForm({ initialCode, onJoined }: { initialCode: string; onJoined: (code: string) => void }) {
  const join = api.room.join.useMutation({
    onSuccess: (_d, v) => onJoined(v.code),
  });
  const form = useForm({
    defaultValues: { code: initialCode.toUpperCase().slice(0, 6), team: "A" as TeamId, name: "" },
    onSubmit: async ({ value }) => {
      const needsName = !room.data?.state.teams[value.team].name;
      await join.mutateAsync({ code: value.code.trim().toUpperCase(), team: value.team, name: needsName ? value.name.trim() : undefined }).catch(() => undefined);
    },
  });
  const values = useStore(form.store, (s) => s.values);
  const room = api.room.get.useQuery({ code: values.code }, { enabled: values.code.length === 6, retry: false });
  const needsName = !room.data?.state.teams[values.team].name;
  const missing = [
    values.code.trim().length !== 6 && "a 6 character room code",
    needsName && values.name.trim().length === 0 && "a group name",
  ].filter(Boolean) as string[];

  return (
    <>
      <AccountHeader title="Join your class sprint" meta="Get the room code from your teacher." />
      <Panel style={{ maxWidth: 560 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          style={{ display: "grid", gap: SPACE[4] }}
        >
          <form.Field
            name="code"
            validators={{
              onChange: ({ value }) => (value.trim().length === 6 ? undefined : "Room codes have 6 characters."),
              onBlur: ({ value }) => (value.trim().length === 6 ? undefined : "Room codes have 6 characters."),
            }}
          >
            {(field) => (
              <TextField
                field={field}
                transform={(v) => v.toUpperCase()}
                id="room-code"
                label="Room code (6 characters)"
                maxLength={6}
                autoComplete="off"
                autoCapitalize="characters"
                inputStyle={{ fontFamily: MONO, fontSize: "var(--step-2, 1.625rem)", letterSpacing: "0.2em", minHeight: 56 }}
              />
            )}
          </form.Field>
          <form.Field name="team">
            {(field) => (
              <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                <legend style={labelStyle}>Your team</legend>
                <div style={{ display: "flex", gap: SPACE[3], flexWrap: "wrap" }}>
                  {(["A", "B"] as const).map((t) => (
                    <label key={t} style={{ ...choiceStyle(field.state.value === t), flex: "1 1 8rem" }}>
                      <input
                        type="radio"
                        name="team"
                        value={t}
                        data-hit-expanded
                        checked={field.state.value === t}
                        onChange={() => field.handleChange(t)}
                        style={radioStyle}
                      />
                      Team {t}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </form.Field>
          {room.data && !needsName ? (
            <p style={{ ...hint, fontSize: STEP.s0 }}>Team {values.team} is called {room.data.state.teams[values.team].name}.</p>
          ) : (
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (needsName && !value.trim() ? "Enter a group name." : undefined),
                onBlur: ({ value }) => (needsName && !value.trim() ? "Enter a group name." : undefined),
              }}
            >
              {(field) => (
                <TextField
                  field={field}
                  id="group-name"
                  label="Group name"
                  maxLength={30}
                  autoComplete="off"
                  help="Pick a name for your team. Your teacher sees your account name next to your answers."
                />
              )}
            </form.Field>
          )}
          <SubmitRow disabled={missing.length > 0 || join.isPending} missing={missing}>
            <LogIn size={18} aria-hidden /> {join.isPending ? "Joining..." : "Join room"}
          </SubmitRow>
          <ErrorLine message={join.error?.message ?? (values.code.length === 6 ? room.error?.message : undefined)} />
        </form>
      </Panel>
    </>
  );
}
