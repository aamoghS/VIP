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
    question: "Think of a variable as a labeled box where you can put things. In Python, how do we create a variable named 'score' and put the number 10 inside it?",
    options: ["score = 10", "make score 10", "10 = score", "var score == 10"],
    currentAnswer: "score = 10",
    reasoning: "In Python, we use the equals sign (=) to put the value on the right (10) into the variable name on the left (score). So, score = 10 means 'put 10 into the box named score'.",
  },
  {
    id: 2,
    topic: "variables",
    type: "multiple-choice",
    question: "What will this Python code do?\n\nname = \"Alex\"\nprint(name)",
    options: ["Print the word name", "Print the word Alex", "Crash the program", "Print nothing"],
    currentAnswer: "Print the word Alex",
    reasoning: "First, we put \"Alex\" in the box called 'name'. Then, print(name) looks inside the box, sees \"Alex\", and shows it on the screen.",
  },
  {
    id: 3,
    topic: "variables",
    type: "multiple-choice",
    question: "We can change what's inside a variable box! What will print here?\n\ncoins = 5\ncoins = 10\nprint(coins)",
    options: ["5", "10", "15", "Error"],
    currentAnswer: "10",
    reasoning: "First, the box 'coins' holds 5. But then we put 10 in it, replacing the 5. So it prints 10. The box only remembers the most recent thing put inside!",
  },
  {
    id: 4,
    topic: "variables",
    type: "multiple-choice",
    question: "In Python, text is called a 'String'. How must we write a String?",
    options: ["Inside numbers", "Without any quotes", "Inside quotes, like \"Hello\"", "Inside brackets, like [Hello]"],
    currentAnswer: "Inside quotes, like \"Hello\"",
    reasoning: "Python needs quotes (like \"Hello\" or 'Hello') to know it's a String (text). Without quotes, Python thinks Hello is a variable name and gets confused!",
  },
  {
    id: 5,
    topic: "variables",
    type: "multiple-choice",
    question: "What is the best way to name a variable that holds a player's score?",
    options: ["s", "player_score", "Thing1", "1score"],
    currentAnswer: "player_score",
    reasoning: "Variable names should be clear and easy to understand. 'player_score' tells everyone exactly what's inside! Python likes words separated by an underscore (_), which is called snake_case.",
  },
  {
    id: 6,
    topic: "variables",
    type: "multiple-choice",
    question: "What happens when we add text in Python using '+'?\n\nword1 = \"Cat\"\nword2 = \"Dog\"\nprint(word1 + word2)",
    options: ["CatDog", "Cat Dog", "Error", "7"],
    currentAnswer: "CatDog",
    reasoning: "Using '+' connects Strings (text) together like glue. It doesn't add spaces automatically, so \"Cat\" + \"Dog\" becomes \"CatDog\".",
  },
  {
    id: 7,
    topic: "variables",
    type: "multiple-choice",
    question: "Which of these variables is holding a whole number (integer), rather than text?",
    options: ["age = \"12\"", "age = 12.5", "age = 12", "age = 'twelve'"],
    currentAnswer: "age = 12",
    reasoning: "Numbers without quotes are real numbers in Python. \"12\" is text. 12.5 has a decimal. 12 is a whole number (an integer)!",
  },

  // ── Conditionals (Logic) ──────────────────────────────────────────────────
  {
    id: 8,
    topic: "logic",
    type: "multiple-choice",
    question: "An 'if' statement is like asking a Yes/No question. \n\nis_raining = True\nif is_raining:\n    print(\"Grab an umbrella!\")\n\nWhat happens here?",
    options: ["Nothing happens", "It prints \"Grab an umbrella!\"", "It prints \"is_raining\"", "Error"],
    currentAnswer: "It prints \"Grab an umbrella!\"",
    reasoning: "The condition 'is_raining' is True (Yes!), so the code inside the 'if' block runs. If it were False, it would skip it entirely.",
  },
  {
    id: 9,
    topic: "logic",
    type: "multiple-choice",
    question: "What does 'else' mean in Python?",
    options: ["Do this no matter what", "Do this instead if the first condition was False", "Stop the code", "Check another specific condition"],
    currentAnswer: "Do this instead if the first condition was False",
    reasoning: "'if' says \"if this is true, do X\". 'else' says \"otherwise, if it was false, do Y\". It's a fallback plan!",
  },
  {
    id: 10,
    topic: "logic",
    type: "multiple-choice",
    question: "If we have score = 50, what will print?\n\nif score > 100:\n    print(\"You Win!\")\nelse:\n    print(\"Keep Trying!\")",
    options: ["You Win!", "Keep Trying!", "Both", "Nothing"],
    currentAnswer: "Keep Trying!",
    reasoning: "Because 50 is not greater than 100, the 'if' part is skipped, and the 'else' part takes over and prints \"Keep Trying!\"",
  },
  {
    id: 11,
    topic: "logic",
    type: "multiple-choice",
    question: "'elif' stands for 'else if'. It lets us check a second question. If age = 10, what prints?\n\nif age > 18:\n    print(\"Adult\")\nelif age >= 10:\n    print(\"Teen or Tween\")\nelse:\n    print(\"Kid\")",
    options: ["Adult", "Teen or Tween", "Kid", "Nothing"],
    currentAnswer: "Teen or Tween",
    reasoning: "Since age is 10, 'age > 18' is False. So it checks the 'elif'. 'age >= 10' is True (10 is equal to 10)! So it prints \"Teen or Tween\" and skips the rest.",
  },
  {
    id: 12,
    topic: "logic",
    type: "multiple-choice",
    question: "How do we ask if two things are exactly equal in Python?",
    options: ["color = \"red\"", "color == \"red\"", "color > \"red\"", "color =+ \"red\""],
    currentAnswer: "color == \"red\"",
    reasoning: "A single equals (=) PUTS a value in a box. A double equals (==) ASKS \"are these the same?\". It's asking a question, not doing a chore.",
  },
  {
    id: 13,
    topic: "logic",
    type: "multiple-choice",
    question: "What does this code do? \n\nif age > 8 and height > 50:\n    print(\"You can ride the rollercoaster!\")",
    options: ["You only need age > 8", "You only need height > 50", "BOTH must be true to ride", "NEITHER needs to be true"],
    currentAnswer: "BOTH must be true to ride",
    reasoning: "The word 'and' in Python means both sides must be true. If either one is false, the whole thing is false, and you can't ride.",
  },

  // ── Loops ─────────────────────────────────────────────────────────────────
  {
    id: 14,
    topic: "loops",
    type: "multiple-choice",
    question: "Loops are for repeating things! What will this 'for' loop do?\n\nfor i in range(3):\n    print(\"Jump!\")",
    options: ["Print \"Jump!\" 1 time", "Print \"Jump!\" 3 times", "Print \"Jump!\" forever", "Print \"3\""],
    currentAnswer: "Print \"Jump!\" 3 times",
    reasoning: "range(3) tells Python to repeat the action 3 times. It's a quick way to do something over and over without writing `print` three separate times.",
  },
  {
    id: 15,
    topic: "loops",
    type: "multiple-choice",
    question: "Python counts starting from zero! What will this print?\n\nfor i in range(3):\n    print(i)",
    options: ["1, 2, 3", "0, 1, 2", "3, 3, 3", "0, 1, 2, 3"],
    currentAnswer: "0, 1, 2",
    reasoning: "Computer programs almost always start counting at 0. So range(3) gives us three numbers: 0, then 1, and finally 2.",
  },
  {
    id: 16,
    topic: "loops",
    type: "multiple-choice",
    question: "A 'while' loop keeps going AS LONG AS something is true. Which loop will run forever (an infinite loop)?",
    options: ["while False:", "for i in range(10):", "while True:", "while score == 0:"],
    currentAnswer: "while True:",
    reasoning: "'while True' means \"keep doing this as long as True is True!\" Since True is always True, it never stops. You have to force it to stop!",
  },
  {
    id: 17,
    topic: "loops",
    type: "multiple-choice",
    question: "We have 3 lives in a game. What does this loop do?\n\nlives = 3\nwhile lives > 0:\n    print(\"Playing!\")\n    lives = lives - 1",
    options: ["Prints Playing forever", "Prints Playing 3 times", "Prints Playing 0 times", "Error"],
    currentAnswer: "Prints Playing 3 times",
    reasoning: "lives starts at 3. Each loop, we subtract 1. So it plays when lives=3, lives=2, and lives=1. When lives becomes 0, 0 > 0 is false, so the loop stops.",
  },
  {
    id: 18,
    topic: "loops",
    type: "multiple-choice",
    question: "What is a 'list' in Python, which we often loop through?",
    options: ["A single number", "A way to skip code", "A collection of items stored in brackets, like [\"apple\", \"banana\"]", "A math problem"],
    currentAnswer: "A collection of items stored in brackets, like [\"apple\", \"banana\"]",
    reasoning: "A list is a great way to store many items in one variable. We use square brackets []. You can loop over a list to look at each item inside!",
  },
  {
    id: 19,
    topic: "loops",
    type: "multiple-choice",
    question: "We can loop through a list! What will this do?\n\nfruits = [\"apple\", \"pear\"]\nfor f in fruits:\n    print(f)",
    options: ["Print \"fruits\"", "Print \"apple\" then \"pear\"", "Print \"f\" twice", "Error"],
    currentAnswer: "Print \"apple\" then \"pear\"",
    reasoning: "This goes through the list 'fruits' one item at a time. First 'f' becomes \"apple\" and prints. Then 'f' becomes \"pear\" and prints.",
  },

  // ── Functions ─────────────────────────────────────────────────────────────
  {
    id: 20,
    topic: "functions",
    type: "multiple-choice",
    question: "A function is like a recipe we can use whenever we want. How do we start making (defining) a function in Python?",
    options: ["make function:", "def function_name():", "start function_name():", "cook function_name():"],
    currentAnswer: "def function_name():",
    reasoning: "We use 'def' which stands for 'define'. It tells Python \"I am defining a new recipe (function) right now, here is its name.\"",
  },
  {
    id: 21,
    topic: "functions",
    type: "multiple-choice",
    question: "We defined a function to say hello. But it's not printing! Why?\n\ndef say_hi():\n    print(\"Hi!!!\")",
    options: ["print is spelled wrong", "Python is broken", "We need to CALL the function by writing say_hi() below it", "We must use uppercase"],
    currentAnswer: "We need to CALL the function by writing say_hi() below it",
    reasoning: "Defining a recipe doesn't mean you made the food! You have to 'call' the function for the code inside to actually run.",
  },
  {
    id: 22,
    topic: "functions",
    type: "multiple-choice",
    question: "Functions can take ingredients (inputs called parameters)! What happens here?\n\ndef double_number(num):\n    print(num * 2)\n\ndouble_number(5)",
    options: ["Prints num * 2", "Prints 5", "Prints 10", "Error"],
    currentAnswer: "Prints 10",
    reasoning: "We give 5 to the function as the 'num'. Inside the function, it does 5 * 2, which is 10, and prints it.",
  },
  {
    id: 23,
    topic: "functions",
    type: "multiple-choice",
    question: "Sometimes a function hands a value BACK to us instead of printing it. What word do we use for that?",
    options: ["give", "return", "back", "print"],
    currentAnswer: "return",
    reasoning: "We use 'return' to send the final answer back. For example: return num * 2. This lets us save the answer in a variable to use later!",
  },
  {
    id: 24,
    topic: "functions",
    type: "multiple-choice",
    question: "Look at this code:\n\ndef get_winner():\n    return \"Mario\"\n\nname = get_winner()\nprint(name)",
    options: ["Prints name", "Prints get_winner", "Prints Mario", "Error"],
    currentAnswer: "Prints Mario",
    reasoning: "get_winner() hands back \"Mario\". So it's exactly like typing: name = \"Mario\". Then we print name, which shows \"Mario\".",
  },
  {
    id: 25,
    topic: "functions",
    type: "multiple-choice",
    question: "Why are functions super helpful in programming?",
    options: ["They make code run slower", "They let us reuse the same code without writing it over and over", "They let us use fewer variables", "They look cool"],
    currentAnswer: "They let us reuse the same code without writing it over and over",
    reasoning: "Functions save us typing! If you have a block of code you need 10 times, you just wrap it in a function and call it 10 times. It keeps code neat.",
  },

  // ── Debugging ─────────────────────────────────────────────────────────────
  {
    id: 26,
    topic: "debugging",
    type: "multiple-choice",
    question: "What is a 'bug' in computer programming?",
    options: ["A tiny literal insect inside the computer", "A mistake or error in the code that makes it crash or act weird", "A virus", "A difficult math problem"],
    currentAnswer: "A mistake or error in the code that makes it crash or act weird",
    reasoning: "A bug is just a mistake we made while coding. 'Debugging' is the process of putting on our detective hats and fixing those mistakes!",
  },
  {
    id: 27,
    topic: "debugging",
    type: "multiple-choice",
    question: "Python needs proper spacing (indentation) to know what code is inside an 'if' block. Which one has a bug?",
    options: ["if True:\n    print(\"Yay!\")", "if True:\nprint(\"Yay!\")", "if False:\n    pass", "if True:\n    x = 1"],
    currentAnswer: "if True:\nprint(\"Yay!\")",
    reasoning: "Python uses spaces (an indent) to know what belongs inside an 'if' or 'for' loop. Because 'print' isn't indented in the second option, Python gives an IndentationError.",
  },
  {
    id: 28,
    topic: "debugging",
    type: "multiple-choice",
    question: "Oh no, there is an error: NameError: name 'scoore' is not defined. What probably happened?",
    options: ["We forgot to install Python", "We added numbers wrong", "We misspelled a variable name like 'score' as 'scoore'", "The computer broke"],
    currentAnswer: "We misspelled a variable name like 'score' as 'scoore'",
    reasoning: "A NameError almost always means you typed the name of a variable, but Python has never seen it before. It is usually a simple typo!",
  },
  {
    id: 29,
    topic: "debugging",
    type: "multiple-choice",
    question: "My game calculates score = 10 + 5, but I wanted it to be 10 minus 5. The program doesn't crash, but the score is wrong. What kind of bug is this?",
    options: ["Indentation Error", "Syntax Error", "Logic Bug (Code runs, but does the wrong math)", "Speed Bug"],
    currentAnswer: "Logic Bug (Code runs, but does the wrong math)",
    reasoning: "A logic bug is when the code is perfectly fine Python, but we gave the computer the wrong instructions. The computer did exactly what we said, but what we said was wrong!",
  },
  {
    id: 30,
    topic: "debugging",
    type: "multiple-choice",
    question: "What is the best super-power tool we have to figure out what values variables hold while our code is running?",
    options: ["Closing the laptop", "Using the print() command to print out variables and see what's inside them", "Deleting everything", "Using a bigger font"],
    currentAnswer: "Using the print() command to print out variables and see what's inside them",
    reasoning: "Using print() helps you peek inside your program! By printing a variable before and after it changes, you can easily spot where the math went wrong.",
  },

  // ── Algorithms ────────────────────────────────────────────────────────────
  {
    id: 31,
    topic: "algorithms",
    type: "multiple-choice",
    question: "An algorithm is just a list of steps to solve a problem. Which of these is a great algorithm for making a sandwich?",
    options: ["Make Sandwich", "Eat Sandwich", "1. Get bread 2. Put jelly on bread 3. Put bread together", "Think about jelly"],
    currentAnswer: "1. Get bread 2. Put jelly on bread 3. Put bread together",
    reasoning: "Algorithms must be broken down into small, simple, step-by-step instructions. Computers need exact, simple steps to follow.",
  },
  {
    id: 32,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Why does the ORDER of steps matter in an algorithm?",
    options: ["Order doesn't matter", "Because putting on shoes before socks wouldn't work!", "Computers can rearrange the steps for you", "To make it longer"],
    currentAnswer: "Because putting on shoes before socks wouldn't work!",
    reasoning: "Sequence (order) is incredibly important. Code runs line by line, from top to bottom. If you do things out of order, the result is a tangled mess.",
  },
  {
    id: 33,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Let's make an algorithm to find our friend 'Sam' in a line of 10 people. What is the easiest way?",
    options: ["Guess completely randomly", "Look from person 1 to person 10, one by one, checking if their name is Sam", "Look at person 1 only", "Give up"],
    currentAnswer: "Look from person 1 to person 10, one by one, checking if their name is Sam",
    reasoning: "Checking one by one is called 'Linear Search'. It is a reliable algorithm that will absolutely always find Sam if he's in line!",
  },
  {
    id: 34,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Imagine you want to find the highest score in a list: [10, 50, 20]. Which algorithm step is most important?",
    options: ["Update our 'highest' variable whenever we clearly see a bigger number", "Just pick the last one", "Add them all up", "Subtract the lowest"],
    currentAnswer: "Update our 'highest' variable whenever we clearly see a bigger number",
    reasoning: "To find the maximum, we keep a variable telling us the 'highest so far', and as we look at each number, if we see a bigger one, we update our variable!",
  },
  {
    id: 35,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Decomposition is a huge word! It means breaking a big scary problem into smaller, easy problems. Which is an example?",
    options: ["Writing a whole game in one line of code", "Splitting a game into three pieces: drawing the player, moving the player, checking the score", "Deleting code that is hard", "Crying"],
    currentAnswer: "Splitting a game into three pieces: drawing the player, moving the player, checking the score",
    reasoning: "Decomposition makes it so we don't get overwhelmed. We can write and test the 'moving the player' part totally by itself!",
  },
  {
    id: 36,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Look at this algorithm loop. What does it do?\n\ntotal = 0\nfor coin in [1, 1, 1]:\n    total = total + coin",
    options: ["Finds the biggest coin", "Just prints coins", "Adds up all the coins to get 3", "Subtracts the coins"],
    currentAnswer: "Adds up all the coins to get 3",
    reasoning: "This is a classic 'accumulator' algorithm. We start at zero, and loop through items, adding them to our total. By the end, our total shows the sum!",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const id = searchParams.get('id'); // cooldown ID to avoid repeating same question

  // Filter questions by topic or use all
  const pool = topic
    ? QUESTIONS.filter(q => q.topic === topic)
    : QUESTIONS;

  if (pool.length === 0) {
    return NextResponse.json({ error: 'No questions found for this topic.' }, { status: 404 });
  }

  // Intelligent shuffling with cooldowns
  // This prevents the same question from appearing consecutively
  let selected: Question;

  if (id) {
    // If a cooldown ID is provided, avoid showing the same question again
    const filtered = pool.filter(q => q.id.toString() !== id);

    if (filtered.length > 0) {
      // Pick from questions that haven't been shown yet
      selected = filtered[Math.floor(Math.random() * filtered.length)];
    } else {
      // If all questions have been shown (shouldn't happen normally), pick any
      selected = pool[0];
    }
  } else {
    // No cooldown - just pick randomly for first load
    selected = pool[Math.floor(Math.random() * pool.length)];
  }

  return NextResponse.json(selected);
}
