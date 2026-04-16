"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import {
  CheckCircle, Lock, ArrowRight, Play, Sparkles,
  Trophy, Code2, RotateCcw, Crown, Medal, Flame, Zap,
  BookOpen, Terminal, XCircle, Users, ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// HARDCODED SPRINT MISSIONS  (CS-focused, learning-first)
// ─────────────────────────────────────────────────────────────────────────────
type QuizQuestion = {
  prompt: string;
  code?: string;
  options: string[];
  answer: string;
  explanation: string;
};

type SprintMission = {
  id: string;
  title: string;
  topic: string;
  topicIcon: string;
  topicColor: string;
  description: string;
  xpReward: number;
  groupA: {
    role: string;
    challenge: string;
    questions: QuizQuestion[];
  };
  groupB: {
    role: string;
    challenge: string;
    questions: QuizQuestion[];
  };
  successMessage: string;
};

const MISSIONS: SprintMission[] = [
  // ── MISSION 1: Variables ──────────────────────────────────────────────────
  {
    id: "variables",
    title: "Variable Vault",
    topic: "Variables",
    topicIcon: "📦",
    topicColor: "#a855f7",
    description: "Group A learns what variables are and how to name them. Group B practices storing and changing values. Variables are how programs remember things!",
    xpReward: 400,
    groupA: {
      role: "Namers",
      challenge: "Understand what variables are and how to name them",
      questions: [
        {
          prompt: "A variable is like a labeled box that stores information. Which of these is the BEST description of a variable?",
          options: [
            "A fixed value that can never change",
            "A named storage location that holds a value",
            "A type of loop",
            "A button in an app",
          ],
          answer: "A named storage location that holds a value",
          explanation: "Think of a variable like a sticky note with a label. The label is the name (like 'score'), and you can write any value on it — and change it later. That's exactly what a variable does in code.",
        },
        {
          prompt: "Which variable name follows good naming rules?",
          code: `// Which is the best name for a variable
// that stores a student's age?
A) 1age
B) student age
C) studentAge
D) STUDENTAGE!!`,
          options: ["1age", "student age", "studentAge", "STUDENTAGE!!"],
          answer: "studentAge",
          explanation: "Variable names can't start with a number, can't have spaces, and shouldn't have special characters. studentAge is clear, readable, and follows the camelCase style used in Java.",
        },
        {
          prompt: "What is the value of score after this code runs?",
          code: `int score = 0;
score = score + 10;
score = score + 5;`,
          options: ["0", "10", "15", "50"],
          answer: "15",
          explanation: "score starts at 0. Then we add 10 (score = 10). Then we add 5 (score = 15). Each line updates the variable. This is exactly how a game keeps track of points!",
        },
      ],
    },
    groupB: {
      role: "Value Trackers",
      challenge: "Store and update values in variables",
      questions: [
        {
          prompt: "What data type should you use to store a student's name like \"Maria\"?",
          options: ["int", "double", "String", "boolean"],
          answer: "String",
          explanation: "String stores text (words, names, sentences). int stores whole numbers. double stores decimals. boolean stores true/false. For a name like \"Maria\", you always use String.",
        },
        {
          prompt: "What does this print?",
          code: `String greeting = "Hello";
String name = "Alex";
System.out.println(greeting + " " + name);`,
          options: ["Hello Alex", "greeting name", "HelloAlex", "Error"],
          answer: "Hello Alex",
          explanation: "The + sign with Strings joins (concatenates) them together. \"Hello\" + \" \" + \"Alex\" becomes \"Hello Alex\". The space in the middle is important — without it you'd get \"HelloAlex\".",
        },
        {
          prompt: "You're building a quiz app. Which variable correctly stores a score of 87.5?",
          options: [
            "int score = 87.5;",
            "double score = 87.5;",
            "String score = 87.5;",
            "boolean score = 87.5;",
          ],
          answer: "double score = 87.5;",
          explanation: "int only holds whole numbers — 87.5 would cause an error. double holds decimal numbers, making it perfect for scores, prices, temperatures, and averages.",
        },
      ],
    },
    successMessage: "Variable Vault unlocked! Variables are the building blocks — every app, game, and website uses them to remember information.",
  },

  // ── MISSION 2: Conditionals ───────────────────────────────────────────────
  {
    id: "conditionals",
    title: "Decision Dome",
    topic: "If / Else",
    topicIcon: "🤔",
    topicColor: "#3b82f6",
    description: "Group A writes the conditions that check if something is true. Group B handles what happens for each answer. Together you wire up the Decision Dome!",
    xpReward: 450,
    groupA: {
      role: "Condition Checkers",
      challenge: "Write and read if/else conditions",
      questions: [
        {
          prompt: "Real life: \"If it's raining, bring an umbrella.\" Which code matches this thinking?",
          code: `boolean isRaining = true;`,
          options: [
            "if (isRaining) { bringUmbrella(); }",
            "while (isRaining) { bringUmbrella(); }",
            "int isRaining = bringUmbrella;",
            "for (isRaining) { }",
          ],
          answer: "if (isRaining) { bringUmbrella(); }",
          explanation: "An if statement checks a condition — if it's true, run the code inside. Just like real life decisions: IF it's raining → bring umbrella. IF your score >= 60 → you pass. IF the light is red → stop.",
        },
        {
          prompt: "What does this code print when score = 85?",
          code: `int score = 85;
if (score >= 90) {
  System.out.println("A");
} else if (score >= 80) {
  System.out.println("B");
} else {
  System.out.println("C");
}`,
          options: ["A", "B", "C", "A and B"],
          answer: "B",
          explanation: "85 is NOT >= 90, so skip. 85 IS >= 80, so print \"B\" and stop. Once an else if matches, the rest are skipped. Your grade app works just like this!",
        },
        {
          prompt: "What does && mean in a condition?",
          code: `if (age >= 13 && age <= 17) {
  System.out.println("You are a teenager!");
}`,
          options: [
            "OR — either condition can be true",
            "NOT — flips true to false",
            "AND — both conditions must be true",
            "EQUALS — they must be the same",
          ],
          answer: "AND — both conditions must be true",
          explanation: "&& means AND. age >= 13 AND age <= 17 must BOTH be true to print the message. A 12-year-old fails the first check. An 18-year-old fails the second. Only 13–17 passes both.",
        },
      ],
    },
    groupB: {
      role: "Branch Builders",
      challenge: "Trace what happens in each branch",
      questions: [
        {
          prompt: "A game gives a badge if your score is over 100. What prints when score = 55?",
          code: `int score = 55;
if (score > 100) {
  System.out.println("Gold Badge!");
} else {
  System.out.println("Keep playing!");
}`,
          options: ["Gold Badge!", "Keep playing!", "Nothing", "Error"],
          answer: "Keep playing!",
          explanation: "55 > 100 is FALSE, so the if block is skipped. The else block runs instead and prints \"Keep playing!\". The else is the fallback — it runs when the condition is not met.",
        },
        {
          prompt: "What is the bug in this code? It should only print one message.",
          code: `int temp = 75;
if (temp > 60) System.out.println("Warm");
if (temp > 50) System.out.println("Not cold");
if (temp > 40) System.out.println("Above freezing");`,
          options: [
            "The numbers are wrong",
            "All three conditions are true — use else if instead",
            "It will print nothing",
            "temp should be a String",
          ],
          answer: "All three conditions are true — use else if instead",
          explanation: "75 > 60 ✓, 75 > 50 ✓, and 75 > 40 ✓ — all three print! Separate if statements each run independently. Change the 2nd and 3rd to else if so only one prints. This is a very common beginner mistake.",
        },
        {
          prompt: "What does ! (the NOT operator) do?",
          code: `boolean gameOver = false;
if (!gameOver) {
  System.out.println("Keep playing!");
}`,
          options: [
            "Does nothing",
            "Flips the boolean — turns false into true",
            "Makes it print twice",
            "Ends the game",
          ],
          answer: "Flips the boolean — turns false into true",
          explanation: "! means NOT. !false = true, so the condition is true and \"Keep playing!\" prints. !true = false. You'll see ! in games: if (!playerDead) — meaning if the player is NOT dead, keep running the game loop.",
        },
      ],
    },
    successMessage: "Decision Dome complete! Every app makes decisions — login checks, game scoring, weather alerts — they all use if/else logic.",
  },

  // ── MISSION 3: Loops ──────────────────────────────────────────────────────
  {
    id: "loops",
    title: "Loop Lab",
    topic: "Loops",
    topicIcon: "🔁",
    topicColor: "#10b981",
    description: "Group A runs for loops that count through numbers. Group B uses while loops to repeat until something changes. Loops are how computers do repetitive work instantly!",
    xpReward: 500,
    groupA: {
      role: "For Loop Operators",
      challenge: "Count with for loops and predict output",
      questions: [
        {
          prompt: "A for loop has three parts. What does each part do?",
          code: `for (int i = 1; i <= 5; i++) {
  System.out.println(i);
}
// start; condition; update`,
          options: [
            "start at 1; run while i <= 5; add 1 each time",
            "start at 5; run while i >= 1; subtract 1",
            "run forever; stop at 5; multiply by 1",
            "start at 0; run 5 times; reset to 0",
          ],
          answer: "start at 1; run while i <= 5; add 1 each time",
          explanation: "A for loop: (start; condition; update). int i = 1 sets start. i <= 5 means keep going while true. i++ adds 1 each round. This prints 1, 2, 3, 4, 5 — like counting on your fingers.",
        },
        {
          prompt: "How many times does this loop print \"Hello\"?",
          code: `for (int i = 0; i < 4; i++) {
  System.out.println("Hello");
}`,
          options: ["3 times", "4 times", "5 times", "Infinite"],
          answer: "4 times",
          explanation: "i starts at 0 and goes up by 1 each time: 0, 1, 2, 3. When i = 4, the condition i < 4 is false and the loop stops. Count: 0, 1, 2, 3 = 4 times. Starting at 0 instead of 1 is called zero-based counting.",
        },
        {
          prompt: "A teacher wants to print every student number from 1 to 30. What's the output of the LAST line printed?",
          code: `for (int student = 1; student <= 30; student++) {
  System.out.println("Student #" + student);
}`,
          options: ["Student #0", "Student #29", "Student #30", "Student #31"],
          answer: "Student #30",
          explanation: "The loop counts from 1 to 30 (inclusive, because of <=). The last value printed is student = 30. Loops save you from writing System.out.println 30 times!",
        },
      ],
    },
    groupB: {
      role: "While Loop Watchers",
      challenge: "Trace while loops and spot infinite loops",
      questions: [
        {
          prompt: "A while loop runs as long as its condition is true. What does this print?",
          code: `int lives = 3;
while (lives > 0) {
  System.out.println("Lives left: " + lives);
  lives--;
}`,
          options: [
            "Lives left: 3, 2, 1",
            "Lives left: 3, 2, 1, 0",
            "Lives left: 0",
            "Runs forever",
          ],
          answer: "Lives left: 3, 2, 1",
          explanation: "lives starts at 3. Each loop prints lives then subtracts 1. When lives = 0, the condition 0 > 0 is false and we stop. Just like a game: keeps running while you have lives remaining.",
        },
        {
          prompt: "What is WRONG with this code?",
          code: `int count = 1;
while (count > 0) {
  System.out.println(count);
  count++;
}`,
          options: [
            "count should start at 0",
            "It's an infinite loop — count grows forever",
            "The condition should use >=",
            "Nothing is wrong",
          ],
          answer: "It's an infinite loop — count grows forever",
          explanation: "count starts at 1 and increases each time. count > 0 is ALWAYS true because it keeps getting bigger. The loop never stops — this would freeze your program. Always make sure your loop has an exit!",
        },
        {
          prompt: "For loops and while loops can both solve the same problems. When is a WHILE loop the better choice?",
          options: [
            "When you know exactly how many times to repeat",
            "When you repeat until something specific happens (like a player winning)",
            "Only for counting numbers",
            "While loops are always better",
          ],
          answer: "When you repeat until something specific happens (like a player winning)",
          explanation: "Use a for loop when you know the count (repeat 10 times). Use a while loop when you don't know how many times — like \"keep playing until the player wins\" or \"keep asking for input until it's valid\".",
        },
      ],
    },
    successMessage: "Loop Lab closed! Loops are how programs do repetitive tasks in milliseconds — sorting lists, loading content, animating games. They're everywhere.",
  },

  // ── MISSION 4: Functions ──────────────────────────────────────────────────
  {
    id: "functions",
    title: "Function Factory",
    topic: "Functions & Methods",
    topicIcon: "⚙️",
    topicColor: "#f59e0b",
    description: "Group A defines functions with inputs. Group B calls them and uses their outputs. Functions are reusable recipe cards for your code!",
    xpReward: 550,
    groupA: {
      role: "Function Designers",
      challenge: "Write functions with parameters and return values",
      questions: [
        {
          prompt: "Why do we use functions (also called methods) in programming?",
          options: [
            "To make code longer and more complicated",
            "To write code once and reuse it many times (DRY: Don't Repeat Yourself)",
            "Functions are required in every Java program",
            "To slow down the program",
          ],
          answer: "To write code once and reuse it many times (DRY: Don't Repeat Yourself)",
          explanation: "DRY = Don't Repeat Yourself. Instead of writing the same 5 lines 10 times, write a function once and call it 10 times. If you fix a bug in the function, it's fixed everywhere — like a recipe card you can hand to anyone.",
        },
        {
          prompt: "What does this function return when called with greet(\"Sam\")?",
          code: `public static String greet(String name) {
  return "Hello, " + name + "!";
}`,
          options: ["Hello, name!", "Hello, Sam!", "greet", "Sam"],
          answer: "Hello, Sam!",
          explanation: "The function takes name as input (\"Sam\"), combines it with \"Hello, \" and \"!\", then returns the result. return sends the answer back to wherever the function was called — like a machine that takes an input and spits out an output.",
        },
        {
          prompt: "What does `void` mean as a return type?",
          code: `public static void printScore(int score) {
  System.out.println("Your score: " + score);
}`,
          options: [
            "The function returns 0",
            "The function returns a word",
            "The function returns nothing — it just does something",
            "void means the function is broken",
          ],
          answer: "The function returns nothing — it just does something",
          explanation: "void means 'no return value'. This function prints something — it does a job — but doesn't send back an answer. Compare: greet() returns a String. printScore() just prints. Both are useful for different situations.",
        },
      ],
    },
    groupB: {
      role: "Function Callers",
      challenge: "Call functions and trace return values",
      questions: [
        {
          prompt: "What does this print?",
          code: `public static int add(int a, int b) {
  return a + b;
}

System.out.println(add(3, 7));`,
          options: ["3", "7", "10", "a + b"],
          answer: "10",
          explanation: "add(3, 7) runs the function with a=3 and b=7, computes 3+7=10, and returns 10. Then println prints 10. Functions take inputs (called parameters or arguments) and produce an output (the return value).",
        },
        {
          prompt: "A function is called from inside another function. What prints?",
          code: `public static int double(int n) {
  return n * 2;
}

System.out.println(double(double(3)));`,
          options: ["3", "6", "9", "12"],
          answer: "12",
          explanation: "Inner call first: double(3) = 6. Then outer call: double(6) = 12. Nesting function calls works like math parentheses — solve the inside first, then use the result for the outside.",
        },
        {
          prompt: "What is a 'parameter' in a function?",
          code: `// What is 'name' in this function?
public static void sayHello(String name) {
  System.out.println("Hi, " + name);
}`,
          options: [
            "The function's name",
            "An input the function receives to do its job",
            "The value the function returns",
            "A variable defined outside the function",
          ],
          answer: "An input the function receives to do its job",
          explanation: "Parameters are the inputs a function needs. name is a parameter — when you call sayHello(\"Jordan\"), \"Jordan\" is passed in as the value of name. Like a recipe with ingredients: the recipe = function, ingredients = parameters.",
        },
      ],
    },
    successMessage: "Function Factory running! Every app is built from functions — login(), loadGame(), calculateScore(). Break big problems into small, reusable pieces.",
  },

  // ── MISSION 5: Debugging ──────────────────────────────────────────────────
  {
    id: "debugging",
    title: "Bug Bounty",
    topic: "Debugging",
    topicIcon: "🐛",
    topicColor: "#ef4444",
    description: "Group A hunts syntax errors (typos in code). Group B tracks logic bugs (code that runs but gives wrong answers). Debugging is one of the most important real-world CS skills!",
    xpReward: 500,
    groupA: {
      role: "Syntax Detectives",
      challenge: "Spot errors that stop the code from running",
      questions: [
        {
          prompt: "This code won't compile. What's the error?",
          code: `int age = 14
System.out.println(age);`,
          options: [
            "age should be a String",
            "Missing semicolon after line 1",
            "println is spelled wrong",
            "14 is too small a number",
          ],
          answer: "Missing semicolon after line 1",
          explanation: "Java requires a semicolon (;) at the end of every statement — it's like a period at the end of a sentence. Missing one causes a compile error before the program even runs. This is the single most common beginner mistake!",
        },
        {
          prompt: "What TYPE of error happens when code runs but crashes mid-way?",
          code: `// This compiles fine but crashes:
int[] scores = {90, 85, 70};
System.out.println(scores[5]); // only 3 items!`,
          options: ["Syntax error", "Runtime error", "Logic error", "No error"],
          answer: "Runtime error",
          explanation: "Runtime errors happen WHILE the program is running — not before. There's no index 5 in a 3-item array (valid: 0, 1, 2), so Java crashes with \"ArrayIndexOutOfBoundsException\". The code looked fine to the compiler but failed at runtime.",
        },
        {
          prompt: "Which tool is most useful for finding a syntax error?",
          options: [
            "Running the program and testing it",
            "The compiler / IDE error messages (they point to the line)",
            "Asking a friend to read it",
            "Deleting the code and starting over",
          ],
          answer: "The compiler / IDE error messages (they point to the line)",
          explanation: "The compiler catches syntax errors BEFORE running — it tells you the exact line number and what's wrong. Read the error message carefully. It often says \"expected ';'\" or \"cannot find symbol\" right next to the line with the problem.",
        },
      ],
    },
    groupB: {
      role: "Logic Hunters",
      challenge: "Find bugs that give wrong answers",
      questions: [
        {
          prompt: "This code should print the AVERAGE of 3 scores. What's wrong?",
          code: `int a = 80, b = 90, c = 70;
int average = a + b + c / 3;
System.out.println(average);`,
          options: [
            "The variables are wrong",
            "Division happens before addition — needs parentheses",
            "You can't average 3 numbers",
            "Nothing — it's correct",
          ],
          answer: "Division happens before addition — needs parentheses",
          explanation: "Order of operations! Java does c / 3 first (70/3 = 23), then adds 80 + 90 + 23 = 193. The fix: (a + b + c) / 3 = 240 / 3 = 80. Logic errors are silent — code runs but produces the wrong answer.",
        },
        {
          prompt: "What type of error is this? The program runs but the output is wrong.",
          code: `// Should check if a student is passing (>= 60):
int grade = 55;
if (grade > 60) {
  System.out.println("Passing");
}`,
          options: ["Syntax error", "Runtime error", "Logic error", "No error"],
          answer: "Logic error",
          explanation: "The condition uses > instead of >=. A grade of 60 should pass, but 60 > 60 is false. The code runs without crashing — but produces the wrong result. Logic errors are the hardest bugs to find because the computer doesn't know your intent.",
        },
        {
          prompt: "What's the fastest way to trace a logic error in your code?",
          options: [
            "Delete everything and start over",
            "Submit it anyway and hope it's right",
            "Add print statements to show variable values at each step",
            "Wait — logic errors fix themselves",
          ],
          answer: "Add print statements to show variable values at each step",
          explanation: "Print-debugging: add System.out.println() at key points to see what values your variables actually hold. It's like adding checkpoints to see where your program \"goes wrong\". Real professional developers do this every day.",
        },
      ],
    },
    successMessage: "Bug Bounty claimed! Professional developers spend up to 50% of their time debugging. Finding bugs is a superpower — not a sign you're bad at coding.",
  },

  // ── MISSION 6: Algorithms & Problem Solving ───────────────────────────────
  {
    id: "algorithms",
    title: "Algorithm Academy",
    topic: "Algorithms",
    topicIcon: "🗺️",
    topicColor: "#06b6d4",
    description: "Group A breaks down problems step by step (like writing a recipe). Group B traces through algorithms to predict what they do. Algorithms are just clear instructions!",
    xpReward: 550,
    groupA: {
      role: "Step Writers",
      challenge: "Write clear step-by-step algorithms",
      questions: [
        {
          prompt: "An algorithm is a step-by-step set of instructions to solve a problem. Which of these is the BEST algorithm for making a peanut butter sandwich?",
          options: [
            "Make sandwich, enjoy",
            "1. Get bread 2. Open peanut butter 3. Spread peanut butter 4. Close sandwich",
            "Put peanut butter somewhere on something",
            "Think about the sandwich",
          ],
          answer: "1. Get bread 2. Open peanut butter 3. Spread peanut butter 4. Close sandwich",
          explanation: "Algorithms must be specific, ordered, and complete. \"Make sandwich\" is too vague — a computer needs exact steps. In CS, we write algorithms before we write code to make sure our logic is correct first.",
        },
        {
          prompt: "Order matters in algorithms! What's wrong with this sequence?",
          code: `// Making hot chocolate:
1. Drink the hot chocolate
2. Boil water
3. Add cocoa powder
4. Pour water into cup`,
          options: [
            "Nothing — order doesn't matter",
            "Step 1 (drinking) happens before the drink is even made",
            "Cocoa powder is wrong",
            "You shouldn't boil water",
          ],
          answer: "Step 1 (drinking) happens before the drink is even made",
          explanation: "Sequence — the ORDER of steps — is one of the three core ideas in CS (along with selection/if-else and repetition/loops). If steps are out of order, the algorithm fails. Code runs exactly in the order you write it.",
        },
        {
          prompt: "This algorithm finds the highest score. What is the KEY step that makes it work?",
          code: `// Find highest score in a list:
1. Start: highest = first score
2. Look at each remaining score
3. IF this score > highest:
     highest = this score  ← KEY STEP
4. After all scores: print highest`,
          options: [
            "Step 1 — starting the algorithm",
            "Step 3 — updating highest when a bigger score is found",
            "Step 4 — printing the result",
            "Step 2 — looking at scores",
          ],
          answer: "Step 3 — updating highest when a bigger score is found",
          explanation: "The comparison and update — if current > highest, then highest = current — is what makes this work. Without it, you'd never find a number bigger than your starting value. This pattern (tracking a running max/min) appears in almost every app.",
        },
      ],
    },
    groupB: {
      role: "Algorithm Tracers",
      challenge: "Follow algorithms step by step and predict results",
      questions: [
        {
          prompt: "Trace this algorithm. What is the final value of total?",
          code: `// Algorithm: sum a list of numbers
int[] numbers = {5, 10, 3, 8};
int total = 0;

for each number in the list:
  total = total + number`,
          options: ["5", "16", "26", "8"],
          answer: "26",
          explanation: "Trace it: total = 0+5=5, then 5+10=15, then 15+3=18, then 18+8=26. This pattern — accumulating a running total — is used everywhere: adding up a shopping cart, totaling test scores, calculating average temperature.",
        },
        {
          prompt: "This algorithm searches for a name. How many steps does it take to find \"Carlos\" in the list?",
          code: `// List: ["Alice", "Bob", "Carlos", "Diana"]
// Linear Search: check each item in order

Step 1: Is "Alice" == "Carlos"? No
Step 2: Is "Bob" == "Carlos"? No
Step 3: Is "Carlos" == "Carlos"? YES — found it!`,
          options: ["1 step", "2 steps", "3 steps", "4 steps"],
          answer: "3 steps",
          explanation: "Linear search checks items one by one from the start. For a 4-item list, worst case is 4 steps (item is last or not there at all). This is fine for small lists, but for 1,000,000 items it would be very slow — that's why smarter search algorithms matter.",
        },
        {
          prompt: "Decomposition means breaking a big problem into smaller pieces. Which approach shows decomposition for building a game?",
          options: [
            "Write all the game code in one giant block",
            "Don't plan — just start coding",
            "Break it into: Player, Enemies, Score, Controls — then solve each part",
            "Only work on the part you enjoy",
          ],
          answer: "Break it into: Player, Enemies, Score, Controls — then solve each part",
          explanation: "Decomposition is a core computational thinking skill. Big problems (\"build a game\") become manageable when split into smaller pieces (Player movement, Enemy AI, Score tracking). Each piece is easier to code, test, and fix independently.",
        },
      ],
    },
    successMessage: "Algorithm Academy complete! Every app, game, and website runs on algorithms. Learning to think in steps and solve problems is the heart of Computer Science.",
  },
];


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type TeamResult = {
  questionsAnswered: number;
  questionsCorrect: number;
  points: number;
  completed: boolean;
};

const freshTeam = (): TeamResult => ({
  questionsAnswered: 0,
  questionsCorrect: 0,
  points: 0,
  completed: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// XP BURST
// ─────────────────────────────────────────────────────────────────────────────
function XpBurst({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, y: 0 }}
      animate={{ scale: 1.4, opacity: 1, y: -60 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 999, pointerEvents: "none", textAlign: "center",
      }}
    >
      <div style={{
        fontSize: "3rem", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace",
        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 0 20px rgba(245,158,11,0.8))",
      }}>
        +{amount} XP ⚡
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function QuizChallenge({
  questions, onComplete, teamColor, teamName, isActive, isCompleted,
}: {
  questions: QuizQuestion[];
  onComplete: (correct: number, total: number) => void;
  teamColor: string;
  teamName: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIndex];
  const isCorrect = selected === q?.answer;

  const handleSelect = (opt: string) => {
    if (revealed || !isActive) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === q.answer) setCorrectCount(c => c + 1);
  };

  const handleNext = useCallback(() => {
    if (qIndex + 1 < questions.length) {
      setQIndex(i => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setDone(true);
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      onComplete(finalCorrect, questions.length);
    }
  }, [qIndex, questions.length, isCorrect, correctCount, onComplete]);

  if (isCompleted) {
    return (
      <div style={{
        padding: "1.5rem", background: `${teamColor}15`,
        border: `2px solid ${teamColor}40`, borderRadius: "var(--radius-md)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
        <div style={{ color: teamColor, fontWeight: 700, fontSize: "1.1rem" }}>Challenge Complete!</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          {teamName} finished their round
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div style={{
        padding: "1.5rem", background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)",
        textAlign: "center", opacity: 0.6,
      }}>
        <Lock size={24} color="var(--text-muted)" style={{ marginBottom: "0.5rem" }} />
        <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Waiting for Group A to finish first...
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{
        padding: "1.5rem", background: `${teamColor}10`,
        border: `1px solid ${teamColor}30`, borderRadius: "var(--radius-md)",
        textAlign: "center",
      }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
          style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎯</motion.div>
        <div style={{ color: teamColor, fontWeight: 700, fontSize: "1rem" }}>Answers submitted!</div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem" }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "4px", borderRadius: "2px",
            background: i < qIndex ? teamColor : i === qIndex ? `${teamColor}60` : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Question counter */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        marginBottom: "1rem", fontSize: "0.75rem", color: "var(--text-muted)",
        fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1px",
      }}>
        <BookOpen size={13} />
        Question {qIndex + 1} of {questions.length}
      </div>

      {/* Prompt */}
      <p style={{ color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "1rem", fontWeight: 500 }}>
        {q.prompt}
      </p>

      {/* Code block */}
      {q.code && (
        <div style={{
          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem",
          color: "#e2e8f0", marginBottom: "1.25rem",
          whiteSpace: "pre", overflowX: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", opacity: 0.5 }}>
            <Terminal size={12} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "1px", textTransform: "uppercase" }}>Java</span>
          </div>
          {q.code}
        </div>
      )}

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const correct = opt === q.answer;
          let bg = "rgba(255,255,255,0.03)";
          let border = "1px solid rgba(255,255,255,0.08)";
          let color = "var(--text-primary)";
          if (revealed) {
            if (correct) { bg = "rgba(16,185,129,0.12)"; border = "1px solid #10b981"; color = "#10b981"; }
            else if (isSelected) { bg = "rgba(239,68,68,0.1)"; border = "1px solid #ef4444"; color = "#ef4444"; }
          } else if (isSelected) {
            bg = `${teamColor}15`; border = `1px solid ${teamColor}`;
          }
          return (
            <motion.button
              key={opt}
              whileHover={!revealed ? { x: 3 } : {}}
              whileTap={!revealed ? { scale: 0.99 } : {}}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              style={{
                padding: "0.875rem 1rem", background: bg, border, borderRadius: "var(--radius-sm)",
                cursor: revealed ? "default" : "pointer", textAlign: "left",
                color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88rem",
                display: "flex", alignItems: "center", gap: "0.875rem", transition: "all 0.2s",
              }}
            >
              <span style={{
                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: revealed && correct ? "#10b981" : revealed && isSelected ? "#ef4444" : "rgba(255,255,255,0.06)",
                fontSize: "0.75rem", fontWeight: 700,
              }}>
                {revealed && correct ? "✓" : revealed && isSelected ? "✕" : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: "hidden", padding: "1rem", marginBottom: "1rem",
              background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.06)",
              border: `1px solid ${isCorrect ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
              {isCorrect
                ? <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                : <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: isCorrect ? "#10b981" : "#ef4444", marginBottom: "0.25rem" }}>
                  {isCorrect ? "Correct! 🔥" : `Incorrect — Answer: ${q.answer}`}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                  {q.explanation}
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                marginTop: "0.875rem", width: "100%", padding: "0.625rem",
                background: teamColor, border: "none", borderRadius: "var(--radius-sm)",
                color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
              }}
            >
              {qIndex + 1 < questions.length ? <><ArrowRight size={15} /> Next Question</> : <><Trophy size={15} /> Finish Challenge</>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SprintPage() {
  const { addXp, incrementTeamMissions } = useProgress();

  // Which mission the teacher selected
  const [selectedMission, setSelectedMission] = useState<SprintMission | null>(null);
  // Which team the student picked
  const [team, setTeam] = useState<"GroupA" | "GroupB" | null>(null);

  // Local team results (no Firebase, no server)
  const [groupAResult, setGroupAResult] = useState<TeamResult>(freshTeam());
  const [groupBResult, setGroupBResult] = useState<TeamResult>(freshTeam());

  const [showFinalEnd, setShowFinalEnd] = useState(false);
  const [showXpBurst, setShowXpBurst] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  const mission = selectedMission;

  // ── Quiz completion handlers ──────────────────────────────────────────────
  const handleGroupAComplete = (correct: number, total: number) => {
    if (!mission) return;
    const pts = Math.round((correct / total) * mission.xpReward * 0.5);
    addXp(pts);
    setXpAmount(pts);
    setShowXpBurst(true);
    setGroupAResult({ questionsAnswered: total, questionsCorrect: correct, points: pts, completed: true });
  };

  const handleGroupBComplete = (correct: number, total: number) => {
    if (!mission) return;
    const pts = Math.round((correct / total) * mission.xpReward * 0.5);
    addXp(pts);
    setXpAmount(pts);
    setShowXpBurst(true);
    setGroupBResult({ questionsAnswered: total, questionsCorrect: correct, points: pts, completed: true });
  };

  // Auto-show final when both done
  useEffect(() => {
    if (groupAResult.completed && groupBResult.completed && !showFinalEnd) {
      const t = setTimeout(() => setShowFinalEnd(true), 600);
      return () => clearTimeout(t);
    }
  }, [groupAResult.completed, groupBResult.completed, showFinalEnd]);

  const handlePlayAgain = () => {
    setGroupAResult(freshTeam());
    setGroupBResult(freshTeam());
    setShowFinalEnd(false);
    setTeam(null);
  };

  const handleNewMission = () => {
    setGroupAResult(freshTeam());
    setGroupBResult(freshTeam());
    setShowFinalEnd(false);
    setTeam(null);
    setSelectedMission(null);
  };

  const getWinner = () => {
    const a = groupAResult.points, b = groupBResult.points;
    return a > b ? "GroupA" : b > a ? "GroupB" : "tie";
  };

  // Group B unlocks after Group A is done
  const groupBUnlocked = groupAResult.completed;
  const isMyTurnActive = team === "GroupA"
    ? !groupAResult.completed
    : (groupBUnlocked && !groupBResult.completed);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Mission Selector
  // ─────────────────────────────────────────────────────────────────────────
  if (!selectedMission) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <Sparkles size={18} color="var(--accent-blue)" />
            <span style={{
              color: "var(--accent-blue)", fontSize: "0.75rem",
              fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase",
              letterSpacing: "1.5px", fontWeight: 600,
            }}>CS Sprint</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1.5px", marginBottom: "0.5rem" }}>
            Choose a Mission
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}>
            Pick a CS topic to sprint on. Group A and Group B each get different questions on the same concept.
          </p>
        </div>

        {/* Mission grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {MISSIONS.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -3, borderColor: m.topicColor }}
              onClick={() => setSelectedMission(m)}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: "var(--radius-md)", padding: "1.5rem",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "2rem" }}>{m.topicIcon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", marginBottom: "0.125rem" }}>
                      {m.title}
                    </div>
                    <span style={{
                      fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                      color: m.topicColor, background: `${m.topicColor}15`,
                      padding: "0.125rem 0.5rem", borderRadius: "999px",
                    }}>{m.topic}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace",
                  color: "#f59e0b", background: "rgba(245,158,11,0.1)",
                  padding: "0.25rem 0.625rem", borderRadius: "999px", flexShrink: 0,
                }}>+{m.xpReward} XP</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                {m.description}
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1, padding: "0.5rem 0.75rem", background: "rgba(99,102,241,0.06)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                  <div style={{ color: "#818cf8", fontWeight: 600, marginBottom: "0.125rem" }}>Group A</div>
                  {m.groupA.role}
                </div>
                <div style={{ flex: 1, padding: "0.5rem 0.75rem", background: "rgba(59,130,246,0.06)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                  <div style={{ color: "#60a5fa", fontWeight: 600, marginBottom: "0.125rem" }}>Group B</div>
                  {m.groupB.role}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "1rem", color: m.topicColor, fontSize: "0.8rem", fontWeight: 600 }}>
                <Play size={13} /> Start Sprint <ArrowRight size={13} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Team picker
  // ─────────────────────────────────────────────────────────────────────────
  if (!mission) return null;

  if (!team) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "1.5rem" }}>

        {/* Back button */}
        <button
          onClick={() => setSelectedMission(null)}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.375rem" }}
        >
          ← Back to missions
        </button>

        {/* Mission header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "2.5rem" }}>{mission.topicIcon}</span>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px" }}>
                {mission.title}
              </h1>
              <span style={{
                fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace",
                color: mission.topicColor, background: `${mission.topicColor}15`,
                padding: "0.125rem 0.625rem", borderRadius: "999px",
              }}>{mission.topic}</span>
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{mission.description}</p>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Which group are you in?
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {/* Group A */}
          <motion.div
            onClick={() => setTeam("GroupA")}
            whileHover={{ scale: 1.005, x: 2 }} whileTap={{ scale: 0.995 }}
            style={{
              padding: "1.25rem 1.5rem", background: "rgba(99,102,241,0.05)",
              border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-md)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Code2 size={22} color="var(--accent-indigo)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                    Group A — {mission.groupA.role}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontFamily: "'JetBrains Mono', monospace" }}>
                    {mission.groupA.challenge}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{mission.groupA.questions.length} Qs</span>
                <ArrowRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          </motion.div>

          {/* Group B */}
          <motion.div
            onClick={() => setTeam("GroupB")}
            whileHover={{ scale: 1.005, x: 2 }} whileTap={{ scale: 0.995 }}
            style={{
              padding: "1.25rem 1.5rem", background: "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.2)", borderRadius: "var(--radius-md)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={22} color="var(--accent-blue)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                    Group B — {mission.groupB.role}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontFamily: "'JetBrains Mono', monospace" }}>
                    {mission.groupB.challenge}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{mission.groupB.questions.length} Qs</span>
                <ArrowRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ marginTop: "1.5rem", padding: "0.875rem 1.25rem", background: "rgba(255,255,255,0.015)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.05)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <Flame size={13} style={{ display: "inline", marginRight: "0.375rem", verticalAlign: "-2px", color: "#f59e0b" }} />
          Group A goes first — Group B unlocks after Group A finishes.
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Game view
  // ─────────────────────────────────────────────────────────────────────────
  const teamColor = team === "GroupA" ? "#6366f1" : "#3b82f6";
  const myLabel = team === "GroupA" ? "Group A" : "Group B";

  return (
    <>
      {/* XP Burst */}
      <AnimatePresence>
        {showXpBurst && (
          <XpBurst amount={xpAmount} onDone={() => setShowXpBurst(false)} />
        )}
      </AnimatePresence>

      {/* Final Results Modal */}
      <AnimatePresence>
        {showFinalEnd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}>
            <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }}
              style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", padding: "3rem", maxWidth: "520px", width: "100%", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
              {(() => {
                const winner = getWinner();
                return (
                  <>
                    <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.15 }} style={{ marginBottom: "1.5rem" }}>
                      {winner === "tie"
                        ? <span style={{ fontSize: "4rem" }}>🤝</span>
                        : <Crown size={72} color="#f59e0b" style={{ filter: "drop-shadow(0 0 20px rgba(245,158,11,0.5))" }} />}
                    </motion.div>
                    <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                      Sprint Complete!
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      {mission.successMessage}
                    </p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "2rem" }}>
                      {winner === "tie" ? "Both teams tied — great effort!" : `${winner === "GroupA" ? "Group A" : "Group B"} wins this round! 🏆`}
                    </p>

                    {/* Scores */}
                    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "2rem", justifyContent: "center" }}>
                      {(["GroupA", "GroupB"] as const).map(t => {
                        const result = t === "GroupA" ? groupAResult : groupBResult;
                        const isWin = winner === t;
                        return (
                          <div key={t} style={{
                            flex: 1, padding: "1.5rem", borderRadius: "var(--radius-md)",
                            background: isWin ? (t === "GroupA" ? "rgba(99,102,241,0.15)" : "rgba(59,130,246,0.15)") : "rgba(255,255,255,0.03)",
                            border: isWin ? `2px solid ${t === "GroupA" ? "#6366f1" : "#3b82f6"}` : "1px solid rgba(255,255,255,0.08)",
                          }}>
                            {isWin && <Crown size={20} color="#f59e0b" style={{ marginBottom: "0.5rem" }} />}
                            <div style={{ color: t === "GroupA" ? "var(--accent-indigo)" : "var(--accent-blue)", fontWeight: 700, marginBottom: "0.5rem" }}>
                              {t === "GroupA" ? "Group A" : "Group B"}
                            </div>
                            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                              {result.points}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {result.questionsCorrect}/{result.questionsAnswered} correct
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <motion.button onClick={() => { incrementTeamMissions(); handlePlayAgain(); }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", border: "none", borderRadius: "var(--radius-md)", padding: "0.875rem 1.75rem", cursor: "pointer", color: "white", fontWeight: 700, fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <RotateCcw size={16} /> Play Again
                      </motion.button>
                      <motion.button onClick={() => { incrementTeamMissions(); handleNewMission(); }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)", padding: "0.875rem 1.75rem", cursor: "pointer", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <ChevronDown size={16} /> New Mission
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GAME UI ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: "820px", margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{mission.topicIcon}</span>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                {mission.title}
              </h1>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontFamily: "'JetBrains Mono', monospace" }}>
              {myLabel} — {team === "GroupA" ? mission.groupA.role : mission.groupB.role}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem",
              borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
              background: teamColor + "15", color: teamColor, border: `1px solid ${teamColor}30`,
            }}>
              <Users size={12} /> {myLabel}
            </div>
            <button
              onClick={() => setTeam(null)}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "999px", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
            >
              Switch
            </button>
          </div>
        </div>

        {/* Score strip */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem",
          background: "rgba(255,255,255,0.02)", padding: "0.875rem 1.5rem",
          borderRadius: "var(--radius-md)", marginBottom: "1.75rem",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          {(["GroupA", "GroupB"] as const).map((t, i) => {
            const result = t === "GroupA" ? groupAResult : groupBResult;
            const tColor = t === "GroupA" ? "#6366f1" : "#3b82f6";
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {i === 1 && <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>vs</div>}
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.65rem", textTransform: "uppercase" }}>
                    {t === "GroupA" ? "Group A" : "Group B"}
                  </div>
                  <div style={{ color: result.completed ? tColor : "var(--text-primary)", fontWeight: 800, fontSize: "1.25rem", fontFamily: "'JetBrains Mono', monospace" }}>
                    {result.completed ? `${result.points} pts` : "—"}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                    {result.completed ? `${result.questionsCorrect}/${result.questionsAnswered} correct` : "In progress"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-column quiz layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {/* Group A panel */}
          <div style={{
            background: team === "GroupA" ? "rgba(99,102,241,0.04)" : "rgba(255,255,255,0.01)",
            border: team === "GroupA" ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-md)", padding: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <Code2 size={16} color="#6366f1" />
              <span style={{ color: "#818cf8", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px" }}>Group A</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>— {mission.groupA.role}</span>
              {groupAResult.completed && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.25rem", color: "#10b981", fontSize: "0.75rem" }}>
                  <Zap size={12} />+{groupAResult.points} XP
                </div>
              )}
            </div>
            <QuizChallenge
              questions={mission.groupA.questions}
              onComplete={handleGroupAComplete}
              teamColor="#6366f1"
              teamName="Group A"
              isActive={team === "GroupA" && !groupAResult.completed}
              isCompleted={groupAResult.completed}
            />
          </div>

          {/* Group B panel */}
          <div style={{
            background: team === "GroupB" ? "rgba(59,130,246,0.04)" : "rgba(255,255,255,0.01)",
            border: team === "GroupB" ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-md)", padding: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <Users size={16} color="#3b82f6" />
              <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px" }}>Group B</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>— {mission.groupB.role}</span>
              {groupBResult.completed && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.25rem", color: "#10b981", fontSize: "0.75rem" }}>
                  <Zap size={12} />+{groupBResult.points} XP
                </div>
              )}
            </div>
            <QuizChallenge
              questions={mission.groupB.questions}
              onComplete={handleGroupBComplete}
              teamColor="#3b82f6"
              teamName="Group B"
              isActive={team === "GroupB" && groupBUnlocked && !groupBResult.completed}
              isCompleted={groupBResult.completed}
            />
          </div>
        </div>

        {/* Status footer */}
        <div style={{
          marginTop: "1.5rem", padding: "0.875rem 1.25rem",
          background: "rgba(255,255,255,0.015)", borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <Flame size={13} color="#f59e0b" />
            <span>Group A goes first — Group B unlocks when A finishes</span>
          </div>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: groupAResult.completed ? "#10b981" : "var(--text-muted)" }}>
              A: {groupAResult.completed ? "✓ Done" : `${groupAResult.questionsAnswered}/${mission.groupA.questions.length}`}
            </span>
            <span style={{ color: groupBResult.completed ? "#10b981" : groupBUnlocked ? "var(--accent-blue)" : "var(--text-muted)" }}>
              B: {groupBResult.completed ? "✓ Done" : groupBUnlocked ? `${groupBResult.questionsAnswered}/${mission.groupB.questions.length}` : "Locked"}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}