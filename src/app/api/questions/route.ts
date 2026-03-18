import { NextResponse } from 'next/server';
import { questionBank } from '@/data/questions';

// Cache question bank in memory
const cachedBank = questionBank;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  let filteredBank = cachedBank;
  if (topic) {
    filteredBank = cachedBank.filter(q => q.topic === topic);
  }

  if (filteredBank.length === 0) {
    return NextResponse.json(
      { error: 'No questions found for this topic.' },
      {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  }

  const randomIndex = Math.floor(Math.random() * filteredBank.length);
  const selectedQuestion = { ...filteredBank[randomIndex] };

  return NextResponse.json(selectedQuestion, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'CDN-Cache-Control': 'max-age=0, s-maxage=0',
    },
  });
}
