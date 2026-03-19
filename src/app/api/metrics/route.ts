import { NextResponse } from 'next/server';
import { getOrCreateSessionId } from '@/lib/session';
import { recordEvent, getAggregatedMetrics, getSessionEvents, EventType } from '@/lib/sessionStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/metrics — returns aggregated real-time metrics.
 * Optional ?sessionId=... to get per-session events.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionIdParam = searchParams.get('sessionId');

  // Touch the session so it's marked active
  const { sessionId } = await getOrCreateSessionId();

  if (sessionIdParam) {
    // Return events for a specific session
    const events = await getSessionEvents(sessionIdParam);
    return NextResponse.json({ sessionId: sessionIdParam, events });
  }

  // Return aggregated metrics
  const metrics = await getAggregatedMetrics();
  return NextResponse.json({
    ...metrics,
    currentSessionId: sessionId,
  });
}

/**
 * POST /api/metrics — record a new event.
 * Body: { type: EventType, payload: object }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    // Get or create session
    const { sessionId } = await getOrCreateSessionId();

    const event = await recordEvent(sessionId, type as EventType, payload || {});

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
