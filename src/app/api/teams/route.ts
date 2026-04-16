import { NextResponse } from 'next/server';

// Teams API — no-op (sprint is now fully local, no server state needed)
export async function GET() {
  return NextResponse.json({ message: 'Sprint state is managed locally.' });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
