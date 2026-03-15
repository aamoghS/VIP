import { NextResponse } from 'next/server';


type TeamState = {
  sprint1Completed: boolean;
  sprint2Completed: boolean;
  sprint3Completed: boolean;
  dataSentToOtherTeam: any | null;
};

let teams: Record<string, TeamState> = {
  'GroupA': { sprint1Completed: false, sprint2Completed: false, sprint3Completed: false, dataSentToOtherTeam: null },
  'GroupB': { sprint1Completed: false, sprint2Completed: false, sprint3Completed: false, dataSentToOtherTeam: null },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');

  if (teamId && teams[teamId]) {
     return NextResponse.json({ teamId, state: teams[teamId] });
  }

  return NextResponse.json({ teams });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, action, payload } = body;

    if (!teamId || !teams[teamId]) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }

    if (action === 'completeSprint1') {
      teams[teamId].sprint1Completed = true;
      teams[teamId].dataSentToOtherTeam = payload;
      return NextResponse.json({ success: true, updatedState: teams[teamId] });
    }

    if (action === 'completeSprint2') {
      teams[teamId].sprint2Completed = true;
      return NextResponse.json({ success: true, updatedState: teams[teamId] });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error parsing request' }, { status: 500 });
  }
}
