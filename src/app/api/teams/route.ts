import { NextResponse, after } from 'next/server';
import { readSessionIdFromRequest } from '@/lib/session';
import { recordEvent } from '@/lib/sessionStore';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Missions are stored in Firestore in the 'missions' collection.
async function getAllMissions() {
  const qSnap = await getDocs(collection(db, 'missions'));
  return qSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

async function getMissionById(id: string | undefined) {
  if (!id) return null;
  const mRef = doc(db, 'missions', id);
  const mSnap = await getDoc(mRef);
  return mSnap.exists() ? ({ id: mSnap.id, ...(mSnap.data() as any) } as any) : null;
}

type SprintState = {
  sprint1Completed: boolean;
  sprint2Completed: boolean;
  sprint3Completed: boolean;
  dataSentToOtherTeam: any | null;
  points: number;
};

type SessionState = {
  missionId: string;
  currentRound: number;
  totalRounds: number;
  GroupA: SprintState;
  GroupB: SprintState;
  roundHistory: { missionId: string; winner: 'GroupA' | 'GroupB' | 'tie' | null; groupAPoints: number; groupBPoints: number }[];
};

const defaultSprint = (): SprintState => ({
  sprint1Completed: false,
  sprint2Completed: false,
  sprint3Completed: false,
  dataSentToOtherTeam: null,
  points: 0
});

let activeSessions: Record<string, SessionState> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId')?.trim().toUpperCase();

  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  if (!activeSessions[sessionId]) {
    const allMissions = await getAllMissions();
    if (!allMissions || allMissions.length === 0) return NextResponse.json({ error: 'No missions available' }, { status: 500 });
    const randomMission = allMissions[Math.floor(Math.random() * allMissions.length)];
    activeSessions[sessionId] = {
      missionId: randomMission.id,
      currentRound: 1,
      totalRounds: 3,
      GroupA: defaultSprint(),
      GroupB: defaultSprint(),
      roundHistory: []
    };
  }

  const session = activeSessions[sessionId];
  const missionData = await getMissionById(session.missionId);

  return NextResponse.json({ sessionId, state: session, mission: missionData });
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
      const allMissions = await getAllMissions();
      if (!allMissions || allMissions.length === 0) return NextResponse.json({ error: 'No missions available' }, { status: 500 });
      const randomMission = allMissions[Math.floor(Math.random() * allMissions.length)];
      activeSessions[sessionId] = {
        missionId: randomMission.id,
        currentRound: 1,
        totalRounds: 3,
        GroupA: defaultSprint(),
        GroupB: defaultSprint(),
        roundHistory: []
      };
    }

    const session = activeSessions[sessionId];
    const team = teamId as 'GroupA' | 'GroupB';

    const cookieSessionId = readSessionIdFromRequest(request);

    const triggerEvents = (amount: number, source: string) => {
      if (!cookieSessionId) return;
      after(async () => {
        try {
          await recordEvent(cookieSessionId, 'sprint_completed', { sprintSessionId: sessionId, teamId, action, missionId: session.missionId });
          await recordEvent(cookieSessionId, 'xp_earned', { amount, source });
        } catch {}
      });
    };

    if (action === 'completeSprint1') {
      session[team].sprint1Completed = true;
      session[team].dataSentToOtherTeam = payload;
      session[team].points += 200;
      triggerEvents(200, 'sprint1');
      return NextResponse.json({ success: true, updatedState: session });
    }

    if (action === 'completeSprint2') {
      session[team].sprint2Completed = true;
      session[team].points += 300;
      triggerEvents(300, 'sprint2');
      return NextResponse.json({ success: true, updatedState: session });
    }

    if (action === 'completeRound') {
      // Calculate round results
      const groupAPoints = session.GroupA.points;
      const groupBPoints = session.GroupB.points;

      let winner: 'GroupA' | 'GroupB' | 'tie' | null = null;
      if (groupAPoints > groupBPoints) winner = 'GroupA';
      else if (groupBPoints > groupAPoints) winner = 'GroupB';
      else winner = 'tie';

      // Record round history
      session.roundHistory.push({
        missionId: session.missionId,
        winner,
        groupAPoints,
        groupBPoints
      });

      // Advance to next round if not the last
      if (session.currentRound < session.totalRounds) {
        // Get a different mission for next round
        const allMissionsForRound = await getAllMissions();
        const availableMissions = allMissionsForRound.filter(m => m.id !== session.missionId);
        const nextMission = availableMissions[Math.floor(Math.random() * availableMissions.length)] || allMissionsForRound[0];

        session.currentRound += 1;
        session.missionId = nextMission.id;
        session.GroupA = defaultSprint();
        session.GroupB = defaultSprint();
      }

      return NextResponse.json({ success: true, updatedState: session, roundWinner: winner });
    }

    if (action === 'resetGame') {
      const allMissionsReset = await getAllMissions();
      if (!allMissionsReset || allMissionsReset.length === 0) return NextResponse.json({ error: 'No missions available' }, { status: 500 });
      const randomMission = allMissionsReset[Math.floor(Math.random() * allMissionsReset.length)];
      activeSessions[sessionId] = {
        missionId: randomMission.id,
        currentRound: 1,
        totalRounds: session.totalRounds,
        GroupA: defaultSprint(),
        GroupB: defaultSprint(),
        roundHistory: []
      };
      return NextResponse.json({ success: true, updatedState: activeSessions[sessionId] });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error parsing request' }, { status: 500 });
  }
}
