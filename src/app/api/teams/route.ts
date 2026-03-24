import { NextResponse, after } from 'next/server';
import { readSessionIdFromRequest } from '@/lib/session';
import { recordEvent } from '@/lib/sessionStore';

export const missions = [
  {
    id: "reservoir",
    title: "Save the City Reservoir",
    description: "The City Reservoir is in crisis. We need two specialized teams to calculate the rainfall and design the smart lid logic.",
    groupA: {
      role: "Data Gatherers. Calculate the rate and time.",
      instruction: "The city needs to know how much rain fell. Define the variables for Rate and Time. (Hint: Rate = 5, Time = 10)",
      vars: [
        { name: "rainRate", type: "int", target: "5" },
        { name: "rainTime", type: "int", target: "10" }
      ]
    },
    groupB: {
      role: "Logic Engineers. Control the reservoir lid.",
      instruction: "The water is evaporating! Group A sent us the total volume. Now, write an if-statement to close the reservoir lid if the temperature is greater than 85.",
      logic: { variable: "temperature", operator: ">", target: "85", action: "closeReservoirLid();", bgClass: "var(--secondary)" }
    },
    successMessage: "The reservoir is safe. Group A collected the data, and Group B executed the logic just in time.",
    reward: { id: "smart-lid", name: "Smart Lid", icon: "🌐" }
  },
  {
    id: "space-station",
    title: "Defend the Space Station",
    description: "An asteroid field is approaching. Group A must calibrate the engines, and Group B must activate the shields.",
    groupA: {
      role: "Engineers. Calibrate the thrusters.",
      instruction: "We need maximum thrust to dodge the asteroids. Set Oxygen to 100 and Fuel to 50.",
      vars: [
        { name: "oxygenLevel", type: "int", target: "100" },
        { name: "fuelLevel", type: "int", target: "50" }
      ]
    },
    groupB: {
      role: "Defense Tacticians. Activate shields.",
      instruction: "Asteroids are hitting the hull! Write an if-statement to activate the shields if the hull pressure drops below 30.",
      logic: { variable: "hullPressure", operator: "<", target: "30", action: "activateShields();", bgClass: "#fca311" }
    },
    successMessage: "The space station evaded the asteroid field successfully thanks to your teamwork!",
    reward: { id: "station-shield", name: "Deflector Shield", icon: "🛡️" }
  },
  {
    id: "submarine",
    title: "Navigate the Deep Trench",
    description: "The submarine is approaching a dangerous trench. Group A sets the diving parameters, Group B pilots the vessel.",
    groupA: {
      role: "Navigators. Set the depths.",
      instruction: "We must dive quickly. Set the target Depth to 500 and Speed to 20.",
      vars: [
        { name: "targetDepth", type: "int", target: "500" },
        { name: "diveSpeed", type: "int", target: "20" }
      ]
    },
    groupB: {
      role: "Pilots. Watch the sonar.",
      instruction: "We are blind down here! Write an if-statement to fire the flare if the sonar ping equals 1.",
      logic: { variable: "sonarPing", operator: "==", target: "1", action: "fireFlare();", bgClass: "#00b4d8" }
    },
    successMessage: "You safely navigated the trench and illuminated the dark depths!",
    reward: { id: "sonar-badge", name: "Sonar Badge", icon: "🌊" }
  }
];

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
    const randomMission = missions[Math.floor(Math.random() * missions.length)];
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
  const missionData = missions.find(m => m.id === session.missionId);

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
      const randomMission = missions[Math.floor(Math.random() * missions.length)];
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
        const availableMissions = missions.filter(m => m.id !== session.missionId);
        const nextMission = availableMissions[Math.floor(Math.random() * availableMissions.length)] || missions[0];

        session.currentRound += 1;
        session.missionId = nextMission.id;
        session.GroupA = defaultSprint();
        session.GroupB = defaultSprint();
      }

      return NextResponse.json({ success: true, updatedState: session, roundWinner: winner });
    }

    if (action === 'resetGame') {
      const randomMission = missions[Math.floor(Math.random() * missions.length)];
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
