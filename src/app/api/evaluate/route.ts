import { NextResponse } from "next/server";
import { findQuestion } from "@/server/questions/pick";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, studentAnswer } = body;

    if (!questionId || studentAnswer === undefined) {
      return NextResponse.json({ error: "Missing questionId or studentAnswer" }, { status: 400 });
    }

    const question = findQuestion(Number(questionId));

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const isCorrect =
      String(studentAnswer).trim().toLowerCase() === question.currentAnswer.trim().toLowerCase();

    // The client gives two tries. Keep the answer and the explanation back until the second wrong try or a right one.
    const attempt = Number(body.attempt) || 1;
    const reveal = isCorrect || attempt >= 2;

    return NextResponse.json({
      questionId,
      isCorrect,
      correctAnswer: reveal && !isCorrect ? question.currentAnswer : undefined,
      reasoning: reveal ? question.reasoning : undefined,
      message: isCorrect ? "Correct!" : "Incorrect, try again!",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
