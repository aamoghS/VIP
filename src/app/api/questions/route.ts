import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Question = {
  id: number;
  topic: string;
  type: string;
  question: string;
  options: string[];
  currentAnswer: string;
  reasoning: string;
};

// 6–8th grade CS question bank
// Topics: variables, conditionals, loops, functions, debugging, algorithms
const QUESTIONS: Question[] = [
  // ── Variables ─────────────────────────────────────────────────────────────
  {
    id: 1,
    topic: "variables",
    type: "multiple-choice",
    question: "A variable is like a labeled box. Which is the BEST description of what a variable does?",
    options: ["A fixed value that never changes", "A named storage location that holds a value", "A type of loop", "A button in an app"],
    currentAnswer: "A named storage location that holds a value",
    reasoning: "A variable is like a sticky note with a label — the label is the name (like 'score') and the value written on it can change. That's what makes programs dynamic.",
  },
  {
    id: 2,
    topic: "variables",
    type: "multiple-choice",
    question: "What is the value of score after this code runs?\n\nint score = 0;\nscore = score + 10;\nscore = score + 5;",
    options: ["0", "10", "15", "50"],
    currentAnswer: "15",
    reasoning: "score starts at 0, becomes 10 after adding 10, then becomes 15 after adding 5. Each line updates the variable — exactly how a game tracks points.",
  },
  {
    id: 3,
    topic: "variables",
    type: "multiple-choice",
    question: "Which variable name follows good naming rules in Java?",
    options: ["1score", "student score", "studentScore", "STUDENT_SCORE!!"],
    currentAnswer: "studentScore",
    reasoning: "Variable names can't start with a number, can't have spaces, and shouldn't have special characters. studentScore uses camelCase — the standard style in Java.",
  },
  {
    id: 4,
    topic: "variables",
    type: "multiple-choice",
    question: "What data type stores a student's name like \"Maria\"?",
    options: ["int", "double", "String", "boolean"],
    currentAnswer: "String",
    reasoning: "String stores text — words, names, sentences. int = whole numbers, double = decimals, boolean = true/false. For a name, always use String.",
  },
  {
    id: 5,
    topic: "variables",
    type: "multiple-choice",
    question: "What does this print?\n\nString greeting = \"Hello\";\nString name = \"Alex\";\nSystem.out.println(greeting + \" \" + name);",
    options: ["Hello Alex", "greeting name", "HelloAlex", "Error"],
    currentAnswer: "Hello Alex",
    reasoning: "The + sign joins (concatenates) Strings. \"Hello\" + \" \" + \"Alex\" = \"Hello Alex\". The space between the two variables is important — without it you'd get \"HelloAlex\".",
  },
  {
    id: 6,
    topic: "variables",
    type: "multiple-choice",
    question: "A quiz app needs to store a score of 87.5. Which declaration is correct?",
    options: ["int score = 87.5;", "double score = 87.5;", "String score = 87.5;", "boolean score = 87.5;"],
    currentAnswer: "double score = 87.5;",
    reasoning: "int only holds whole numbers — 87.5 would cause an error. double holds decimal values, making it perfect for scores, prices, temperatures, and averages.",
  },
  {
    id: 7,
    topic: "variables",
    type: "multiple-choice",
    question: "What does this print?\n\nint x = 5;\nint y = x;\nx = 10;\nSystem.out.println(y);",
    options: ["5", "10", "0", "Error"],
    currentAnswer: "5",
    reasoning: "y = x copies the VALUE 5 into y. Changing x later doesn't affect y. Variables are independent — this is called value copying and is a common source of confusion.",
  },

  // ── Conditionals ──────────────────────────────────────────────────────────
  {
    id: 8,
    topic: "logic",
    type: "multiple-choice",
    question: "Real life: \"If it's raining, bring an umbrella.\" Which code matches this?\n\nboolean isRaining = true;",
    options: ["if (isRaining) { bringUmbrella(); }", "while (isRaining) { bringUmbrella(); }", "int isRaining = bringUmbrella;", "for (isRaining) { }"],
    currentAnswer: "if (isRaining) { bringUmbrella(); }",
    reasoning: "if checks a condition — if it's true, run the code inside. Just like real decisions: IF raining → umbrella. IF score >= 60 → passing. IF light is red → stop.",
  },
  {
    id: 9,
    topic: "logic",
    type: "multiple-choice",
    question: "What does this code print when score = 85?\n\nif (score >= 90) System.out.println(\"A\");\nelse if (score >= 80) System.out.println(\"B\");\nelse System.out.println(\"C\");",
    options: ["A", "B", "C", "A and B"],
    currentAnswer: "B",
    reasoning: "85 is not >= 90 so skip. 85 IS >= 80 so print \"B\" and stop. Once else if matches, the rest are skipped — this is how grade calculators work.",
  },
  {
    id: 10,
    topic: "logic",
    type: "multiple-choice",
    question: "A game gives a Gold Badge if score > 100. What prints when score = 55?\n\nif (score > 100) System.out.println(\"Gold Badge!\");\nelse System.out.println(\"Keep playing!\");",
    options: ["Gold Badge!", "Keep playing!", "Nothing", "Error"],
    currentAnswer: "Keep playing!",
    reasoning: "55 > 100 is FALSE, so the if block is skipped and else runs — printing \"Keep playing!\". The else is the fallback for when the condition isn't met.",
  },
  {
    id: 11,
    topic: "logic",
    type: "multiple-choice",
    question: "What does && mean in this condition?\n\nif (age >= 13 && age <= 17) {\n  System.out.println(\"Teenager!\");\n}",
    options: ["OR — either can be true", "NOT — flips the value", "AND — both must be true", "EQUALS — must match exactly"],
    currentAnswer: "AND — both must be true",
    reasoning: "&& means AND. age >= 13 AND age <= 17 must both be true. Age 12 fails the first check. Age 18 fails the second. Only 13–17 passes both.",
  },
  {
    id: 12,
    topic: "logic",
    type: "multiple-choice",
    question: "This code should print ONE message for temp = 75. What is the bug?\n\nif (temp > 60) System.out.println(\"Warm\");\nif (temp > 50) System.out.println(\"Not cold\");\nif (temp > 40) System.out.println(\"Above freezing\");",
    options: ["The numbers are wrong", "All three conditions are true — use else if instead", "It prints nothing", "temp should be a String"],
    currentAnswer: "All three conditions are true — use else if instead",
    reasoning: "75 > 60, 75 > 50, and 75 > 40 are all true — all three print! Separate if statements run independently. Use else if so only the first matching branch runs.",
  },
  {
    id: 13,
    topic: "logic",
    type: "multiple-choice",
    question: "What does ! (the NOT operator) do here?\n\nboolean gameOver = false;\nif (!gameOver) System.out.println(\"Keep playing!\");",
    options: ["Does nothing", "Flips false to true — the block runs", "Makes it print twice", "Crashes the program"],
    currentAnswer: "Flips false to true — the block runs",
    reasoning: "! means NOT. !false = true, so the if condition is true and \"Keep playing!\" prints. Common in games: if (!playerDead) — keep running the game loop.",
  },

  // ── Loops ─────────────────────────────────────────────────────────────────
  {
    id: 14,
    topic: "loops",
    type: "multiple-choice",
    question: "How many times does this loop print \"Hello\"?\n\nfor (int i = 0; i < 4; i++) {\n  System.out.println(\"Hello\");\n}",
    options: ["3 times", "4 times", "5 times", "Infinite"],
    currentAnswer: "4 times",
    reasoning: "i goes 0, 1, 2, 3 — when i = 4, the condition i < 4 is false and the loop stops. That's 4 times total. Starting at 0 (zero-based counting) is the standard in programming.",
  },
  {
    id: 15,
    topic: "loops",
    type: "multiple-choice",
    question: "What does this loop print last?\n\nfor (int i = 1; i <= 5; i++) {\n  System.out.println(i);\n}",
    options: ["4", "5", "6", "0"],
    currentAnswer: "5",
    reasoning: "i goes 1, 2, 3, 4, 5. When i = 6, the condition i <= 5 is false and the loop stops. The last value printed is 5.",
  },
  {
    id: 16,
    topic: "loops",
    type: "multiple-choice",
    question: "A game has 3 lives. What does this print?\n\nint lives = 3;\nwhile (lives > 0) {\n  System.out.println(\"Lives: \" + lives);\n  lives--;\n}",
    options: ["Lives: 3 2 1", "Lives: 3 2 1 0", "Lives: 0", "Runs forever"],
    currentAnswer: "Lives: 3 2 1",
    reasoning: "lives starts at 3. Each loop prints lives then subtracts 1. When lives = 0, the condition 0 > 0 is false — stop. The last value printed is 1 (when lives was 1, then it becomes 0 and exits).",
  },
  {
    id: 17,
    topic: "loops",
    type: "multiple-choice",
    question: "What is WRONG with this code?\n\nint count = 1;\nwhile (count > 0) {\n  System.out.println(count);\n  count++;\n}",
    options: ["count should start at 0", "It's an infinite loop — count grows forever", "The condition should use >=", "Nothing is wrong"],
    currentAnswer: "It's an infinite loop — count grows forever",
    reasoning: "count starts at 1 and increases every iteration — count > 0 is always true. The loop never stops and freezes your program. Your loop's condition must eventually become false.",
  },
  {
    id: 18,
    topic: "loops",
    type: "multiple-choice",
    question: "When is a WHILE loop a better choice than a FOR loop?",
    options: ["When you know exactly how many times to repeat", "When repeating until something changes (like waiting for a player to win)", "Only when counting numbers", "While loops are always better"],
    currentAnswer: "When repeating until something changes (like waiting for a player to win)",
    reasoning: "Use for when you know the count (repeat 10 times). Use while when you don't —  like \"keep asking for input until valid\" or \"keep playing until the player wins\".",
  },
  {
    id: 19,
    topic: "loops",
    type: "multiple-choice",
    question: "What is the value of total after this loop?\n\nint total = 0;\nfor (int i = 1; i <= 4; i++) {\n  total = total + i;\n}",
    options: ["4", "8", "10", "16"],
    currentAnswer: "10",
    reasoning: "total = 0+1+2+3+4 = 10. This pattern — adding each value to a running total — is called accumulation. It's used for shopping carts, score totals, and averages.",
  },

  // ── Functions ─────────────────────────────────────────────────────────────
  {
    id: 20,
    topic: "functions",
    type: "multiple-choice",
    question: "Why do we use functions in programming?",
    options: ["To make code longer", "To write code once and reuse it many times (DRY principle)", "Functions are required in every program", "To slow down code"],
    currentAnswer: "To write code once and reuse it many times (DRY principle)",
    reasoning: "DRY = Don't Repeat Yourself. Write a function once, call it anywhere. Fix a bug once, it's fixed everywhere. Like a recipe card you can hand to anyone.",
  },
  {
    id: 21,
    topic: "functions",
    type: "multiple-choice",
    question: "What does this function return for greet(\"Sam\")?\n\npublic static String greet(String name) {\n  return \"Hello, \" + name + \"!\";\n}",
    options: ["Hello, name!", "Hello, Sam!", "greet", "Sam"],
    currentAnswer: "Hello, Sam!",
    reasoning: "The function receives \"Sam\" as the name parameter, combines it with \"Hello, \" and \"!\", and returns \"Hello, Sam!\". return sends the result back to the caller.",
  },
  {
    id: 22,
    topic: "functions",
    type: "multiple-choice",
    question: "What does void mean as a return type?",
    options: ["Returns 0", "Returns a String", "Returns nothing — the function just does something", "The function is broken"],
    currentAnswer: "Returns nothing — the function just does something",
    reasoning: "void means no return value. The function performs an action (like printing) but doesn't send back an answer. Compare: greet() returns a String. printScore() just displays — both are useful.",
  },
  {
    id: 23,
    topic: "functions",
    type: "multiple-choice",
    question: "What does this print?\n\npublic static int add(int a, int b) {\n  return a + b;\n}\n\nSystem.out.println(add(3, 7));",
    options: ["3", "7", "10", "a + b"],
    currentAnswer: "10",
    reasoning: "add(3, 7) runs with a=3 and b=7, computes 3+7=10, and returns 10. Then println prints 10. Functions take inputs (parameters) and produce an output (return value).",
  },
  {
    id: 24,
    topic: "functions",
    type: "multiple-choice",
    question: "What is a 'parameter' in a function?\n\npublic static void sayHello(String name) { ... }",
    options: ["The function's name", "An input the function receives to do its job", "The value the function returns", "A variable defined outside the function"],
    currentAnswer: "An input the function receives to do its job",
    reasoning: "name is a parameter — the input given to the function. When you call sayHello(\"Jordan\"), \"Jordan\" is passed in as name. Recipe = function, ingredients = parameters.",
  },
  {
    id: 25,
    topic: "functions",
    type: "multiple-choice",
    question: "A function is nested inside another call. What prints?\n\npublic static int triple(int n) { return n * 3; }\n\nSystem.out.println(triple(triple(2)));",
    options: ["2", "6", "9", "18"],
    currentAnswer: "18",
    reasoning: "Inner call first: triple(2) = 6. Then outer: triple(6) = 18. Nested calls work like math parentheses — solve the inside first, use that result for the outside.",
  },

  // ── Debugging ─────────────────────────────────────────────────────────────
  {
    id: 26,
    topic: "debugging",
    type: "multiple-choice",
    question: "This code won't run. What is the error?\n\nint age = 14\nSystem.out.println(age);",
    options: ["age should be a String", "Missing semicolon after line 1", "println is wrong", "14 is too small"],
    currentAnswer: "Missing semicolon after line 1",
    reasoning: "Java requires a semicolon (;) at the end of every statement — like a period ending a sentence. Missing one causes a compile error. This is the most common beginner mistake.",
  },
  {
    id: 27,
    topic: "debugging",
    type: "multiple-choice",
    question: "The code compiles but crashes while running. What type of error is this?\n\nint[] scores = {90, 85, 70};\nSystem.out.println(scores[5]); // only 3 items!",
    options: ["Syntax error", "Runtime error", "Logic error", "No error"],
    currentAnswer: "Runtime error",
    reasoning: "Runtime errors crash the program DURING execution, not before. Index 5 doesn't exist in a 3-element array (valid: 0, 1, 2) — Java crashes with ArrayIndexOutOfBoundsException.",
  },
  {
    id: 28,
    topic: "debugging",
    type: "multiple-choice",
    question: "The code runs but gives the wrong answer. What type of error is this?\n\nint a = 80, b = 90, c = 70;\nint average = a + b + c / 3; // Should be (a+b+c)/3",
    options: ["Syntax error", "Runtime error", "Logic error", "No error"],
    currentAnswer: "Logic error",
    reasoning: "Logic errors: code runs without crashing but produces wrong results. Java does c/3 = 23 first (order of operations), then 80+90+23 = 193 instead of 240/3 = 80. The hardest bugs to find.",
  },
  {
    id: 29,
    topic: "debugging",
    type: "multiple-choice",
    question: "What is the fastest way to trace a logic error?",
    options: ["Delete code and restart", "Submit and hope it's right", "Add print statements to show variable values at each step", "Logic errors fix themselves"],
    currentAnswer: "Add print statements to show variable values at each step",
    reasoning: "Print-debugging: add System.out.println() at key points to see what your variables actually hold. Real developers do this every single day — it's a core professional skill.",
  },
  {
    id: 30,
    topic: "debugging",
    type: "multiple-choice",
    question: "What tool is BEST for finding syntax errors before you run your code?",
    options: ["Running the program", "The compiler / IDE error messages pointing to the line", "Asking a friend", "Deleting the file"],
    currentAnswer: "The compiler / IDE error messages pointing to the line",
    reasoning: "Compilers catch syntax errors BEFORE running. They tell you the exact line number and hint at what's wrong — like 'expected ;' or 'cannot find symbol'. Read error messages carefully.",
  },

  // ── Algorithms ────────────────────────────────────────────────────────────
  {
    id: 31,
    topic: "algorithms",
    type: "multiple-choice",
    question: "An algorithm is a step-by-step plan to solve a problem. Which is the BEST algorithm for making toast?",
    options: ["Make toast", "1. Put bread in toaster 2. Push lever 3. Wait 4. Remove toast", "Bread + heat = toast", "Think about toast first"],
    currentAnswer: "1. Put bread in toaster 2. Push lever 3. Wait 4. Remove toast",
    reasoning: "Algorithms must be specific, ordered, and complete. Vague instructions like 'make toast' don't work for computers — they need exact steps every time.",
  },
  {
    id: 32,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Why does ORDER matter in algorithms?\n\n// Making hot chocolate:\n1. Drink it\n2. Boil water\n3. Add cocoa\n4. Pour into cup",
    options: ["Order doesn't matter", "Step 1 happens before the drink is even made", "Cocoa powder is wrong", "You shouldn't boil water"],
    currentAnswer: "Step 1 happens before the drink is even made",
    reasoning: "Sequence — the order of steps — is one of the three core ideas in CS (with selection and repetition). Wrong order = wrong result. Code runs exactly in the order you write it.",
  },
  {
    id: 33,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Trace this algorithm. What is total at the end?\n\nnumbers = {5, 10, 3, 8}\ntotal = 0\nFor each number: total = total + number",
    options: ["5", "16", "26", "8"],
    currentAnswer: "26",
    reasoning: "Trace: 0+5=5, 5+10=15, 15+3=18, 18+8=26. This accumulation pattern is everywhere: shopping carts, quiz scores, temperature averages — always total = total + item.",
  },
  {
    id: 34,
    topic: "algorithms",
    type: "multiple-choice",
    question: "How many steps to find \"Carlos\" using linear search?\n\nList: [\"Alice\", \"Bob\", \"Carlos\", \"Diana\"]\nCheck Alice? No. Check Bob? No. Check Carlos? YES!",
    options: ["1 step", "2 steps", "3 steps", "4 steps"],
    currentAnswer: "3 steps",
    reasoning: "Linear search checks each item in order from the start. Carlos is at position 3, so it takes 3 checks. This is fine for small lists, but slow for very large ones.",
  },
  {
    id: 35,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Decomposition means breaking a big problem into smaller pieces. Which shows decomposition for building a game?",
    options: ["Write all code in one giant block", "Don't plan — just start coding", "Split into: Player, Score, Enemies, Controls — solve each part", "Only work on what you enjoy"],
    currentAnswer: "Split into: Player, Score, Enemies, Controls — solve each part",
    reasoning: "Decomposition is a core computational thinking skill. Big problems become manageable when broken into smaller independent pieces. Each piece is easier to code, test, and fix.",
  },
  {
    id: 36,
    topic: "algorithms",
    type: "multiple-choice",
    question: "What is the KEY step in this find-the-max algorithm?\n\n1. Set highest = first value\n2. For each value:\n   IF value > highest: highest = value  ← KEY\n3. Print highest",
    options: ["Step 1 — set the starting value", "Step 2 (IF) — update highest when a bigger value is found", "Step 3 — print the result", "The loop itself"],
    currentAnswer: "Step 2 (IF) — update highest when a bigger value is found",
    reasoning: "Without the comparison and update — 'if value > highest then update' — you'd never discover a larger number. This running-max pattern appears in leaderboards, weather data, and analytics apps.",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  const pool = topic
    ? QUESTIONS.filter(q => q.topic === topic)
    : QUESTIONS;

  if (pool.length === 0) {
    return NextResponse.json({ error: 'No questions found for this topic.' }, { status: 404 });
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];
  return NextResponse.json(selected);
}
