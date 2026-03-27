import { NextResponse } from 'next/server';
import { getOrCreateSessionId, readSessionIdFromRequest } from '@/lib/session';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { sessionId, isNew } = await getOrCreateSessionId();

    // Try to read displayName if session exists in Firestore
    const sRef = doc(db, 'sessions', sessionId);
    const sSnap = await getDoc(sRef);
    const sessionData = sSnap.exists() ? sSnap.data() : null;

    return NextResponse.json({ sessionId, isNew, session: sessionData });
  } catch {
    return NextResponse.json({ error: 'Could not initialize session' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { displayName } = body;
    const sessionId = readSessionIdFromRequest(request);
    if (!sessionId) return NextResponse.json({ error: 'Missing session cookie' }, { status: 400 });
    if (!displayName || String(displayName).trim().length === 0) return NextResponse.json({ error: 'Missing displayName' }, { status: 400 });

    const sRef = doc(db, 'sessions', sessionId);
    await setDoc(sRef, { sessionId, displayName: String(displayName).trim(), lastActiveAt: Date.now() }, { merge: true });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Could not set display name' }, { status: 500 });
  }
}
