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
    let dbQuery = query(colList);

    if (topic) {
      dbQuery = query(colList, where('topic', '==', topic));
    }

    const snap = await getDocs(dbQuery);
    
    if (snap.empty) {
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

    const questions = snap.docs.map(doc => doc.data());
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    return NextResponse.json(selectedQuestion, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=59',
        'CDN-Cache-Control': 'public, s-maxage=5, stale-while-revalidate=59',
      },
    });
  } catch (error: any) {
    console.error("Firestore Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch questions from database.' },
      { status: 500 }
    );
  }
}
