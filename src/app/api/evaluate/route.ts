import { NextResponse, after } from 'next/server';
import { questionBank } from '@/data/questions';
import { readSessionIdFromRequest } from '@/lib/session';
import { recordEvent } from '@/lib/sessionStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, studentAnswer } = body;

    if (!questionId || !studentAnswer) {
      return NextResponse.json({ error: 'Missing questionId or studentAnswer' }, { status: 400 });
    }

    const questionRecord = questionBank.find(q => q.id === questionId);

    if (!questionRecord) {
      return NextResponse.json({ error: 'Question ID not found in answer key' }, { status: 404 });
    }

    const correctAnswer = questionRecord.currentAnswer;
    const isCorrect = String(studentAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

    // Record metrics event in the background for fast API responses
    const sessionId = readSessionIdFromRequest(request);
    if (sessionId) {
      after(async () => {
        try {
          await recordEvent(sessionId, 'question_answered', {
            questionId,
            topic: questionRecord.topic,
            isCorrect,
            studentAnswer,
          });

          if (isCorrect) {
            await recordEvent(sessionId, 'xp_earned', { amount: 100, source: 'toolbox' });
          }
        } catch (error) {
          // background task failed quietly
        }
      });
    }

    return NextResponse.json({
      questionId,
      isCorrect,
      correctAnswer: isCorrect ? undefined : correctAnswer,
      reasoning: questionRecord.reasoning,
      message: isCorrect ? 'Correct!' : 'Incorrect, try again.'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server error parsing request' }, { status: 500 });
  }
}
