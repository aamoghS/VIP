import { NextResponse } from 'next/server';

// This acts as our 'backend' validator without exposing the answers directly on the client if we didn't want to.
// We are hardcoding the logic here as per the "no real node js backend / db" requirement.

const answerKey: Record<number, string> = {
  1: 'String',
  2: 'Yes',
  3: 'for',
  4: 'Right Angle',
  5: 'Square',
  6: 'True',
  7: 'Crystal',
  8: 'Yes'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, studentAnswer } = body;

    if (!questionId || !studentAnswer) {
      return NextResponse.json({ error: 'Missing questionId or studentAnswer' }, { status: 400 });
    }

    const correctAnswer = answerKey[questionId];

    if (!correctAnswer) {
      return NextResponse.json({ error: 'Question ID not found in answer key' }, { status: 404 });
    }

    const isCorrect = String(studentAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

    return NextResponse.json({
      questionId,
      isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect, try again.'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Server error parsing request' }, { status: 500 });
  }
}
