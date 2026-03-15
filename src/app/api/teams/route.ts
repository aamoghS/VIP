import { NextResponse } from 'next/server';

type SprintState = {
  sprint1Completed: boolean;
  sprint2Completed: boolean;
  sprint3Completed: boolean;
  dataSentToOtherTeam: any | null;
};

type SessionState = {
  GroupA: SprintState;
  GroupB: SprintState;
};

const defaultSprint = (): SprintState => ({ sprint1Completed: false, sprint2Completed: false, sprint3Completed: false, dataSentToOtherTeam: null });

let activeSessions: Record<string, SessionState> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId')?.trim().toUpperCase();

  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  if (!activeSessions[sessionId]) {
    activeSessions[sessionId] = { GroupA: defaultSprint(), GroupB: defaultSprint() };
  }

  return NextResponse.json({ sessionId, state: activeSessions[sessionId] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId: rawSessionId, teamId, action, payload } = body;
    const sessionId = rawSessionId?.trim().toUpperCase();

    if (!sessionId || !teamId || (teamId !== 'GroupA' && teamId !== 'GroupB')) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    if (!activeSessions[sessionId]) {
      activeSessions[sessionId] = { GroupA: defaultSprint(), GroupB: defaultSprint() };
    }

    const session = activeSessions[sessionId];
    const team = teamId as 'GroupA' | 'GroupB';

    if (action === 'completeSprint1') {
      session[team].sprint1Completed = true;
      session[team].dataSentToOtherTeam = payload;
      return NextResponse.json({ success: true, updatedState: session });
    }

    if (action === 'completeSprint2') {
      session[team].sprint2Completed = true;
      return NextResponse.json({ success: true, updatedState: session });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error parsing request' }, { status: 500 });
  }
}
