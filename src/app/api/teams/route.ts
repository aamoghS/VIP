import { NextResponse } from 'next/server';
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
};

type SessionState = {
  missionId: string;
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
    const randomMission = missions[Math.floor(Math.random() * missions.length)];
    activeSessions[sessionId] = { missionId: randomMission.id, GroupA: defaultSprint(), GroupB: defaultSprint() };
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
      activeSessions[sessionId] = { missionId: randomMission.id, GroupA: defaultSprint(), GroupB: defaultSprint() };
    }

    const session = activeSessions[sessionId];
    const team = teamId as 'GroupA' | 'GroupB';

    // Record metrics event
    const cookieSessionId = readSessionIdFromRequest(request);

    if (action === 'completeSprint1') {
      session[team].sprint1Completed = true;
      session[team].dataSentToOtherTeam = payload;

      if (cookieSessionId) {
        recordEvent(cookieSessionId, 'sprint_completed', {
          sprintSessionId: sessionId,
          teamId,
          action,
          missionId: session.missionId,
        }).catch(() => {});
        recordEvent(cookieSessionId, 'xp_earned', { amount: 200, source: 'sprint1' }).catch(() => {});
      }

      return NextResponse.json({ success: true, updatedState: session });
    }

    if (action === 'completeSprint2') {
      session[team].sprint2Completed = true;

      if (cookieSessionId) {
        recordEvent(cookieSessionId, 'sprint_completed', {
          sprintSessionId: sessionId,
          teamId,
          action,
          missionId: session.missionId,
        }).catch(() => {});
        recordEvent(cookieSessionId, 'xp_earned', { amount: 300, source: 'sprint2' }).catch(() => {});
      }

      return NextResponse.json({ success: true, updatedState: session });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error parsing request' }, { status: 500 });
  }
}
