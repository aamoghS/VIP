"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import {
  CheckCircle, Lock, ArrowRight, Play, Sparkles,
  Trophy, Code2, RotateCcw, Crown, Medal, Flame, Zap,
  BookOpen, Terminal, XCircle, Users, ChevronDown,
} from "lucide-react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  handoffMessage: string;
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
    description: "Group A sets up the game's core variable. Group B takes that exact variable and updates it when the player scores. You must pass the baton!",
    xpReward: 400,
    groupA: {
      role: "Architects",
      challenge: "Define the score variable to start the game",
      questions: [
        {
          prompt: "We need a variable to track the player's score. Which of these is the BEST description of a variable?",
          options: [
            "A fixed value that never changes",
            "A named storage box that holds a value",
            "A type of loop for counting",
            "A visual button in the game",
          ],
          answer: "A named storage box that holds a value",
          explanation: "A variable is like a labeled box. The label is the name ('score'), and you can store values inside it and change them later.",
        },
        {
          prompt: "What is the best data type to store a game score (like 150 points)?",
          options: ["String", "boolean", "int", "char"],
          answer: "int",
          explanation: "Scores are whole numbers. 'int' stands for integer, which is perfect for counts, scores, and lives.",
        },
        {
          prompt: "Write the code to create the score variable and set it to zero for the start of the game.",
          code: `// Set up the start of the game`,
          options: [
            "int score = 0;",
            "score = 0;",
            "String score = '0';",
            "int score;",
          ],
          answer: "int score = 0;",
          explanation: "You must declare the type (int), name the variable (score), and set its initial value (= 0). Now the game is ready!",
        },
      ],
    },
    handoffMessage: "Group A successfully created: `int score = 0;`. Group B, you must use this variable to give the player points!",
    groupB: {
      role: "Gameplay Engineers",
      challenge: "Update the score variable Group A created",
      questions: [
        {
          prompt: "Group A handed you the 'score' variable. The player just grabbed a coin! How do you add 10 points to their score?",
          code: `// Group A code:
int score = 0;
// Your code:`,
          options: [
            "int score = 10;",
            "score = score + 10;",
            "score = 10;",
            "score + 10;"
          ],
          answer: "score = score + 10;",
          explanation: "To update an existing variable, you don't redeclare the 'int' part. \"score = score + 10\" means \"take the old score (0), add 10, and save it back into the score box.\"",
        },
        {
          prompt: "Now the player grabbed a rare gem worth 50 points! Update the score again.",
          code: `// Group A code: int score = 0;
// Your previous code: score = score + 10;
// What is the NEW score if you add 50?`,
          options: ["50", "60", "0", "1050"],
          answer: "60",
          explanation: "Variables remember their state. The score was 10. Adding 50 makes it 60. This memory is the core of all applications.",
        },
        {
          prompt: "Game over! How do you print the final score to the screen for the player to see?",
          options: [
            "System.out.println(score);",
            "System.out.println(\"score\");",
            "print score;",
            "System.print(score);"
          ],
          answer: "System.out.println(score);",
          explanation: "Without quotes, Java looks inside the variable box and prints the number (60). If you used quotes, it would literally print the word 'score'.",
        },
      ],
    },
    successMessage: "Variable Vault unlocked! Group A built the memory, and Group B manipulated it. That's teamwork!",
  },

  // ── MISSION 2: Conditionals ───────────────────────────────────────────────
  {
    id: "conditionals",
    title: "Decision Dome",
    topic: "If / Else",
    topicIcon: "🤔",
    topicColor: "#3b82f6",
    description: "Group A sets the entry criteria by writing the boolean logic. Group B takes that logic and wires up the consequences. Split the decision in half!",
    xpReward: 450,
    groupA: {
      role: "Gatekeepers",
      challenge: "Write the boolean condition for a VIP club",
      questions: [
        {
          prompt: "We are programming a bouncer for a VIP club. People must be 18 or older to enter. Which operator means 'greater than or equal to'?",
          options: [">=", "=>", "==", ">"],
          answer: ">=",
          explanation: "In Java, >= means greater than or equal to. It checks if the value on the left is larger or the exact same as the right.",
        },
        {
          prompt: "Write the if statement condition that checks if a variable 'age' is 18 or older.",
          options: [
            "if (age > 18)",
            "if (age == 18)",
            "if (age >= 18)",
            "if age >= 18:"
          ],
          answer: "if (age >= 18)",
          explanation: "Parentheses () are required around conditions in Java. 'age >= 18' is the exact boolean check we need for the bouncer.",
        },
        {
          prompt: "Wait! We also need them to have a VIP pass. Which operator means 'AND' to combine conditions?",
          options: ["||", "&&", "++", "=="],
          answer: "&&",
          explanation: "&& is the logical AND operator. It means BOTH conditions must be true. Combining them: if (age >= 18 && hasPass)",
        },
      ],
    },
    handoffMessage: "Group A built the condition: `if (age >= 18 && hasPass)`. Group B, use this check to let them into the club or reject them!",
    groupB: {
      role: "Consequence Coders",
      challenge: "Write the action blocks for Group A's condition",
      questions: [
        {
          prompt: "Group A handed you the bouncer check. If the condition is TRUE, print 'Welcome VIP!'. What block wraps this action?",
          code: `// Group A:
if (age >= 18 && hasPass) 
// Your action:`,
          options: [
            "{ System.out.println(\"Welcome VIP!\"); }",
            "( System.out.println(\"Welcome VIP!\"); )",
            "[ System.out.println(\"Welcome VIP!\"); ]",
            "print \"Welcome VIP!\""
          ],
          answer: "{ System.out.println(\"Welcome VIP!\"); }",
          explanation: "Curly braces {} define the 'block' of code that runs if the condition is true. Parentheses are for conditions; braces are for actions.",
        },
        {
          prompt: "What if the condition is FALSE? We need to reject them. Which keyword acts as the backup plan?",
          options: ["otherwise", "backup", "else", "catch"],
          answer: "else",
          explanation: "The 'else' block acts as a catch-all. If the 'if' condition is false, the code drops immediately into the 'else' block.",
        },
        {
          prompt: "Put it all together. What happens if the person is 19 but DOES NOT have a pass (hasPass = false)?",
          code: `// Group A + Group B combined:
if (age >= 18 && hasPass) {
  System.out.println("Welcome VIP!");
} else {
  System.out.println("Go home.");
}`,
          options: ["Welcome VIP!", "Go home.", "Error", "Nothing prints"],
          answer: "Go home.",
          explanation: "Because the && operator requires BOTH to be true, the lack of a VIP pass makes the whole condition false, triggering the else block.",
        },
      ],
    },
    successMessage: "Decision Dome complete! Group A set the rules, Group B built the outcomes. Seamless logic pipeline!",
  },

  // ── MISSION 3: Loops ──────────────────────────────────────────────────────
  {
    id: "loops",
    title: "Loop Labyrinth",
    topic: "Loops",
    topicIcon: "🔁",
    topicColor: "#10b981",
    description: "Group A creates the 'while' loop condition that runs the monster spawner. Group B is trapped inside the loop and must figure out how to stop it!",
    xpReward: 500,
    groupA: {
      role: "Loop Starters",
      challenge: "Set up the condition that makes a loop run",
      questions: [
        {
          prompt: "A 'while' loop repeats code automatically. It keeps running AS LONG AS... what?",
          options: [
            "The program is open",
            "Its boolean condition remains true",
            "It runs exactly 10 times",
            "The user presses the Enter key"
          ],
          answer: "Its boolean condition remains true",
          explanation: "A while loop is just an 'if' statement that repeats. As long as its condition is true, it goes back to the top and runs again.",
        },
        {
          prompt: "We want an enemy spawner to run while we have fewer than 5 enemies. How do we start this?",
          options: [
            "if (enemies < 5) {",
            "loop (enemies == 5) {",
            "while (enemies < 5) {",
            "for (enemies > 5) {"
          ],
          answer: "while (enemies < 5) {",
          explanation: "The 'while' keyword checks the condition before every round. If you currently have 3 enemies, 3 < 5 is true, so a new enemy spawns.",
        },
        {
          prompt: "What happens if Group B never writes the code to increase the 'enemies' count?",
          options: [
            "The game crashes instantly",
            "The loop stops by itself",
            "It creates an infinite loop and freezes the game",
            "It skips the loop"
          ],
          answer: "It creates an infinite loop and freezes the game",
          explanation: "If the condition (enemies < 5) is true, and the variable never changes, the condition stays true forever. The game will keep spawning enemies until it crashes!",
        },
      ],
    },
    handoffMessage: "Group A wrote the loop engine: `int enemies = 0; while (enemies < 5) { spawnEnemy(); ... }`. Group B, you are trapped inside! You must write the escape code!",
    groupB: {
      role: "Loop Breakers",
      challenge: "Update the loop variable to prevent an infinite crush",
      questions: [
        {
          prompt: "Group A threw you into a loop! `while (enemies < 5)`. To eventually break out, what must you do inside the loop?",
          options: [
            "Change the 'enemies' variable",
            "Press ESC",
            "Write 'stop'",
            "Use an if statement"
          ],
          answer: "Change the 'enemies' variable",
          explanation: "To stop a while loop, the condition must eventually become false. That means you MUST update the variable checking the condition.",
        },
        {
          prompt: "How do you increase the `enemies` variable by 1 every time the loop runs?",
          options: [
            "enemies + 1;",
            "enemies++;",
            "enemies = 1;",
            "enemies == 1;"
          ],
          answer: "enemies++;",
          explanation: "enemies++ is a fast way to write 'enemies = enemies + 1'. This ensures the count goes up: 1, 2, 3, 4, 5... and eventually breaks the loop.",
        },
        {
          prompt: "Let's put Group A and Group B's code together. How many enemies actually spawn?",
          code: `// Group A:
int enemies = 0;
while (enemies < 5) {
  spawnEnemy();
  // Group B:
  enemies++;
}`,
          options: ["4", "5", "6", "Infinite"],
          answer: "5",
          explanation: "It runs when enemies is 0, 1, 2, 3, and 4 (five times total). When enemies hits 5, `5 < 5` becomes false, and the loop safely ends.",
        },
      ],
    },
    successMessage: "Loop Labyrinth cleared! Group A built the loop logic, and Group B prevented an infinite crash. Flawless execution.",
  },

  // ── MISSION 4: Functions ──────────────────────────────────────────────────
  {
    id: "functions",
    title: "Function Factory",
    topic: "Functions",
    topicIcon: "⚙️",
    topicColor: "#f59e0b",
    description: "Group A creates a custom function machine to bake a pizza. Group B supplies the ingredients (arguments) to run the machine. Build the pipeline!",
    xpReward: 550,
    groupA: {
      role: "Machine Builders",
      challenge: "Define a function and its parameters",
      questions: [
        {
          prompt: "What is the main reason programmers use functions?",
          options: [
            "To make code run slower",
            "To group reusable code together so you don't repeat yourself",
            "To change the color of the app",
            "To draw graphics on the screen"
          ],
          answer: "To group reusable code together so you don't repeat yourself",
          explanation: "The DRY principle (Don't Repeat Yourself) is key. If you bake pizzas a lot, you build a 'bakePizza()' function rather than typing out the recipe 50 times.",
        },
        {
          prompt: "Let's build a function. We want our function to accept an ingredient. What is the variable inside the parentheses called?",
          code: `void bakePizza(String topping) { ... }`,
          options: ["Return type", "Modifier", "Parameter", "Class"],
          answer: "Parameter",
          explanation: "A parameter (like `String topping`) is an empty slot. It's the machine waiting for someone to drop ingredients in to do its job.",
        },
        {
          prompt: "Inside the function, how do we use that parameter?",
          options: [
            "System.out.println(\"Baking a pizza with \" + topping);",
            "System.out.println(\"Baking a pizza with pepperoni\");",
            "System.out.println(\"Baking a pizza with \" + String);",
            "System.out.println(topping + topping);"
          ],
          answer: "System.out.println(\"Baking a pizza with \" + topping);",
          explanation: "You use the parameter's name (`topping`). You don't hardcode 'pepperoni', because the whole point of the machine is that it works for ANY topping handed to it.",
        },
      ],
    },
    handoffMessage: "Group A built the machine: `void bakePizza(String topping) { print... }`. Group B, the machine is useless unless you call it! Send in the ingredients!",
    groupB: {
      role: "Machine Operators",
      challenge: "Call Group A's function and pass arguments",
      questions: [
        {
          prompt: "Group A gave you the `bakePizza(String topping)` machine. How do you turn it on and order a Mushroom pizza?",
          options: [
            "bakePizza = \"Mushroom\";",
            "String topping = \"Mushroom\";",
            "bakePizza(\"Mushroom\");",
            "call bakePizza;"
          ],
          answer: "bakePizza(\"Mushroom\");",
          explanation: "To run a function, you 'call' it by writing its name followed by parentheses, putting the specific data (the 'argument') inside the parentheses.",
        },
        {
          prompt: "What happens if you run this line of code using Group A's machine?",
          code: `bakePizza(100);`,
          options: [
            "It prints 'Baking a pizza with 100'",
            "It causes an ERROR (type mismatch)",
            "It bakes 100 pizzas",
            "It skips the line"
          ],
          answer: "It causes an ERROR (type mismatch)",
          explanation: "Group A strictly designed the parameter as a `String`. If you try to pass an integer `100`, Java throws a type error. Machines only accept what they were built for!",
        },
        {
          prompt: "What is the output of this final sequence?",
          code: `// Group B calling Group A's machine
bakePizza("Cheese");
bakePizza("Pepperoni");`,
          options: [
             "Baking a pizza with Cheese (and nothing else)",
             "Baking a pizza with Pepperoni (and nothing else)",
             "Baking a pizza with Cheese\nBaking a pizza with Pepperoni",
             "Error"
          ],
          answer: "Baking a pizza with Cheese\nBaking a pizza with Pepperoni",
          explanation: "Because Group A built a reusable machine, Group B can call it as many times as they want with different data. The code inside runs twice!",
        },
      ],
    },
    successMessage: "Function Factory running! Group A built the logic, Group B executed it. That's how massive codebases at Google are organized.",
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
    handoffMessage: "Group A fixed the syntax errors. Now the code runs, but it's giving the wrong answers! Group B, hunt down the logic bugs!",
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
    handoffMessage: "Group A laid out the steps of the algorithm. Group B, it's your turn to trace those steps and predict the outcome!",
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

  // Local team results (synced with Firebase)
  const [groupAResult, setGroupAResult] = useState<TeamResult>(freshTeam());
  const [groupBResult, setGroupBResult] = useState<TeamResult>(freshTeam());

  const [showFinalEnd, setShowFinalEnd] = useState(false);
  const [showXpBurst, setShowXpBurst] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  const mission = selectedMission;

  // ── Firebase Sync ────────────────────────────────────────────────────────
  useEffect(() => {
    const roomRef = doc(db, "sprint_rooms", "default");
    const unsub = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.selectedMissionId) {
          const m = MISSIONS.find(m => m.id === data.selectedMissionId);
          if (m) setSelectedMission(m);
        } else {
          setSelectedMission(null);
        }
        if (data.groupAResult) setGroupAResult(data.groupAResult);
        if (data.groupBResult) setGroupBResult(data.groupBResult);
      }
    });
    return () => unsub();
  }, []);

  const selectMissionInDb = async (m: SprintMission) => {
    const roomRef = doc(db, "sprint_rooms", "default");
    await setDoc(roomRef, {
      selectedMissionId: m.id,
      groupAResult: freshTeam(),
      groupBResult: freshTeam()
    });
  };

  // ── Quiz completion handlers ──────────────────────────────────────────────
  const handleGroupAComplete = async (correct: number, total: number) => {
    if (!mission) return;
    const pts = Math.round((correct / total) * mission.xpReward * 0.5);
    addXp(pts);
    setXpAmount(pts);
    setShowXpBurst(true);
    const result = { questionsAnswered: total, questionsCorrect: correct, points: pts, completed: true };
    setGroupAResult(result);
    // sync to Firebase
    const roomRef = doc(db, "sprint_rooms", "default");
    await updateDoc(roomRef, { groupAResult: result });
  };

  const handleGroupBComplete = async (correct: number, total: number) => {
    if (!mission) return;
    const pts = Math.round((correct / total) * mission.xpReward * 0.5);
    addXp(pts);
    setXpAmount(pts);
    setShowXpBurst(true);
    const result = { questionsAnswered: total, questionsCorrect: correct, points: pts, completed: true };
    setGroupBResult(result);
    // sync to Firebase
    const roomRef = doc(db, "sprint_rooms", "default");
    await updateDoc(roomRef, { groupBResult: result });
  };

  // Auto-show final when both done
  useEffect(() => {
    if (groupAResult.completed && groupBResult.completed && !showFinalEnd) {
      const t = setTimeout(() => setShowFinalEnd(true), 600);
      return () => clearTimeout(t);
    }
  }, [groupAResult.completed, groupBResult.completed, showFinalEnd]);

  const handlePlayAgain = async () => {
    setTeam(null);
    setShowFinalEnd(false);
    const roomRef = doc(db, "sprint_rooms", "default");
    await setDoc(roomRef, {
      groupAResult: freshTeam(),
      groupBResult: freshTeam()
    }, { merge: true });
  };

  const handleNewMission = async () => {
    setTeam(null);
    setShowFinalEnd(false);
    const roomRef = doc(db, "sprint_rooms", "default");
    await setDoc(roomRef, {
      selectedMissionId: null,
      groupAResult: freshTeam(),
      groupBResult: freshTeam()
    }, { merge: true });
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
              onClick={() => selectMissionInDb(m)}
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
          onClick={handleNewMission}
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

        {/* Status footer & Handoff Banner */}
        <div style={{
          marginTop: "1.5rem", padding: "1.5rem",
          background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", gap: "1rem"
        }}>
          {/* Handoff Message (Shown only when A is done and B hasn't finished) */}
          <AnimatePresence>
            {groupAResult.completed && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                style={{
                   background: "linear-gradient(to right, rgba(99,102,241,0.1), rgba(59,130,246,0.1))",
                   borderLeft: "4px solid #6366f1",
                   padding: "1.25rem",
                   borderRadius: "var(--radius-sm)",
                   marginBottom: "0.5rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#818cf8", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                  <Zap size={16} /> Baton Pass
                </div>
                <div style={{ color: "var(--text-primary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {mission.handoffMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <Flame size={13} color="#f59e0b" />
              <span>Group A acts as the foundation — Group B inherits their work.</span>
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
        </div>
      </motion.div>
    </>
  );
}