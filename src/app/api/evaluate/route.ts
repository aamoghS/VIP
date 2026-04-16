import { NextResponse } from 'next/server';

type Question = {
  id: number;
  topic: string;
  currentAnswer: string;
  reasoning: string;
};

// Must stay in sync with /api/questions/route.ts
const ANSWERS: Question[] = [
  { id: 1,  topic: "variables",   currentAnswer: "A named storage location that holds a value",                               reasoning: "A variable is like a sticky note with a label — the label is the name and the value written on it can change." },
  { id: 2,  topic: "variables",   currentAnswer: "15",                                                                         reasoning: "score starts at 0, +10 = 10, +5 = 15. Each line updates the variable — exactly how a game tracks points." },
  { id: 3,  topic: "variables",   currentAnswer: "studentScore",                                                               reasoning: "Variable names can't start with a number or have spaces. studentScore uses camelCase — the standard Java style." },
  { id: 4,  topic: "variables",   currentAnswer: "String",                                                                     reasoning: "String stores text. int = whole numbers, double = decimals, boolean = true/false. Names → String." },
  { id: 5,  topic: "variables",   currentAnswer: "Hello Alex",                                                                 reasoning: "The + sign joins Strings. \"Hello\" + \" \" + \"Alex\" = \"Hello Alex\". The space in the middle is important." },
  { id: 6,  topic: "variables",   currentAnswer: "double score = 87.5;",                                                       reasoning: "int only holds whole numbers. double holds decimals — perfect for scores, prices, temperatures, averages." },
  { id: 7,  topic: "variables",   currentAnswer: "5",                                                                          reasoning: "y = x copies the VALUE 5 into y. Changing x later doesn't affect y — variables are independent." },
  { id: 8,  topic: "logic",       currentAnswer: "if (isRaining) { bringUmbrella(); }",                                        reasoning: "if checks a condition. If true, run the code inside. Just like real decisions: IF raining → umbrella." },
  { id: 9,  topic: "logic",       currentAnswer: "B",                                                                          reasoning: "85 is not >= 90 so skip. 85 IS >= 80 so print \"B\" and stop. Once else if matches, the rest are skipped." },
  { id: 10, topic: "logic",       currentAnswer: "Keep playing!",                                                              reasoning: "55 > 100 is false, so the if block is skipped and else runs — printing \"Keep playing!\"." },
  { id: 11, topic: "logic",       currentAnswer: "AND — both must be true",                                                    reasoning: "&& means AND. Both age >= 13 AND age <= 17 must be true. Age 12 fails first; 18 fails second." },
  { id: 12, topic: "logic",       currentAnswer: "All three conditions are true — use else if instead",                        reasoning: "75 > 60, 75 > 50, and 75 > 40 are all true — all three print. Use else if so only one branch runs." },
  { id: 13, topic: "logic",       currentAnswer: "Flips false to true — the block runs",                                       reasoning: "! means NOT. !false = true, so the if condition is true and \"Keep playing!\" prints." },
  { id: 14, topic: "loops",       currentAnswer: "4 times",                                                                    reasoning: "i goes 0, 1, 2, 3 — when i = 4, condition i < 4 is false. That's 4 iterations total." },
  { id: 15, topic: "loops",       currentAnswer: "5",                                                                          reasoning: "i goes 1, 2, 3, 4, 5. When i = 6, i <= 5 is false. Last value printed is 5." },
  { id: 16, topic: "loops",       currentAnswer: "Lives: 3 2 1",                                                               reasoning: "lives: 3 → print 3, subtract → 2 → print 2, subtract → 1 → print 1, subtract → 0 → condition false, stop." },
  { id: 17, topic: "loops",       currentAnswer: "It's an infinite loop — count grows forever",                                reasoning: "count starts at 1 and increases forever — count > 0 is always true. The loop never exits." },
  { id: 18, topic: "loops",       currentAnswer: "When repeating until something changes (like waiting for a player to win)", reasoning: "Use for when you know the count. Use while when you don't — like waiting for a player to win." },
  { id: 19, topic: "loops",       currentAnswer: "10",                                                                         reasoning: "total = 0+1+2+3+4 = 10. Accumulation pattern: used for shopping carts, scores, averages." },
  { id: 20, topic: "functions",   currentAnswer: "To write code once and reuse it many times (DRY principle)",                reasoning: "DRY = Don't Repeat Yourself. Write once, call anywhere. Fix once, fixed everywhere." },
  { id: 21, topic: "functions",   currentAnswer: "Hello, Sam!",                                                               reasoning: "The function receives \"Sam\" as name, returns \"Hello, Sam!\". return sends the result back to the caller." },
  { id: 22, topic: "functions",   currentAnswer: "Returns nothing — the function just does something",                        reasoning: "void means no return value. The function performs an action but doesn't send back an answer." },
  { id: 23, topic: "functions",   currentAnswer: "10",                                                                         reasoning: "add(3, 7): a=3, b=7, returns 3+7=10. println prints 10." },
  { id: 24, topic: "functions",   currentAnswer: "An input the function receives to do its job",                              reasoning: "Parameters are the inputs. When you call sayHello(\"Jordan\"), \"Jordan\" is passed as name." },
  { id: 25, topic: "functions",   currentAnswer: "18",                                                                         reasoning: "Inner: triple(2) = 6. Outer: triple(6) = 18. Nested calls work inside-out, like math parentheses." },
  { id: 26, topic: "debugging",   currentAnswer: "Missing semicolon after line 1",                                            reasoning: "Java requires ; at the end of every statement. Missing one causes a compile error before the program runs." },
  { id: 27, topic: "debugging",   currentAnswer: "Runtime error",                                                              reasoning: "Runtime errors crash during execution. Index 5 doesn't exist in a 3-element array — ArrayIndexOutOfBoundsException." },
  { id: 28, topic: "debugging",   currentAnswer: "Logic error",                                                               reasoning: "Logic errors: code runs but gives wrong results. Order of operations makes c/3=23 happen first — wrong average." },
  { id: 29, topic: "debugging",   currentAnswer: "Add print statements to show variable values at each step",                 reasoning: "Print-debugging: add println() at key points to see what variables actually hold. Developers do this daily." },
  { id: 30, topic: "debugging",   currentAnswer: "The compiler / IDE error messages pointing to the line",                    reasoning: "Compilers catch syntax errors before running, pointing to the exact line with hints like 'expected ;'." },
  { id: 31, topic: "algorithms",  currentAnswer: "1. Put bread in toaster 2. Push lever 3. Wait 4. Remove toast",            reasoning: "Algorithms must be specific, ordered, and complete. Vague instructions don't work for computers." },
  { id: 32, topic: "algorithms",  currentAnswer: "Step 1 happens before the drink is even made",                              reasoning: "Sequence — order of steps — is a core CS idea. Wrong order = wrong result. Code runs in exact order." },
  { id: 33, topic: "algorithms",  currentAnswer: "26",                                                                         reasoning: "0+5=5, +10=15, +3=18, +8=26. Accumulation pattern — used in shopping carts, quiz scores, averages." },
  { id: 34, topic: "algorithms",  currentAnswer: "3 steps",                                                                    reasoning: "Linear search checks each item in order. Carlos is at position 3, so it takes 3 checks." },
  { id: 35, topic: "algorithms",  currentAnswer: "Split into: Player, Score, Enemies, Controls — solve each part",            reasoning: "Decomposition breaks big problems into smaller pieces. Each is easier to code, test, and fix." },
  { id: 36, topic: "algorithms",  currentAnswer: "Step 2 (IF) — update highest when a bigger value is found",                 reasoning: "Without the comparison and update, you'd never discover a larger number. Core to leaderboards and analytics." },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, studentAnswer } = body;

    if (!questionId || studentAnswer === undefined) {
      return NextResponse.json({ error: 'Missing questionId or studentAnswer' }, { status: 400 });
    }

    const question = ANSWERS.find(q => q.id === Number(questionId));
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = String(studentAnswer).trim().toLowerCase() === String(question.currentAnswer).trim().toLowerCase();

    return NextResponse.json({
      questionId,
      isCorrect,
      correctAnswer: isCorrect ? undefined : question.currentAnswer,
      reasoning: question.reasoning,
      message: isCorrect ? 'Correct!' : 'Incorrect, try again!',
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
