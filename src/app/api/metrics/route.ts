import { NextResponse } from 'next/server';
import { getOrCreateSessionId, readSessionIdFromRequest } from '@/lib/session';
import { recordEvent, getAggregatedMetrics, getSessionEvents, EventType } from '@/lib/sessionStore';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionIdParam = searchParams.get('sessionId');

  const sessionId = readSessionIdFromRequest(request) || '';

  if (sessionIdParam) {
    const events = await getSessionEvents(sessionIdParam);
    return NextResponse.json({ sessionId: sessionIdParam, events });
  }

  const metrics = await getAggregatedMetrics(sessionId);
  return NextResponse.json({
    ...metrics,
    currentSessionId: sessionId,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    const { sessionId } = await getOrCreateSessionId();
    const event = await recordEvent(sessionId, type as EventType, payload || {});

    return NextResponse.json({ success: true, event });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
