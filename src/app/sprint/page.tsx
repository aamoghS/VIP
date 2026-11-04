"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { SignInGate, SignedInAs } from "@/components/SignInGate";
import { api } from "@/trpc/react";
import { Btn, ErrorLine, HUD, Panel, hint } from "./ui";
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

const focusCss = `
.sprint-root button:focus-visible,.sprint-root input:focus-visible,.sprint-root textarea:focus-visible,.sprint-root pre:focus-visible,.sprint-root a:focus-visible{outline:3px solid var(--ink);outline-offset:2px;box-shadow:0 0 0 6px var(--ticket)}
.sprint-root textarea,.sprint-root input[type=text]{box-sizing:border-box}
`;

function SprintApp() {
  const params = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCode(load());
    setReady(true);
  }, []);

  const enter = useCallback((next: string) => {
    save(next);
    setCode(next);
  }, []);
  const leave = useCallback(() => {
    save(null);
    setCode(null);
  }, []);

  return (
    <div className="sprint-root" style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
      <style>{focusCss}</style>
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
    <Btn variant="ghost" onClick={onLeave} style={{ fontSize: "1.1rem", minHeight: "2.5rem" }}>
      <LogOut size={16} aria-hidden /> Leave room
    </Btn>
  );

  if (!data) {
    return (
      <Panel>
        {query.error ? (
          <>
            <h1 style={{ fontFamily: HUD, fontSize: "1.9rem", fontWeight: 400, margin: 0 }}>Cannot reach room {code}</h1>
            <ErrorLine message={query.error.message} />
            <div style={{ marginTop: "1rem" }}>{leaveBtn}</div>
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
  const common = { code, team, state, mission, members, me, refresh };
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
      <header style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontFamily: HUD, fontSize: "2.2rem", fontWeight: 400, margin: 0 }}>
            {data.className}
          </h1>
          <p style={{ ...hint, margin: 0 }}>
            Room {code} - Team {team}: {state.teams[team].name || "unnamed"} - Round {state.round}
          </p>
        </div>
        {leaveBtn}
      </header>
      <div style={{ marginBottom: "1rem" }}><SignedInAs /></div>
      {view}
    </>
  );
}

export default function SprintPage() {
  return (
    <Suspense fallback={<div style={{ padding: "1.5rem" }}>Loading...</div>}>
      <SprintApp />
    </Suspense>
  );
}
