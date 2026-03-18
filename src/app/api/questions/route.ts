import { NextResponse } from 'next/server';
import { questionBank } from '@/data/questions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  let filteredBank = questionBank;
  if (topic) {
    filteredBank = questionBank.filter(q => q.topic === topic);
  }

  if (filteredBank.length === 0) {
    return NextResponse.json({ error: 'No questions found for this topic.' }, { status: 404 });
  }

  const randomIndex = Math.floor(Math.random() * filteredBank.length);
  const selectedQuestion = { ...filteredBank[randomIndex] };

  return NextResponse.json(selectedQuestion);
}
