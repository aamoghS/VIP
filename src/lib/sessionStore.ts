// Session store backed by Firestore for persistent real-time metrics.

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  getCountFromServer,
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
  timestamp: number; // unix ms
};

// === Firestore Collections ===
const sessionsCol = collection(db, 'sessions');
const eventsCol = collection(db, 'metric_events');

// === Public API ===

/**
 * Record a new event and update session activity.
 */
export async function recordEvent(
  sessionId: string,
  type: EventType,
  payload: Record<string, unknown> = {}
): Promise<MetricEvent> {
  const now = Date.now();

  // Upsert session
  const sessionRef = doc(sessionsCol, sessionId);
  const sessionSnap = await getDoc(sessionRef);
  if (sessionSnap.exists()) {
    await setDoc(sessionRef, { lastActiveAt: now }, { merge: true });
  } else {
    await setDoc(sessionRef, { sessionId, createdAt: now, lastActiveAt: now });
  }

  const event: MetricEvent = {
    sessionId,
    type,
    payload,
    timestamp: now,
  };

  const docRef = await addDoc(eventsCol, event);
  event.id = docRef.id;

  return event;
}

/**
 * Get all sessions active within the last `windowMs` milliseconds.
 */
export async function getActiveSessions(windowMs: number = 5 * 60 * 1000) {
  const cutoff = Date.now() - windowMs;
  const q = query(sessionsCol, where('lastActiveAt', '>=', cutoff));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

/**
 * Get events for a specific session.
 */
export async function getSessionEvents(sessionId: string): Promise<MetricEvent[]> {
  const q = query(eventsCol, where('sessionId', '==', sessionId), orderBy('timestamp', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as MetricEvent));
}

/**
 * Get the latest N events across all sessions.
 */
export async function getRecentEvents(count: number = 20): Promise<MetricEvent[]> {
  const q = query(eventsCol, orderBy('timestamp', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as MetricEvent));
}

/**
 * Get aggregated metrics for the dashboard.
 */
export async function getAggregatedMetrics() {
  // Fetch recent events (last 200 for aggregation)
  const q = query(eventsCol, orderBy('timestamp', 'desc'), limit(200));
  const snap = await getDocs(q);
  const events = snap.docs.map(d => ({ id: d.id, ...d.data() } as MetricEvent));

  const questionEvents = events.filter(e => e.type === 'question_answered');
  const correctEvents = questionEvents.filter(e => e.payload.isCorrect === true);
  const sprintEvents = events.filter(e => e.type === 'sprint_completed');

  // Topic breakdown
  const topicMap = new Map<string, { total: number; correct: number }>();
  for (const evt of questionEvents) {
    const topic = (evt.payload.topic as string) || 'unknown';
    const entry = topicMap.get(topic) || { total: 0, correct: 0 };
    entry.total++;
    if (evt.payload.isCorrect) entry.correct++;
    topicMap.set(topic, entry);
  }

  const topicBreakdown = Array.from(topicMap.entries()).map(([topic, data]) => ({
    topic,
    total: data.total,
    correct: data.correct,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  })).sort((a, b) => b.total - a.total);

  // Total XP from xp_earned events
  const totalXp = events
    .filter(e => e.type === 'xp_earned')
    .reduce((sum, e) => sum + ((e.payload.amount as number) || 0), 0);

  // Active sessions
  const activeSessions = await getActiveSessions();

  // Total sessions
  const sessionsSnap = await getCountFromServer(sessionsCol);

  return {
    activeSessionCount: activeSessions.length,
    totalSessions: sessionsSnap.data().count,
    totalQuestions: questionEvents.length,
    totalCorrect: correctEvents.length,
    accuracyRate: questionEvents.length > 0
      ? Math.round((correctEvents.length / questionEvents.length) * 100)
      : 0,
    totalSprintCompletions: sprintEvents.length,
    totalXpEarned: totalXp,
    topicBreakdown,
    recentEvents: events.slice(0, 20),
  };
}
