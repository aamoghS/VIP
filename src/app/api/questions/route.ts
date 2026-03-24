import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  try {
    const colList = collection(db, 'questions');
    const dbQuery = topic ? query(colList, where('topic', '==', topic)) : query(colList);
    const snap = await getDocs(dbQuery);

    if (snap.empty) {
      return NextResponse.json(
        { error: 'No questions found for this topic.' },
        { status: 404, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
      );
    }

    const questions = snap.docs.map((doc) => doc.data());
    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];

    return NextResponse.json(selectedQuestion, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=59',
        'CDN-Cache-Control': 'public, s-maxage=5, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch questions from database.' },
      { status: 500 }
    );
  }
}
