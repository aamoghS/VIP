import { NextResponse } from 'next/server';
import { questionBank } from '@/data/questions';

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
