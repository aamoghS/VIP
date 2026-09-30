import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/server/db";
import { questions } from "@/server/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, studentAnswer } = body;

    if (!questionId || studentAnswer === undefined) {
      return NextResponse.json({ error: "Missing questionId or studentAnswer" }, { status: 400 });
    }

    const [question] = await getDb()
      .select({
        id: questions.id,
        currentAnswer: questions.currentAnswer,
        reasoning: questions.reasoning,
      })
      .from(questions)
      .where(eq(questions.id, Number(questionId)))
      .limit(1);

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const isCorrect =
      String(studentAnswer).trim().toLowerCase() === question.currentAnswer.trim().toLowerCase();

    return NextResponse.json({
      questionId,
      isCorrect,
      correctAnswer: isCorrect ? undefined : question.currentAnswer,
      reasoning: question.reasoning,
      message: isCorrect ? "Correct!" : "Incorrect, try again!",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unavailable";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
