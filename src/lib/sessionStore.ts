import { db } from '@/lib/firebase';
import {
  collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, where, getCountFromServer
} from 'firebase/firestore';

export type EventType =
  | 'question_answered'
  | 'sprint_completed'
  | 'xp_earned'
  | 'page_visited'
  | 'sprint_joined'
  | 'reward_claimed';

export type MetricEvent = {
  id?: string;
  sessionId: string;
  type: EventType;
  payload: Record<string, unknown>;
  timestamp: number;
};

const sessionsCol = collection(db, 'sessions');
const eventsCol = collection(db, 'metric_events');

export async function recordEvent(
  sessionId: string,
  type: EventType,
  payload: Record<string, unknown> = {}
): Promise<MetricEvent> {
  const now = Date.now();
  const sessionRef = doc(sessionsCol, sessionId);
  const sessionSnap = await getDoc(sessionRef);

  if (sessionSnap.exists()) {
    await setDoc(sessionRef, { lastActiveAt: now }, { merge: true });
  } else {
    await setDoc(sessionRef, { sessionId, createdAt: now, lastActiveAt: now });
  }

  const event: MetricEvent = { sessionId, type, payload, timestamp: now };
  event.id = `unlogged-${now}`;
  return event;
}

export async function getActiveSessions(windowMs = 300000) {
  const cutoff = Date.now() - windowMs;
  const snap = await getDocs(query(sessionsCol, where('lastActiveAt', '>=', cutoff)));
  return snap.docs.map((d) => d.data());
}

export async function getSessionEvents(sessionId: string): Promise<MetricEvent[]> {
  const snap = await getDocs(query(eventsCol, where('sessionId', '==', sessionId), orderBy('timestamp', 'desc'), limit(50)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MetricEvent));
}

export async function getAggregatedMetrics(sessionId?: string) {
  const q = sessionId
    ? query(eventsCol, where('sessionId', '==', sessionId))
    : query(eventsCol, orderBy('timestamp', 'desc'), limit(200));

  const snap = await getDocs(q);
  let events = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MetricEvent));

  if (sessionId) {
    events.sort((a, b) => b.timestamp - a.timestamp);
    events = events.slice(0, 200);
  }

  const questionEvents = events.filter((e) => e.type === 'question_answered');
  const correctEvents = questionEvents.filter((e) => e.payload.isCorrect);
  const sprintEvents = events.filter((e) => e.type === 'sprint_completed');

  const topicMap = new Map<string, { total: number; correct: number }>();
  for (const { payload } of questionEvents) {
    const topic = (payload.topic as string) || 'unknown';
    const entry = topicMap.get(topic) || { total: 0, correct: 0 };
    entry.total++;
    if (payload.isCorrect) entry.correct++;
    topicMap.set(topic, entry);
  }

  const topicBreakdown = Array.from(topicMap.entries())
    .map(([topic, { total, correct }]) => ({
      topic,
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const totalXpEarned = events
    .filter((e) => e.type === 'xp_earned')
    .reduce((sum, e) => sum + ((e.payload.amount as number) || 0), 0);

  const [activeSessions, sessionsSnap] = await Promise.all([
    getActiveSessions(),
    getCountFromServer(sessionsCol),
  ]);

  return {
    activeSessionCount: activeSessions.length,
    totalSessions: sessionsSnap.data().count,
    totalQuestions: questionEvents.length,
    totalCorrect: correctEvents.length,
    accuracyRate: questionEvents.length > 0 ? Math.round((correctEvents.length / questionEvents.length) * 100) : 0,
    totalSprintCompletions: sprintEvents.length,
    totalXpEarned,
    topicBreakdown,
    recentEvents: events.slice(0, 20),
  };
}
