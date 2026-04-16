import { SprintMission } from "./types";

export const MISSIONS: SprintMission[] = [
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
          explanation: "A parameter (like \`String topping\`) is an empty slot. It's the machine waiting for someone to drop ingredients in to do its job.",
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
          explanation: "You use the parameter's name (\`topping\`). You don't hardcode 'pepperoni', because the whole point of the machine is that it works for ANY topping handed to it.",
        },
      ],
    },
    handoffMessage: "Group A built the machine: \`void bakePizza(String topping) { print... }\`. Group B, the machine is useless unless you call it! Send in the ingredients!",
    groupB: {
      role: "Machine Operators",
      challenge: "Call Group A's function and pass arguments",
      questions: [
        {
          prompt: "Group A gave you the \`bakePizza(String topping)\` machine. How do you turn it on and order a Mushroom pizza?",
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
          explanation: "Group A strictly designed the parameter as a \`String\`. If you try to pass an integer \`100\`, Java throws a type error. Machines only accept what they were built for!",
        },
        {
          prompt: "What is the output of this final sequence?",
          code: `// Group B calling Group A's machine
bakePizza("Cheese");
bakePizza("Pepperoni");`,
          options: [
             "Baking a pizza with Cheese (and nothing else)",
             "Baking a pizza with Pepperoni (and nothing else)",
             "Baking a pizza with Cheese\\nBaking a pizza with Pepperoni",
             "Error"
          ],
          answer: "Baking a pizza with Cheese\\nBaking a pizza with Pepperoni",
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
