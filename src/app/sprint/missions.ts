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
          prompt: "What is the best way to name a variable storing a game score?",
          options: ["Score!", "game score", "score", "1score"],
          answer: "score",
          explanation: "Variable names in Python should be single words (or use underscores like 'game_score'), and cannot start with numbers or have spaces.",
        },
        {
          prompt: "Write the Python code to create the score variable and set it to zero for the start of the game.",
          code: `# Set up the start of the game`,
          options: [
            "int score = 0;",
            "score = 0",
            "set score = 0",
            "score == 0",
          ],
          answer: "score = 0",
          explanation: "In Python, you just type the name and set it equal to its value. No 'int' or semicolons needed!",
        },
      ],
    },
    handoffMessage: "Group A successfully created: `score = 0`. Group B, you must use this variable to give the player points!",
    groupB: {
      role: "Gameplay Engineers",
      challenge: "Update the score variable Group A created",
      questions: [
        {
          prompt: "Group A handed you the 'score' variable. The player just grabbed a coin! How do you add 10 points to their score in Python?",
          code: `# Group A code:
score = 0
# Your code:`,
          options: [
            "int score = 10",
            "score = score + 10",
            "score = 10",
            "score + 10"
          ],
          answer: "score = score + 10",
          explanation: "To update it, we calculate 'score + 10' and save it back into the 'score' box using the equals sign.",
        },
        {
          prompt: "Now the player grabbed a rare gem worth 50 points! Update the score again.",
          code: `# Group A code: score = 0
# Your previous code: score = score + 10
# What is the NEW score if you add 50?`,
          options: ["50", "60", "0", "1050"],
          answer: "60",
          explanation: "Variables remember things! The score was 10. Adding 50 makes it 60.",
        },
        {
          prompt: "Game over! How do you print the final score to the screen for the player to see?",
          options: [
            "System.out.println(score)",
            "print('score')",
            "print score",
            "print(score)"
          ],
          answer: "print(score)",
          explanation: "Use Python's print() function! No quotes around score means it prints the NUMBER inside, not the word.",
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
    description: "Group A sets the entry criteria using 'if' statements. Group B wires up what happens next. Make the right choice!",
    xpReward: 450,
    groupA: {
      role: "Gatekeepers",
      challenge: "Write the boolean condition for a VIP club",
      questions: [
        {
          prompt: "We are programming a VIP club. People must be 18 or older to enter. Which operator means 'greater than or equal to'?",
          options: [">=", "=>", "==", ">"],
          answer: ">=",
          explanation: "In Python, >= checks if the left side is bigger than or exactly the same as the right side.",
        },
        {
          prompt: "Write the Python if statement that checks if 'age' is 18 or older.",
          options: [
            "if age > 18:",
            "if age == 18:",
            "if age >= 18:",
            "if (age >= 18)"
          ],
          answer: "if age >= 18:",
          explanation: "Python 'if' statements always end with a colon (:).",
        },
        {
          prompt: "Wait! We also need them to have a VIP pass. Which keyword means 'AND' to combine conditions?",
          options: ["plus", "and", "&&", "also"],
          answer: "and",
          explanation: "In Python, you simply write the word 'and' to ensure both things are true. `if age >= 18 and has_pass:`",
        },
      ],
    },
    handoffMessage: "Group A built the condition: `if age >= 18 and has_pass:`. Group B, use this check to let them into the club or reject them!",
    groupB: {
      role: "Consequence Coders",
      challenge: "Write the action blocks for Group A's condition",
      questions: [
        {
          prompt: "Group A gave you the check. If the condition is TRUE, print 'Welcome VIP!'. How do you write this inside the block?",
          code: `# Group A:
if age >= 18 and has_pass:
# Your action:`,
          options: [
            "{ print(\"Welcome VIP!\") }",
            "( print(\"Welcome VIP!\") )",
            "    print(\"Welcome VIP!\")",
            "print(\"Welcome VIP!\")"
          ],
          answer: "    print(\"Welcome VIP!\")",
          explanation: "INDENTATION is everything in Python! The 4 spaces mean this code belongs inside the 'if' statement.",
        },
        {
          prompt: "What if the condition is FALSE? Which keyword acts as the backup plan?",
          options: ["otherwise:", "elif:", "else:", "catch()"],
          answer: "else:",
          explanation: "The 'else:' block catches everything that fails the 'if'.",
        },
        {
          prompt: "What happens if a 19-year-old shows up but DOES NOT have a pass (has_pass is False)?",
          code: `if age >= 18 and has_pass:
    print("Welcome VIP!")
else:
    print("Go home.")`,
          options: ["Welcome VIP!", "Go home.", "Error", "Nothing prints"],
          answer: "Go home.",
          explanation: "Because 'and' requires BOTH to be True, the lack of a VIP pass makes it False, triggering the else block.",
        },
      ],
    },
    successMessage: "Decision Dome complete! Seamless logic pipeline!",
  },

  // ── MISSION 3: Loops ──────────────────────────────────────────────────────
  {
    id: "loops",
    title: "Loop Labyrinth",
    topic: "Loops",
    topicIcon: "🔁",
    topicColor: "#10b981",
    description: "Group A sets up a 'while' loop. Group B is trapped inside and must escape!",
    xpReward: 500,
    groupA: {
      role: "Loop Starters",
      challenge: "Set up the condition that makes a loop run",
      questions: [
        {
          prompt: "A 'while' loop keeps repeating AS LONG AS... what?",
          options: [
            "The program is open",
            "Its condition remains True",
            "It runs exactly 10 times",
            "The user presses Enter"
          ],
          answer: "Its condition remains True",
          explanation: "A while loop is just an 'if' statement that repeats.",
        },
        {
          prompt: "We want an enemy spawner to run while we have fewer than 5 enemies. How do we start this in Python?",
          options: [
            "while enemies < 5:",
            "while (enemies < 5) {",
            "loop enemies < 5:",
            "for enemies in 5:"
          ],
          answer: "while enemies < 5:",
          explanation: "Use the 'while' keyword, the condition, and always end with a colon (:).",
        },
        {
          prompt: "What happens if Group B never writes the code to increase the 'enemies' count?",
          options: [
            "Game crashes instantly",
            "It stops by itself",
            "Infinite loop freezes the game",
            "It skips the loop"
          ],
          answer: "Infinite loop freezes the game",
          explanation: "If the condition stays True forever, the computer will span enemies forever and crash!",
        },
      ],
    },
    handoffMessage: "Group A wrote: `enemies = 0` and `while enemies < 5:`. Group B, you are trapped! Write the escape code!",
    groupB: {
      role: "Loop Breakers",
      challenge: "Update the loop variable to prevent a crash",
      questions: [
        {
          prompt: "You are stuck! You must eventually break out. What must you do inside the loop?",
          options: [
            "Change the 'enemies' variable",
            "Press ESC",
            "Write 'stop'",
            "Use an if statement"
          ],
          answer: "Change the 'enemies' variable",
          explanation: "To stop a while loop, the condition must eventually become False.",
        },
        {
          prompt: "How do you increase the `enemies` variable by 1 in Python?",
          options: [
            "enemies + 1",
            "enemies++",
            "enemies += 1",
            "enemies == 1"
          ],
          answer: "enemies += 1",
          explanation: "enemies += 1 is the Python shortcut for enemies = enemies + 1.",
        },
        {
          prompt: "How many enemies actually spawn?",
          code: `# Group A:
enemies = 0
while enemies < 5:
    spawn_enemy()
    # Group B:
    enemies += 1`,
          options: ["4", "5", "6", "Infinite"],
          answer: "5",
          explanation: "It runs when enemies is 0, 1, 2, 3, and 4. When it hits 5, the loop ends safely.",
        },
      ],
    },
    successMessage: "Loop Labyrinth cleared! Flawless execution.",
  },

  // ── MISSION 4: Functions ──────────────────────────────────────────────────
  {
    id: "functions",
    title: "Function Factory",
    topic: "Functions",
    topicIcon: "⚙️",
    topicColor: "#f59e0b",
    description: "Group A builds a machine to bake pizzas. Group B sends ingredients into the machine.",
    xpReward: 550,
    groupA: {
      role: "Machine Builders",
      challenge: "Define a function in Python",
      questions: [
        {
          prompt: "What keyword defines a function in Python?",
          options: ["function", "def", "create", "void"],
          answer: "def",
          explanation: "Python uses 'def' (short for define) to create a reusable function.",
        },
        {
          prompt: "We want our function to accept an ingredient. What goes in the parentheses?",
          code: `def bake_pizza( _______ ):`,
          options: ["def", "print", "topping", "true"],
          answer: "topping",
          explanation: "This is a parameter — an empty slot waiting for an ingredient.",
        },
        {
          prompt: "Inside the function, how do we use that parameter?",
          options: [
            "print('Baking... ' + topping)",
            "print('Baking... pepperoni')",
            "print('Baking... ' + 'topping')",
            "print(topping + topping)"
          ],
          answer: "print('Baking... ' + topping)",
          explanation: "Use the variable exactly as it's named without quotes around it.",
        },
      ],
    },
    handoffMessage: "Group A built the machine: `def bake_pizza(topping):`. Group B, the machine is useless unless you call it!",
    groupB: {
      role: "Machine Operators",
      challenge: "Call the function and use arguments",
      questions: [
        {
          prompt: "How do you run the `bake_pizza` function to request 'Mushroom'?",
          options: [
            "bake_pizza = 'Mushroom'",
            "topping = 'Mushroom'",
            "bake_pizza('Mushroom')",
            "call bake_pizza"
          ],
          answer: "bake_pizza('Mushroom')",
          explanation: "To run it, 'call' it by writing its name followed by the data inside parentheses.",
        },
        {
          prompt: "What happens if you ask for \"Cheese\" and then \"Pepperoni\"?",
          code: `bake_pizza("Cheese")
bake_pizza("Pepperoni")`,
          options: [
             "Bakes Cheese only",
             "Bakes Pepperoni only",
             "Bakes Cheese, then Pepperoni",
             "Error"
          ],
          answer: "Bakes Cheese, then Pepperoni",
          explanation: "Reusable machines can be called as many times as you want!",
        },
        {
          prompt: "What must you remember about indentation when calling a function?",
          options: [
            "It must be indented 4 spaces",
            "It needs curly braces",
            "It must *not* be indented so Python knows it is outside the function definition",
            "Indentation doesn't matter"
          ],
          answer: "It must *not* be indented so Python knows it is outside the function definition",
          explanation: "Calling a function happens outside the 'def' block, so it goes back to the left edge.",
        },
      ],
    },
    successMessage: "Function Factory running! That's how big codebases stay organized.",
  },

  // ── MISSION 5: Debugging ──────────────────────────────────────────────────
  {
    id: "debugging",
    title: "Bug Bounty",
    topic: "Debugging",
    topicIcon: "🐛",
    topicColor: "#ef4444",
    description: "Group A hunts syntax errors. Group B tracks logic bugs. Time to debug!",
    xpReward: 500,
    groupA: {
      role: "Syntax Detectives",
      challenge: "Spot errors that break Python",
      questions: [
        {
          prompt: "This code won't run. What's the error?",
          code: `if score > 10
    print("Winner!")`,
          options: [
            "Missing parentheses",
            "Missing colon after the if condition",
            "print is spelled wrong",
            "score needs quotes",
          ],
          answer: "Missing colon after the if condition",
          explanation: "Every if statement, loop, or function in Python must end with a colon (:).",
        },
        {
          prompt: "What is wrong with the indentation here?",
          code: `def say_hello():
print("Hi there!")`,
          options: [
            "Nothing is wrong",
            "The print statement must be indented 4 spaces because it belongs to the function",
            "def should be capitalized",
            "say_hello shouldn't have parentheses",
          ],
          answer: "The print statement must be indented 4 spaces because it belongs to the function",
          explanation: "If you don't indent, Python thinks the function is completely empty and will crash.",
        },
        {
          prompt: "Which tool is most useful for finding a syntax error?",
          options: [
            "Guessing",
            "Python's error messages (they point to the line number)",
            "Deleting everything",
            "Closing the app",
          ],
          answer: "Python's error messages (they point to the line number)",
          explanation: "The compiler will literally tell you 'SyntaxError: invalid syntax' and point to exactly where the colon or parenthesis is missing.",
        },
      ],
    },
    handoffMessage: "Syntax fixed! But it's giving wrong answers! Group B, fix the logic!",
    groupB: {
      role: "Logic Hunters",
      challenge: "Find bugs that give wrong answers",
      questions: [
        {
          prompt: "This should average 3 numbers. What's mathematically wrong?",
          code: `a = 80
b = 90
c = 70
average = a + b + c / 3
print(average)`,
          options: [
            "Division happens before addition — needs parentheses: (a+b+c)/3",
            "Variables are wrong",
            "Can't average in Python",
            "It's correct",
          ],
          answer: "Division happens before addition — needs parentheses: (a+b+c)/3",
          explanation: "Order of operations! Python divides c/3 first. Use parentheses () to force addition first.",
        },
        {
          prompt: "The code runs but prints the wrong thing. Why?",
          code: `# Kids under 12 eat free
age = 12
if age < 12:
    print("Free meal")
else:
    print("Pay up")`,
          options: [
            "Syntax error",
            "Logic error: A 12-year-old should pay, but wait, 'under 12' means < 12 strictly.",
            "Logic error: age < 12 shouldn't be used",
            "Nothing is wrong — but if you wanted 12-year-olds to eat free, it should be <="
          ],
          answer: "Nothing is wrong — but if you wanted 12-year-olds to eat free, it should be <=",
          explanation: "If the rules say \"12 and under\", < 12 is a logic error. It should be age <= 12.",
        },
        {
          prompt: "Fastest way to trace a logic bug?",
          options: [
            "Delete code",
            "Add print statements inside the code to see what the variables are doing",
            "Wait for an update",
            "Nothing",
          ],
          answer: "Add print statements inside the code to see what the variables are doing",
          explanation: "Professional coders use 'print-debugging' every day to trace exactly what value is inside a variable right before it breaks.",
        },
      ],
    },
    successMessage: "Bugs squashed! Finding bugs is a superpower.",
  },

  // ── MISSION 6: Algorithms & Problem Solving ───────────────────────────────
  {
    id: "algorithms",
    title: "Algorithm Academy",
    topic: "Algorithms",
    topicIcon: "🗺️",
    topicColor: "#06b6d4",
    description: "Group A breaks down problems step by step. Group B traces through to find answers.",
    xpReward: 550,
    groupA: {
      role: "Step Writers",
      challenge: "Write clear algorithms",
      questions: [
        {
          prompt: "An algorithm is just a step-by-step set of instructions. Which is the BEST algorithm for writing a computer program?",
          options: [
            "Make code, done",
            "1. Plan logic 2. Write code 3. Test code 4. Fix bugs",
            "Type super fast",
            "Look at screen",
          ],
          answer: "1. Plan logic 2. Write code 3. Test code 4. Fix bugs",
          explanation: "Algorithms must be explicit, ordered, and structured.",
        },
        {
          prompt: "Why does the sequence of an algorithm matter?",
          options: [
            "It doesn't",
            "The computer executes lines strictly from top to bottom",
            "Because algorithms are long",
            "You can execute backwards",
          ],
          answer: "The computer executes lines strictly from top to bottom",
          explanation: "You can't eat a sandwich before you make it. The order of instructions handles how the state of your application changes.",
        },
        {
          prompt: "This algorithm finds the biggest number in a list. What's the key step?",
          code: `biggest = 0
for number in list:
    if number > biggest:
        biggest = number`,
          options: [
            "biggest = 0",
            "if number > biggest",
            "biggest = number",
            "Both checking the condition and updating the biggest variable"
          ],
          answer: "Both checking the condition and updating the biggest variable",
          explanation: "This allows the program to constantly compare and 'save' the best result so far.",
        },
      ],
    },
    groupB: {
      role: "Algorithm Tracers",
      challenge: "Follow steps manually and predict",
      questions: [
        {
          prompt: "Trace this loop. What is the final total?",
          code: `total = 0
numbers = [5, 10, 3]

for number in numbers:
    total = total + number`,
          options: ["5", "15", "18", "0"],
          answer: "18",
          explanation: "0+5 = 5. Then 5+10 = 15. Then 15+3 = 18.",
        },
        {
          prompt: "How many steps to find 'Carlos' linearly?",
          code: `names = ["Alice", "Bob", "Carlos", "Diana"]`,
          options: ["1", "2", "3", "4"],
          answer: "3",
          explanation: "Linear search checks item 1, then item 2, then item 3...",
        },
        {
          prompt: "What does decomposition mean?",
          options: [
            "Breaking large problems into smaller chunks",
            "Deleting old code",
            "Letting code rot over time",
            "Combining small apps into huge ones",
          ],
          answer: "Breaking large problems into smaller chunks",
          explanation: "It's how we build big games: break it up into movement, drawing, scoring, AI, etc.",
        },
      ],
    },
    handoffMessage: "Group A laid out the logic. Group B traced it. Nice execution!",
    successMessage: "Algorithm Academy complete! The heart of computer science.",
  },
];

