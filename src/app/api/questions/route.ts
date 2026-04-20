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
  complexity?: number; // 1-3: 1=single step, 2=requires tracing, 3=multi-step reasoning
  bloomLevel?: 'remembering' | 'understanding' | 'applying' | 'analyzing' | 'evaluating' | 'creating';
};

// 6–8th grade CS question bank
// Topics: variables, conditionals, loops, functions, debugging, algorithms
// Critical thinking focus: edge cases, reverse engineering, multi-concept questions
const QUESTIONS: Question[] = [
  // ── Variables ─────────────────────────────────────────────────────────────
  {
    id: 1,
    topic: "variables",
    type: "multiple-choice",
    question: "You want to keep track of a player's score in a game that can go up and down. What would be a creative way to name your variable, and why does your choice matter for someone else reading your code?",
    options: [
      "scoreTracker",
      "x",
      "number",
      "var1"
    ],
    currentAnswer: "scoreTracker",
    reasoning: "Descriptive variable names help others (and your future self) understand what the code is doing. 'scoreTracker' is clear and logical, while 'x' or 'var1' are confusing.",
  },
  {
    id: 2,
    topic: "variables",
    type: "multiple-choice",
    question: "Imagine you are debugging a program and see: name = 'Alex'; print(name). If you wanted to make this code more flexible for any name, how would you change it, and why is that better?",
    options: [
      "Ask the user for input and store it in name",
      "Keep Alex hardcoded",
      "Change name to n",
      "Print Alex directly without a variable"
    ],
    currentAnswer: "Ask the user for input and store it in name",
    reasoning: "Letting the user input a name makes the program reusable and interactive, not just for 'Alex'. This shows creative thinking about code flexibility.",
  },
  {
    id: 3,
    topic: "variables",
    type: "multiple-choice",
    question: "Suppose you want to keep a running total of coins collected in a game. How would you update your code so it always shows the latest total, and what mistake could make your total wrong?",
    options: [
      "Add new coins to the existing variable each time",
      "Always reset coins to 0 before adding",
      "Use a different variable for each coin",
      "Never update the variable"
    ],
    currentAnswer: "Add new coins to the existing variable each time",
    reasoning: "A running total means you add to the same variable. Resetting to 0 or using new variables would break the logic. This tests understanding of state and accumulation.",
  },
  {
    id: 4,
    topic: "variables",
    type: "multiple-choice",
    question: "In Python, text is called a 'String'. How must we write a String, and why might you choose to use single quotes vs double quotes in your code?",
    options: [
      "Inside quotes, like 'Hello' or \"Hello\"",
      "Inside numbers",
      "Without any quotes",
      "Inside brackets, like [Hello]",
      "Use single quotes if your text contains double quotes, and vice versa"
    ],
    currentAnswer: "Inside quotes, like 'Hello' or \"Hello\"",
    reasoning: "Strings must be in quotes. Choosing single or double quotes can help you include the other type inside your text, showing creative problem-solving.",
  },
  {
    id: 5,
    topic: "variables",
    type: "multiple-choice",
    question: "What is the best way to name a variable that holds a player's score, and how could a bad name cause confusion in a big project?",
    options: [
      "player_score",
      "s",
      "Thing1",
      "1score",
      "scoreValue"
    ],
    currentAnswer: "player_score",
    reasoning: "Descriptive names help everyone understand the code. Bad names make bugs and teamwork harder, especially in big projects.",
  },
  {
    id: 6,
    topic: "variables",
    type: "multiple-choice",
    question: "What happens when we add text in Python using '+'?\n\nword1 = \"Cat\"\nword2 = \"Dog\"\nprint(word1 + word2)\nHow could you change the code to print 'Cat Dog' instead, and why might you want to?",
    options: [
      "CatDog",
      "Cat Dog",
      "Error",
      "7",
      "You might want a space for readability or to make a sentence"
    ],
    currentAnswer: "CatDog",
    reasoning: "Adding strings glues them together. To add a space, you must do it yourself. This shows attention to detail and creative thinking about output.",
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
  {
    id: 37,
    topic: "logic",
    type: "multiple-choice",
    question: "Which prints first?\n\nif x > 5 or y > 10:\n    print('A')\nelif x < 3:\n    print('B')\nelse:\n    print('C')",
    options: [
      "'A' (evaluates left side of 'or' first)",
      "'B' (if or is short-circuit, evaluates right side)",
      "Depends on x and y values",
      "Nothing prints"
    ],
    currentAnswer: "'A' (evaluates left side of 'or' first)",
    reasoning: "Operator precedence! 'or' evaluates left to right. If x > 5 is True, short-circuits and prints A.",
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

  // ── Folding Clothes (Variables, Conditionals, Loops) ───────────────────────
  {
    id: 100,
    topic: "variables",
    type: "multiple-choice",
    question: "You create 'folded = 0' then 'folded = folded + 1' after each item. What does the second line actually do?",
    options: ["Creates a new variable", "Adds 1 to current value and saves it back", "Deletes the old value", "Prints the number"],
    currentAnswer: "Adds 1 to current value and saves it back",
    reasoning: "Variable update! You take the OLD value, add 1, and store the NEW result back in the same box.",
  },
  {
    id: 101,
    topic: "logic",
    type: "multiple-choice",
    question: "Robot code: IF item == 'socks' THEN find_match() ELSE fold_item(). Robot sees a shirt. What happens?",
    options: ["It folds the shirt", "It looks for a match", "It does nothing", "It crashes"],
    currentAnswer: "It folds the shirt",
    reasoning: "Since it's NOT socks, the ELSE path runs - it folds the shirt!",
  },
  {
    id: 102,
    topic: "loops",
    type: "multiple-choice",
    question: "Basket has 23 items. Code: 'for item in basket: fold(item)'. How many times does fold() run?",
    options: ["1 time", "23 times", "Until you stop it", "Never"],
    currentAnswer: "23 times",
    reasoning: "The loop goes through EACH item one by one - 23 iterations!",
  },
  {
    id: 103,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if sock.left_match == None and sock.right_match == None: set_aside()'. What connects the two conditions?",
    options: ["OR", "AND", "NOT", "XOR"],
    currentAnswer: "AND",
    reasoning: "AND means BOTH must be true - sock needs NO left match AND NO right match to be set aside!",
  },

  // ── Fruits (Sorting, Filtering, Grouping) ─────────────────────────────────
  {
    id: 110,
    topic: "algorithms",
    type: "multiple-choice",
    question: "You sort fruits alphabetically: [apple, banana, orange, grape]. What does the computer actually do?",
    options: ["Picks random order", "Compares pairs and swaps if wrong", "Puts in reverse order", "Groups by color first"],
    currentAnswer: "Compares pairs and swaps if wrong",
    reasoning: "Sorting compares items and swaps them if out of order - repeated until sorted!",
  },
  {
    id: 111,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Fruit bowl has 3 good apples and 1 rotten. You keep only good ones. What's the algorithm?",
    options: ["Sorting", "Filtering", "Searching", "Counting"],
    currentAnswer: "Filtering",
    reasoning: "Filtering keeps items that pass a test (not rotten) and removes ones that fail!",
  },
  {
    id: 112,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if fruit.color == \"brown\" OR fruit.color == \"mushy\": throw_away()'. A fruit is brown but not mushy. What happens?",
    options: ["It's kept", "It's thrown away", "Error", "Asks for confirmation"],
    currentAnswer: "It's thrown away",
    reasoning: "OR means EITHER condition being true is enough! Since it's brown, it gets thrown away.",
  },
  {
    id: 113,
    topic: "loops",
    type: "multiple-choice",
    question: "Code: 'for fruit in fruits: if fruit.is_good: add_to_bowl()'. What happens to rotten fruits?",
    options: ["They get added anyway", "They're skipped", "The loop stops", "An error occurs"],
    currentAnswer: "They're skipped",
    reasoning: "The loop checks every fruit but only adds good ones - rotten ones are skipped!",
  },

  // ── Math (Expressions, Ratios, Fractions) ─────────────────────────────────
  {
    id: 120,
    topic: "variables",
    type: "multiple-choice",
    question: "Code: score = 10 + 5 * 2. What order does the computer calculate? (multiply before add)",
    options: ["10 + 5 first, then * 2", "5 * 2 first, then + 10", "Left to right", "Right to left"],
    currentAnswer: "5 * 2 first, then + 10",
    reasoning: "Order of operations! 5*2=10, then 10+10=20, not 15*2=30!",
  },
  {
    id: 121,
    topic: "logic",
    type: "multiple-choice",
    question: "Snack ratio 2 chips : 1 juice. Pack has 6 chips and 2 juice. Does it follow the ratio?",
    options: ["Yes - 6/2 = 3 which is more than 2", "No - 6 chips is too many", "Yes - 2:1 means double", "Yes - both ratios are at least 2"],
    currentAnswer: "Yes - both ratios are at least 2",
    reasoning: "Each ratio must be at least 2! 6÷2=3 (✓), 2÷1=2 (✓). Both pass!",
  },
  {
    id: 122,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Grade 10 tests, separate correct from incorrect. What's the most efficient approach?",
    options: ["Check each and put in correct or incorrect pile", "Check all correct first, then all incorrect", "Randomly assign", "Count them all together"],
    currentAnswer: "Check each and put in correct or incorrect pile",
    reasoning: "Single pass filtering! Go through each test once and place in the right pile.",
  },
  {
    id: 123,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if answer != correct_answer: mark_wrong()'. What does '!=' mean?",
    options: ["Is equal to", "Is not equal to", "Is greater than", "Is less than"],
    currentAnswer: "Is not equal to",
    reasoning: "!= means 'not equal' - if answer doesn't match, mark it wrong!",
  },

  // ── Science - Water Cycle ─────────────────────────────────────────────────
  {
    id: 130,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if temp <= 32: state = \"frozen\" elif temp >= 212: state = \"gas\" else: state = \"liquid\"'. What state at 50°F?",
    options: ["frozen", "liquid", "gas", "error"],
    currentAnswer: "liquid",
    reasoning: "50°F is not <= 32 (not frozen) and not >= 212 (not gas), so it falls to else - liquid!",
  },
  {
    id: 131,
    topic: "loops",
    type: "multiple-choice",
    question: "Temps: [65, 82, 79, 91, 88, 72, 85]. Code: 'hot = 0; for t in temps: if t > 80: hot += 1'. What's the count?",
    options: ["1", "4", "5", "7"],
    currentAnswer: "4",
    reasoning: "Days above 80°F: 82, 91, 88, 85 = 4 days!",
  },
  {
    id: 132,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Weather data: categorize each day as 'rainy' or 'sunny'. What's the algorithm?",
    options: ["Sorting by temperature", "Filtering by condition", "Counting all days", "Finding the maximum"],
    currentAnswer: "Filtering by condition",
    reasoning: "Applying a condition to each day and categorizing - that's conditional filtering!",
  },
  {
    id: 133,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Code: 'hottest = temps[0]; for t in temps: if t > hottest: hottest = t'. What is this?",
    options: ["Linear search", "Finding maximum", "Sorting", "Filtering"],
    currentAnswer: "Finding maximum",
    reasoning: "'Keep track of highest so far' pattern! Compare each temp and update if higher found.",
  },

  // ── Science - Rock Types & Cells ──────────────────────────────────────────
  {
    id: 140,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if hardness >= 6: type = \"hard\" elif hardness >= 3: type = \"medium\" else: type = \"soft\"'. Hardness = 5. What's the type?",
    options: ["hard", "medium", "soft", "error"],
    currentAnswer: "medium",
    reasoning: "5 is not >= 6 (not hard), but IS >= 3, so it goes to medium!",
  },
  {
    id: 141,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Separate plant cells from animal cells. What do you look for? (Think: what do plants have that animals don't?)",
    options: ["Color", "Cell wall presence", "Size", "Shape only"],
    currentAnswer: "Cell wall presence",
    reasoning: "Plant cells have cell walls, animal cells don't.",
  },
  {
    id: 142,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Cell data: [complete, missing_nucleus, complete, missing_mito]. Need only complete cells. What's the algorithm?",
    options: ["Sorting", "Filtering", "Searching", "Counting"],
    currentAnswer: "Filtering",
    reasoning: "Keeping only cells that pass a completeness test - classic filtering!",
  },
  {
    id: 143,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if cell.has_nucleus and cell.has_mito: add_to_group(\"eukaryote\") else: add_to_group(\"prokaryote\")'. Cell has nucleus but NO mito. What group?",
    options: ["eukaryote", "prokaryote", "both", "neither"],
    currentAnswer: "prokaryote",
    reasoning: "AND requires BOTH true! No mito = condition fails, goes to else - prokaryote!",
  },

  // ── Science - Organisms & Food Chains ─────────────────────────────────────
  {
    id: 150,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if energy == \"sun\": role = \"producer\" elif energy == \"other\": role = \"consumer\" else: role = \"decomposer\"'. Mushroom gets energy from decaying matter. What's its role?",
    options: ["producer", "consumer", "decomposer", "error"],
    currentAnswer: "decomposer",
    reasoning: "Mushrooms break down dead things - that's the 'else' case (neither sun nor other organisms), so decomposer!",
  },
  {
    id: 151,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Food chain: grass -> rabbit -> fox -> snake. A tiger gets placed in it. You need to remove it. What's the algorithm?",
    options: ["Sorting", "Filtering out an item", "Counting", "Finding maximum"],
    currentAnswer: "Filtering out an item",
    reasoning: "Removing an item that doesn't belong in this food chain - filtering it out!",
  },
  {
    id: 152,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Arrange organisms from sun → producers → herbivores → carnivores. What's the algorithm?",
    options: ["Filtering", "Sorting by energy level", "Searching", "Looping"],
    currentAnswer: "Sorting by energy level",
    reasoning: "Ordering by position in energy flow - sorting by a specific criteria!",
  },

  // ── ELA - Sentence Structure & Grammar ────────────────────────────────────
  {
    id: 160,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if word not in dictionary: flag_spelling()'. What does 'not in' check?",
    options: ["Word is in the dictionary", "Word is NOT in the dictionary", "Word equals dictionary", "Word is greater than dictionary"],
    currentAnswer: "Word is NOT in the dictionary",
    reasoning: "'not in' means the item is absent! If word isn't in dictionary, it gets flagged.",
  },
  {
    id: 161,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Essay: "The cat sat. The cat sat. The cat sat on the mat." Remove the repeated sentence. What's the algorithm?",
    options: ["Sorting", "Removing duplicates", "Counting sentences", "Finding maximum"],
    currentAnswer: "Removing duplicates",
    reasoning: "Compare each sentence to previous ones and remove matches - deduplication/filtering!",
  },
  {
    id: 162,
    topic: "logic",
    type: "multiple-choice",
    question: "Code: 'if \"topic_sentence\" not in paragraph: flag_as_needing_one()'. Paragraph has a topic sentence. What happens?",
    options: ["It's flagged", "It's not flagged", "An error occurs", "It's deleted"],
    currentAnswer: "It's not flagged",
    reasoning: "Checks if topic_sentence is NOT in paragraph - since it IS in there, condition is FALSE, no flag!",
  },
  {
    id: 163,
    topic: "algorithms",
    type: "multiple-choice",
    question: "Match claims with evidence: claim1 → evidenceA, claim2 → evidenceB. What data structure?",
    options: ["A list", "A dictionary/hash map", "A loop", "A variable"],
    currentAnswer: "A dictionary/hash map",
    reasoning: "Dictionaries store key-value pairs! Each claim maps to its evidence - perfect for lookups!",
  },

  // ── ELA - Stories & Arguments ─────────────────────────────────────────────
  {
    id: 170,
    topic: "algorithms",
    type: "multiple-choice",
    question: "You are putting story events in logical order. What algorithm concept is this?",
    options: ["Filtering", "Sorting", "Looping", "Variables"],
    currentAnswer: "Sorting",
    reasoning: "Putting events in order is sorting!",
  },
  {
    id: 171,
    topic: "algorithms",
    type: "multiple-choice",
    question: "You need to remove events that don't fit the story. What are you doing?",
    options: ["Sorting", "Filtering", "Looping", "Counting"],
    currentAnswer: "Filtering",
    reasoning: "You're keeping only relevant events - that's filtering!",
  },
  {
    id: 172,
    topic: "logic",
    type: "multiple-choice",
    question: "To rank arguments from strongest to weakest, you compare: if argument.strength > other.strength. What is this?",
    options: ["A loop", "A comparison for sorting", "A variable", "A function call"],
    currentAnswer: "A comparison for sorting",
    reasoning: "Comparing values to determine order is how sorting algorithms work!",
  },
  {
    id: 173,
    topic: "logic",
    type: "multiple-choice",
    question: "To identify weak arguments, you check: if not argument.has_evidence: mark_weak(). What does this demonstrate?",
    options: ["A loop", "A conditional filter", "A variable", "A function definition"],
    currentAnswer: "A conditional filter",
    reasoning: "You're using a condition to identify and flag arguments.",
  },

  // ── History - Government & Voting ─────────────────────────────────────────
  {
    id: 180,
    topic: "logic",
    type: "multiple-choice",
    question: "You are sorting government types: 1-Dictatorship (one person), Oligarchy (small group), Democracy (many people). What are you sorting by?",
    options: ["Size of country", "Number of people in power", "Age of government", "Location"],
    currentAnswer: "Number of people in power",
    reasoning: "Government types are classified by how many people hold power!",
  },
  {
    id: 181,
    topic: "algorithms",
    type: "multiple-choice",
    question: "You need to separate votes by candidate and remove invalid ballots. What two things are you doing?",
    options: ["Sorting and filtering", "Looping and printing", "Variables and functions", "Adding and subtracting"],
    currentAnswer: "Sorting and filtering",
    reasoning: "Separating votes by candidate is sorting, removing invalid ballots is filtering!",
  },
  {
    id: 182,
    topic: "algorithms",
    type: "multiple-choice",
    question: "To determine the winner, you count votes for each candidate and find the maximum. What is this called?",
    options: ["Finding the maximum", "Sorting", "Filtering", "Looping"],
    currentAnswer: "Finding the maximum",
    reasoning: "Finding who has the most votes is finding the maximum value!",
  },
  {
    id: 183,
    topic: "logic",
    type: "multiple-choice",
    question: "To check if a ballot is valid, you write: if ballot.has_signature and ballot.marked_clearly: accept(). What is this?",
    options: ["A loop", "A compound conditional", "A variable", "A function definition"],
    currentAnswer: "A compound conditional",
    reasoning: "This checks multiple conditions before accepting.",
  },

  // ── History - Events & Causes ─────────────────────────────────────────────
  {
    id: 190,
    topic: "algorithms",
    type: "multiple-choice",
    question: "You need to separate causes from effects in historical events. What algorithm concept is this?",
    options: ["Sorting", "Filtering", "Looping", "Variables"],
    currentAnswer: "Sorting",
    reasoning: "You're categorizing events into groups - that's sorting!",
  },
  {
    id: 191,
    topic: "algorithms",
    type: "multiple-choice",
    question: "You need to remove events that are unrelated to the main topic. What are you doing?",
    options: ["Sorting", "Filtering", "Looping", "Counting"],
    currentAnswer: "Filtering",
    reasoning: "You're keeping only relevant events - that's filtering!",
  },
  {
    id: 192,
    topic: "logic",
    type: "multiple-choice",
    question: "To match causes to outcomes, you write: if cause.leads_to == effect: pair_them(). What does this demonstrate?",
    options: ["A loop", "A conditional matching", "A variable", "A function definition"],
    currentAnswer: "A conditional matching",
    reasoning: "You're using a condition to find and pair related items!",
  },
  {
    id: 193,
    topic: "algorithms",
    type: "multiple-choice",
    question: "You have a list of events and need to connect causes to their effects. What data structure works best?",
    options: ["A single number", "A list of pairs", "A loop only", "A print statement"],
    currentAnswer: "A list of pairs",
    reasoning: "Storing cause-effect pairs in a list lets you track the relationships!",
  },
];

// ── CRITICAL THINKING QUESTIONS (Edge Cases, Reverse Engineering, Multi-concept) ──
const CRITICAL_THINKING_QUESTIONS: Omit<Question, 'id'>[] = [
  // ── Edge Case Analysis ──
  {
    topic: "variables",
    type: "multiple-choice",
    complexity: 2,
    bloomLevel: "analyzing",
    question: "The code prints 60:\n\nmoney = 100\nmoney = money - 50\nmoney = money - 10\n\nWhat if the second line was `money -= 40` instead? What would print?",
    options: ["90", "70", "60", "50"],
    reasoning: "Starting at 100: with -= 40, we get 100 - 40 = 60, then 60 - 10 = 50. This tests understanding of operator shorthand and sequential state changes.",
    currentAnswer: "50",
  },
  {
    topic: "logic",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "evaluating",
    question: "Which condition is FALSE when age = 15 and height = 48?\n\nA) age >= 15 AND height >= 45\nB) age < 20 OR height < 50\nC) NOT (age > 18)\nD) age > 15 AND height < 50",
    options: [
      "A) age >= 15 AND height >= 45",
      "B) age < 20 OR height < 50",
      "C) NOT (age > 18)",
      "D) age > 15 AND height < 50",
    ],
    reasoning: "Testing multiple conditions at once! age=15, so 'age > 15' is FALSE. D fails because one side is false. This develops multi-condition evaluation skills.",
    currentAnswer: "D) age > 15 AND height < 50",
  },
  {
    topic: "loops",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "creating",
    question: "Consider:\n\npackages = 3\nwhile packages > 0:\n    print('Delivered')\n    packages -= 1\n\nWhat if we changed the condition to `packages >= 0`? What happens?",
    options: ["The droid delivers one more time then stops", "Infinite loop (packages keeps going forever)", "Nothing changes", "Droid stops immediately"],
    reasoning: "Edge case! packages starts at 3, goes 2, 1, 0. At 0, 0 >= 0 is True, prints again, then packages=-1. When -1 >= 0, that's False. So it delivers one extra. This teaches boundary condition thinking.",
    currentAnswer: "The droid delivers one more time then stops",
  },
  {
    topic: "debugging",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "creating",
    question: "The robot should turn LEFT when sensor == 0. But it goes STRAIGHT. You see:\n\nif sensor == 0:\n    turn_right()\n\nWhat's wrong?",
    options: [
      "turn_right is wrong - should be turn_left",
      "The indentation is wrong",
      "Missing a colon",
      "It's a syntax error, not a logic bug"
    ],
    reasoning: "Syntax is fine, logic is wrong! The computer did exactly what we told it - this is a logic bug, not a syntax bug. Students must distinguish between 'wrong instruction' vs 'wrong computer'.",
    currentAnswer: "turn_right is wrong - should be turn_left",
  },
  {
    topic: "debugging",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "analyzing",
    question: "This code prints '10' at the end. Which original value of 'score' would make this happen?\n\nscore = score - 5\nprint(score)",
    options: ["10", "5", "15", "0"],
    reasoning: "Reverse engineering! We need: score - 5 = 10, so score = 15. This tests thinking backwards instead of forward execution.",
    currentAnswer: "15",
  },
  {
    topic: "functions",
    type: "multiple-choice",
    complexity: 2,
    bloomLevel: "understanding",
    question: "What prints when calling double(5) and then double(10)?\n\ndef double(n):\n    result = n * 2\n    return result",
    options: [
      "Prints 10 then 20",
      "Prints 5 then 10",
      "Crashes - can't return two values",
      "Prints 15 then 30"
    ],
    reasoning: "Function calls are isolated! Each call computes independently. double(5) → 10, double(10) → 20. This reinforces understanding of function composition.",
    currentAnswer: "Prints 10 then 20",
  },
  {
    topic: "loops",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "evaluating",
    question: "Both loops run until packages = 0:\n1. while packages > 0: ... packages -= 1\n2. for i in range(packages): ...\n\nWhat's a key difference?",
    options: [
      "Loop 1 can be infinite; Loop 2 always has a known count",
      "Loop 1 is faster",
      "Loop 2 is more memory efficient",
      "Loop 1 can't access initial packages value"
    ],
    reasoning: "Trade-off analysis! while checks runtime condition (can be infinite), for uses pre-calculated range. This teaches when to choose each.",
    currentAnswer: "Loop 1 can be infinite; Loop 2 always has a known count",
  },
  {
    topic: "debugging",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "analyzing",
    question: "The code should print numbers 1-10. But it prints 1-9. Where's the bug?\n\ni = 1\nwhile i < 10:\n    print(i)\n    i = i + 1",
    options: [
      "The condition should be i <= 10 (includes 10)",
      "i = i + 1 should come before print",
      "Print statement is wrong",
      "No bug - computer is smart"
    ],
    reasoning: "Boundary condition bug! i=9 is < 10, prints, becomes 10. Then 10 < 10 is False, stops. The fix: use <= to include the boundary. This teaches edge case precision.",
    currentAnswer: "The condition should be i <= 10 (includes 10)",
  },
  {
    topic: "logic",
    type: "multiple-choice",
    complexity: 2,
    bloomLevel: "understanding",
    question: "Which prints first?\n\nif x > 5 or y > 10:\n    print('A')\nelif x < 3:\n    print('B')\nelse:\n    print('C')",
    options: [
      "'A' (evaluates left side of 'or' first)",
      "'B' (if or is short-circuit, evaluates right side)",
      "Depends on x and y values",
      "Nothing prints"
    ],
    reasoning: "Operator precedence! 'or' evaluates left to right. If x > 5 is True, short-circuits and prints A. Otherwise checks right side. This teaches execution order.",
    currentAnswer: "'A' (evaluates left side of 'or' first)",
  },
  {
    topic: "algorithms",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "evaluating",
    question: "You need to sum all numbers in a list AND find the maximum. Which approach shows better critical thinking?",
    options: [
      "Make two loops (one for sum, one for max)",
      "Make one loop that updates BOTH total AND highest",
      "Use two different functions",
      "Hardcode the answer"
    ],
    reasoning: "Accumulator pattern! Solving multiple goals in a single pass is efficient and elegant. This teaches decomposition + combining solutions.",
    currentAnswer: "Make one loop that updates BOTH total AND highest",
  },
  {
    topic: "debugging",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "analyzing",
    question: "The output is 42 but you expected 100. What's most likely wrong?\n\nresult = 5 * 10\nresult = result + 42 - 10",
    options: [
      "Math error: 50 + 42 - 10 = 82, not 100",
      "Operator precedence issue",
      "result variable not initialized",
      "No bugs, output is correct"
    ],
    reasoning: "Math tracing! Step by step: 5*10=50, 50+42=92, 92-10=82. This tests careful mental tracing and error detection.",
    currentAnswer: "Math error: 50 + 42 - 10 = 82, not 100",
  },
  {
    topic: "variables",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "analyzing",
    question: "Why would you use a 'const' instead of 'let' for a variable?",
    options: [
      "It's faster",
      "The value shouldn't change - prevents logic bugs from accidental reassignment",
      "Syntax is shorter",
      "const is required by law"
    ],
    reasoning: "Intent signaling! const declares that this value is foundational. If the code tries to change it, Python (or JS) prevents it. This is a contract: 'this doesn't change'.",
    currentAnswer: "The value shouldn't change - prevents logic bugs from accidental reassignment",
  },
  {
    topic: "functions",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "evaluating",
    question: "Why do we pass parameters to functions?",
    options: [
      "To make code longer",
      "So the function can work on specific data without redefining itself",
      "It's required",
      "Functions can't work without them"
    ],
    reasoning: "Reusability with customization! A function is a recipe. Parameters are ingredients. Same recipe, different ingredients = different results. This teaches abstraction.",
    currentAnswer: "So the function can work on specific data without redefining itself",
  },
  {
    topic: "loops",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "evaluating",
    question: "What's the 'escape hatch' in a while loop?",
    options: [
      "In the condition (what stops it from being infinite)",
      "In the loop body (what changes the condition variable)",
      "Using break statement",
      "Using a for loop instead"
    ],
    reasoning: "Critical concept! The escape hatch is changing the condition variable. Each iteration moves us closer to False. Without this, you get infinite loop.",
    currentAnswer: "In the loop body (what changes the condition variable)",
  },
  {
    topic: "algorithms",
    type: "multiple-choice",
    complexity: 3,
    bloomLevel: "understanding",
    question: "Why does the ORDER of steps matter in an algorithm?",
    options: [
      "Order doesn't matter",
      "Because putting on shoes before socks wouldn't work!",
      "Computers can rearrange steps automatically",
      "To make it longer"
    ],
    reasoning: "Sequence is everything! Code runs top-to-bottom like a story. Getting steps out of order breaks the logic flow. Real world analogy: you can't put on socks after shoes.",
    currentAnswer: "Because putting on shoes before socks wouldn't work!",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const id = searchParams.get('id'); // cooldown ID to avoid repeating same question
  const critical = searchParams.get('critical');

  let pool: Omit<Question, 'id'>[] | Question[];
  if (critical === '1') {
    pool = CRITICAL_THINKING_QUESTIONS;
  } else if (topic) {
    pool = [...QUESTIONS, ...CRITICAL_THINKING_QUESTIONS].filter(q => q.topic === topic);
  } else {
    pool = [...QUESTIONS, ...CRITICAL_THINKING_QUESTIONS];
  }

  if (pool.length === 0) {
    return NextResponse.json({ error: 'No questions found for this topic.' }, { status: 404 });
  }

  // Intelligent shuffling with cooldowns
  // This prevents the same question from appearing consecutively
  let selected: any;

  if (id) {
    // If a cooldown ID is provided, avoid showing the same question again
    const filtered = pool.filter((q: any) => q.id?.toString() !== id);

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
