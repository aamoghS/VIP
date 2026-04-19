import { NextResponse } from 'next/server';

type Question = {
  id: number;
  topic: string;
  currentAnswer: string;
  reasoning: string;
};

// Must stay in sync with /api/questions/route.ts
const ANSWERS: Question[] = [
  { id: 1,  topic: "variables",   currentAnswer: "score = 10",                                                                 reasoning: "In Python, we use the equals sign (=) to put the value on the right (10) into the variable name on the left (score)." },
  { id: 2,  topic: "variables",   currentAnswer: "Print the word Alex",                                                         reasoning: "First, we put \"Alex\" in the box called 'name'. Then, print(name) looks inside the box and shows it." },
  { id: 3,  topic: "variables",   currentAnswer: "10",                                                                          reasoning: "First, the box 'coins' holds 5. But then we put 10 in it, replacing the 5." },
  { id: 4,  topic: "variables",   currentAnswer: "Inside quotes, like \"Hello\"",                                               reasoning: "Python needs quotes (like \"Hello\" or 'Hello') to know it's a String (text)." },
  { id: 5,  topic: "variables",   currentAnswer: "player_score",                                                                reasoning: "Variable names should be clear and easy to understand. Python likes snake_case." },
  { id: 6,  topic: "variables",   currentAnswer: "CatDog",                                                                      reasoning: "Using '+' connects Strings together. \"Cat\" + \"Dog\" becomes \"CatDog\"." },
  { id: 7,  topic: "variables",   currentAnswer: "age = 12",                                                                    reasoning: "Numbers without quotes are real numbers (integers) in Python." },
  { id: 8,  topic: "logic",       currentAnswer: "It prints \"Grab an umbrella!\"",                                              reasoning: "The condition 'is_raining' is True, so the code inside the 'if' block runs." },
  { id: 9,  topic: "logic",       currentAnswer: "Do this instead if the first condition was False",                             reasoning: "'if' says \"if this is true, do X\". 'else' says \"otherwise, do Y\"." },
  { id: 10, topic: "logic",       currentAnswer: "Keep Trying!",                                                                 reasoning: "Because 50 is not greater than 100, the 'if' part is skipped and 'else' runs." },
  { id: 11, topic: "logic",       currentAnswer: "Teen or Tween",                                                                reasoning: "Since age is 10, 'age > 18' is False. The 'elif' checks 'age >= 10' which is True." },
  { id: 12, topic: "logic",       currentAnswer: "color == \"red\"",                                                             reasoning: "A double equals (==) asks \"are these the same?\". Single equals (=) puts a value in a box." },
  { id: 13, topic: "logic",       currentAnswer: "BOTH must be true to ride",                                                    reasoning: "The word 'and' means both sides must be true." },
  { id: 14, topic: "loops",       currentAnswer: "Print \"Jump!\" 3 times",                                                       reasoning: "range(3) tells Python to repeat the action 3 times." },
  { id: 15, topic: "loops",       currentAnswer: "0, 1, 2",                                                                      reasoning: "Computer programs start counting at 0. range(3) gives us 0, then 1, and finally 2." },
  { id: 16, topic: "loops",       currentAnswer: "while True:",                                                                  reasoning: "'while True' means \"keep doing this as long as True is True!\" It never stops." },
  { id: 17, topic: "loops",       currentAnswer: "Prints Playing 3 times",                                                        reasoning: "lives starts at 3. Each loop subtracts 1. It prints when lives=3,2,1 and stops at 0." },
  { id: 18, topic: "loops",       currentAnswer: "A collection of items stored in brackets",                                     reasoning: "A list stores many items in one variable using square brackets []. You can loop over it." },
  { id: 19, topic: "loops",       currentAnswer: "Print \"apple\" then \"pear\"",                                                  reasoning: "This goes through the list one item at a time, printing each fruit." },
  { id: 20, topic: "functions",   currentAnswer: "They let us reuse the same code without writing it over and over",            reasoning: "Functions save typing! Wrap code in a function and call it whenever needed." },
  { id: 21, topic: "functions",   currentAnswer: "We need to CALL the function by writing say_hi()",                           reasoning: "Defining doesn't mean running. You must call the function for the code to execute." },
  { id: 22, topic: "functions",   currentAnswer: "Prints 10",                                                                    reasoning: "We give 5 as the 'num' parameter. Inside, it does 5 * 2 = 10." },
  { id: 23, topic: "functions",   currentAnswer: "return",                                                                       reasoning: "We use 'return' to send the final answer back to the caller." },
  { id: 24, topic: "functions",   currentAnswer: "Prints Mario",                                                                  reasoning: "get_winner() returns \"Mario\". So name becomes \"Mario\" and prints it." },
  { id: 25, topic: "functions",   currentAnswer: "They let us reuse the same code without writing it over and over",            reasoning: "Same as #20 - functions save you from rewriting code." },
  { id: 26, topic: "debugging",   currentAnswer: "A mistake or error in the code",                                               reasoning: "A bug is a mistake. Debugging is fixing those mistakes." },
  { id: 27, topic: "debugging",   currentAnswer: "We misspelled a variable name like 'score' as 'scoore'",                      reasoning: "A NameError means Python has never seen this variable before - usually a typo." },
  { id: 28, topic: "debugging",   currentAnswer: "Logic Bug (Code runs, but does the wrong math)",                               reasoning: "A logic bug is when the code is fine Python, but we gave the computer wrong instructions." },
  { id: 29, topic: "debugging",   currentAnswer: "Using the print() command to print out variables",                              reasoning: "Using print() helps you peek inside your program to spot where things went wrong." },
  { id: 30, topic: "debugging",   currentAnswer: "Algorithms must be broken down into small, simple, step-by-step instructions.", reasoning: "Algorithms need exact, simple steps that computers can follow." },
  { id: 31, topic: "algorithms",  currentAnswer: "1. Get bread 2. Put jelly on bread 3. Put bread together",                     reasoning: "Algorithms must be specific, ordered, and complete." },
  { id: 32, topic: "algorithms",  currentAnswer: "Because putting on shoes before socks wouldn't work!",                         reasoning: "Sequence is important. Code runs line by line, top to bottom." },
  { id: 33, topic: "algorithms",  currentAnswer: "Look from person 1 to person 10, one by one, checking if their name is Sam",   reasoning: "Checking one by one is called 'Linear Search'. It will find Sam if he's in line." },
  { id: 34, topic: "algorithms",  currentAnswer: "Update our 'highest' variable whenever we clearly see a bigger number",          reasoning: "To find the maximum, keep a 'highest so far' variable and update it when you see bigger." },
  { id: 35, topic: "algorithms",  currentAnswer: "Splitting a game into three pieces: drawing, moving, checking the score",      reasoning: "Decomposition makes problems easier - tackle each piece separately." },
  { id: 36, topic: "algorithms",  currentAnswer: "Adds up all the coins to get 3",                                              reasoning: "This is an 'accumulator' pattern. Start at zero and add each item." },
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
