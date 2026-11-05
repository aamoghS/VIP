"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { AccountHeader } from "@/components/SignInGate";
import { SignInGate } from "@/components/SignInGate";
import { api } from "@/trpc/react";
import { Btn, ErrorLine, MONO, Panel, SPACE, heading, hint, sprintCss } from "./ui";
import { JoinForm } from "./JoinForm";
import { Lobby } from "./Lobby";
import { Planning } from "./Planning";
import { Work } from "./Work";
import { Standup } from "./Standup";
import { Review } from "./Review";
import { Retro } from "./Retro";

const KEY = "sprint-room";

function load(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw && raw.length === 6 ? raw : null;
  } catch {
    return null;
  }
}

function save(code: string | null) {
  try {
    if (code) localStorage.setItem(KEY, code);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: page still works */
  }
}

function SprintApp() {
  const params = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // A ?code= link opens that room directly. The room view shows the join form
    // only if this account is not a member yet, so a student who already joined
    // (on another device, or before storage was cleared) lands back on their team.
    const fromLink = (params.get("code") ?? "").trim().toUpperCase();
    const next = fromLink.length === 6 ? fromLink : load();
    if (next) save(next);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only, read after hydration
    setCode(next);
    setReady(true);
  }, [params]);

  const enter = useCallback((next: string) => {
    save(next);
    setCode(next);
  }, []);
  const leave = useCallback(() => {
    save(null);
    setCode(null);
  }, []);

  return (
    <div className="sprint-root page">
      <style>{sprintCss}</style>
      <SignInGate defaultRole="student">
        {!ready ? null : code ? (
          <Room code={code} onLeave={leave} />
        ) : (
          <JoinForm initialCode={params.get("code") ?? ""} onJoined={enter} />
        )}
      </SignInGate>
    </div>
  );
}

function Room({ code, onLeave }: { code: string; onLeave: () => void }) {
  const utils = api.useUtils();
  const query = api.room.get.useQuery({ code }, { refetchInterval: 2000, retry: false });
  const refresh = useCallback(() => void utils.room.get.invalidate({ code }), [utils, code]);

  const data = query.data;
  const leaveBtn = (
    <Btn variant="secondary" onClick={onLeave}>
      <LogOut size={16} aria-hidden /> Leave room
    </Btn>
  );
  const leaveItem = [{ label: "Leave room", onClick: onLeave, icon: <LogOut size={16} aria-hidden /> }];

  if (!data) {
    return (
      <Panel>
        {query.error ? (
          <>
            <h1 style={heading}>Cannot reach room {code}</h1>
            <ErrorLine message={query.error.message} />
            <div style={{ marginTop: SPACE[4] }}>{leaveBtn}</div>
          </>
        ) : (
          <p style={hint} role="status">Loading room {code}...</p>
        )}
      </Panel>
    );
  }

  const { state, mission, members, me } = data;
  if (!me) {
    return <JoinForm initialCode={code} onJoined={refresh} />;
  }
  const team = me.team;
  const common = { code, team, state, mission, members, me, refresh, myReflection: data.myReflection };
  let view;
  switch (state.phase) {
    case "lobby":
      view = <Lobby className={data.className} {...common} />;
      break;
    case "planning":
      view = <Planning {...common} />;
      break;
    case "teamA":
    case "teamB":
      view = <Work {...common} />;
      break;
    case "standup":
      view = <Standup {...common} />;
      break;
    case "review":
      view = <Review {...common} />;
      break;
    case "retro":
      view = <Retro {...common} />;
      break;
  }

  return (
    <>
      <AccountHeader
        title={data.className}
        meta={
          <>
            Room <span style={{ fontFamily: MONO }}>{code}</span> · Team {team}: {state.teams[team].name || "unnamed"} · Round {state.round}
          </>
        }
        extra={leaveItem}
      />
      {view}
    </>
  );
}

export default function SprintPage() {
  return (
    <Suspense fallback={<p style={hint} role="status">Loading...</p>}>
      <SprintApp />
    </Suspense>
  );
}
