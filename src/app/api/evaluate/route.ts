import { NextResponse, after } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { readSessionIdFromRequest } from '@/lib/session';
import { recordEvent } from '@/lib/sessionStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, studentAnswer } = body;

    if (!questionId || studentAnswer === undefined) {
      return NextResponse.json({ error: 'Missing questionId or studentAnswer' }, { status: 400 });
    }

    const qRef = doc(db, 'questions', String(questionId));
    const qSnap = await getDoc(qRef);

    if (!qSnap.exists()) {
      return NextResponse.json({ error: 'Question ID not found in database' }, { status: 404 });
    }



    const questionRecord = qSnap.data();
    const correctAnswer = questionRecord.currentAnswer;
    const isCorrect = String(studentAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

    const sessionId = readSessionIdFromRequest(request);
    if (sessionId) {
      after(async () => {
        try {
          await recordEvent(sessionId, 'question_answered', { questionId, topic: questionRecord.topic, isCorrect, studentAnswer });
          if (isCorrect) await recordEvent(sessionId, 'xp_earned', { amount: 100, source: 'toolbox' });
        } catch {}
      });
    }

    return NextResponse.json({
      questionId,
      isCorrect,
      correctAnswer: isCorrect ? undefined : correctAnswer,
      reasoning: questionRecord.reasoning,
      message: isCorrect ? 'Correct!' : 'Incorrect, try again! '
    });

  } catch {
    return NextResponse.json({ error: 'The server couldnt evaluate the route currently'}, { status: 500});
  }
}
