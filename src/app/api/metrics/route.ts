import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Metrics API — returns empty data (progress is tracked in localStorage via ProgressContext)
export async function GET() {
  return NextResponse.json({
    totalQuestionsSolved: 0,
    totalXpEarned: 0,
    message: 'Progress is stored locally in the browser.',
  });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
