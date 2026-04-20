import { NextResponse } from 'next/server';

type Question = {
  id: number;
  topic: string;
  currentAnswer: string;
  reasoning: string;
};

// Must stay in sync with /api/questions/route.ts
const ANSWERS: Question[] = [
  // Original CS Questions
  { id: 1,  topic: "variables",   currentAnswer: "scoreTracker",                                                                reasoning: "Descriptive variable names help others understand what the code is doing." },
  { id: 2,  topic: "variables",   currentAnswer: "Ask the user for input and store it in name",                                reasoning: "Letting the user input a name makes the program reusable and interactive." },
  { id: 3,  topic: "variables",   currentAnswer: "Add new coins to the existing variable each time",                          reasoning: "A running total means you add to the same variable." },
  { id: 4,  topic: "variables",   currentAnswer: "Inside quotes, like 'Hello' or \"Hello\"",                                   reasoning: "Strings must be in quotes." },
  { id: 5,  topic: "variables",   currentAnswer: "player_score",                                                                reasoning: "Descriptive names help everyone understand the code." },
  { id: 6,  topic: "variables",   currentAnswer: "CatDog",                                                                      reasoning: "Adding strings glues them together." },
  { id: 7,  topic: "variables",   currentAnswer: "age = 12",                                                                    reasoning: "Numbers without quotes are real numbers in Python." },
  { id: 8,  topic: "logic",       currentAnswer: "It prints \"Grab an umbrella!\"",                                              reasoning: "The condition 'is_raining' is True, so the code inside the 'if' block runs." },
  { id: 9,  topic: "logic",       currentAnswer: "Do this instead if the first condition was False",                             reasoning: "'if' says \"if this is true, do X\". 'else' says \"otherwise, do Y\"." },
  { id: 10, topic: "logic",       currentAnswer: "Keep Trying!",                                                                 reasoning: "Because 50 is not greater than 100, the 'if' part is skipped and 'else' runs." },
  { id: 11, topic: "logic",       currentAnswer: "Teen or Tween",                                                                reasoning: "Since age is 10, 'age > 18' is False. The 'elif' checks 'age >= 10' which is True." },
  { id: 12, topic: "logic",       currentAnswer: "color == \"red\"",                                                             reasoning: "A double equals (==) asks \"are these the same?\"." },
  { id: 13, topic: "logic",       currentAnswer: "BOTH must be true to ride",                                                    reasoning: "The word 'and' means both sides must be true." },
  { id: 14, topic: "loops",       currentAnswer: "Print \"Jump!\" 3 times",                                                       reasoning: "range(3) tells Python to repeat the action 3 times." },
  { id: 15, topic: "loops",       currentAnswer: "0, 1, 2",                                                                      reasoning: "Computer programs start counting at 0." },
  { id: 16, topic: "loops",       currentAnswer: "while True:",                                                                  reasoning: "'while True' means \"keep doing this as long as True is True!\" It never stops." },
  { id: 17, topic: "loops",       currentAnswer: "Prints Playing 3 times",                                                        reasoning: "lives starts at 3. Each loop subtracts 1." },
  { id: 18, topic: "loops",       currentAnswer: "A collection of items stored in brackets, like [\"apple\", \"banana\"]",       reasoning: "A list stores many items in one variable using square brackets." },
  { id: 19, topic: "loops",       currentAnswer: "Print \"apple\" then \"pear\"",                                                  reasoning: "This goes through the list one item at a time." },
  { id: 20, topic: "functions",   currentAnswer: "def function_name():",                                                        reasoning: "We use 'def' which stands for 'define'." },
  { id: 21, topic: "functions",   currentAnswer: "We need to CALL the function by writing say_hi() below it",                  reasoning: "Defining a recipe doesn't mean you made the food!" },
  { id: 22, topic: "functions",   currentAnswer: "Prints 10",                                                                    reasoning: "We give 5 to the function as the 'num'. Inside, it does 5 * 2 = 10." },
  { id: 23, topic: "functions",   currentAnswer: "return",                                                                       reasoning: "We use 'return' to send the final answer back." },
  { id: 24, topic: "functions",   currentAnswer: "Prints Mario",                                                                  reasoning: "get_winner() returns \"Mario\"." },
  { id: 25, topic: "functions",   currentAnswer: "They let us reuse the same code without writing it over and over",            reasoning: "Functions save us typing!" },
  { id: 26, topic: "debugging",   currentAnswer: "A mistake or error in the code that makes it crash or act weird",            reasoning: "A bug is just a mistake we made while coding." },
  { id: 27, topic: "debugging",   currentAnswer: "turn_right is wrong - should be turn_left",                                   reasoning: "The computer did exactly what we told it - this is a logic bug." },
  { id: 28, topic: "debugging",   currentAnswer: "Logic Bug (Code runs, but does the wrong math)",                               reasoning: "A logic bug is when the code is fine Python, but we gave wrong instructions." },
  { id: 29, topic: "debugging",   currentAnswer: "Using the print() command to print out variables",                              reasoning: "Using print() helps you peek inside your program." },
  { id: 30, topic: "debugging",   currentAnswer: "The condition should be i <= 10 (includes 10)",                                reasoning: "Boundary condition bug! i=9 is < 10, prints, becomes 10." },
  { id: 37, topic: "logic",       currentAnswer: "'A' (evaluates left side of 'or' first)",                                      reasoning: "Operator precedence! 'or' evaluates left to right." },
  { id: 31, topic: "algorithms",  currentAnswer: "1. Get bread 2. Put jelly on bread 3. Put bread together",                     reasoning: "Algorithms must be specific, ordered, and complete." },
  { id: 32, topic: "algorithms",  currentAnswer: "Because putting on shoes before socks wouldn't work!",                         reasoning: "Sequence is important. Code runs line by line, top to bottom." },
  { id: 33, topic: "algorithms",  currentAnswer: "Look from person 1 to person 10, one by one, checking if their name is Sam",   reasoning: "Checking one by one is called 'Linear Search'." },
  { id: 34, topic: "algorithms",  currentAnswer: "Update our 'highest' variable whenever we clearly see a bigger number",          reasoning: "To find the maximum, keep a 'highest so far' variable." },
  { id: 35, topic: "algorithms",  currentAnswer: "Splitting a game into three pieces: drawing the player, moving the player, checking the score", reasoning: "Decomposition makes it so we don't get overwhelmed." },
  { id: 36, topic: "algorithms",  currentAnswer: "Adds up all the coins to get 3",                                              reasoning: "This is a classic 'accumulator' algorithm." },

  // ── Folding Clothes (Variables, Conditionals, Loops) ───────────────────────
  { id: 100, topic: "variables",  currentAnswer: "folded_count",                                                                reasoning: "A descriptive variable name like 'folded_count' clearly shows what it stores." },
  { id: 101, topic: "logic",      currentAnswer: "An if-else statement",                                                        reasoning: "This is a conditional! You're making a decision based on what type of item you have." },
  { id: 102, topic: "loops",      currentAnswer: "for item in clothes_pile:",                                                   reasoning: "A 'for' loop is perfect here! It goes through each item one by one." },
  { id: 103, topic: "logic",      currentAnswer: "if sock.has_match == False:",                                                reasoning: "You need to check if the sock doesn't have a match." },

  // ── Fruits (Sorting, Filtering, Grouping) ─────────────────────────────────
  { id: 110, topic: "algorithms", currentAnswer: "Sorting",                                                                     reasoning: "Sorting means putting things in a specific order!" },
  { id: 111, topic: "algorithms", currentAnswer: "Filtering",                                                                   reasoning: "Filtering means keeping only the items that meet a certain condition." },
  { id: 112, topic: "logic",      currentAnswer: "Conditional",                                                                 reasoning: "This is a conditional statement!" },
  { id: 113, topic: "loops",      currentAnswer: "A loop",                                                                       reasoning: "You need a loop to go through each fruit in your list." },

  // ── Math (Expressions, Ratios, Fractions) ─────────────────────────────────
  { id: 120, topic: "variables",  currentAnswer: "Replace x with 4",                                                            reasoning: "To evaluate an expression with a variable, you substitute the variable with its given value!" },
  { id: 121, topic: "logic",      currentAnswer: "Yes, because 4/2 = 2",                                                        reasoning: "The ratio 2:1 means 2 chips for every 1 juice." },
  { id: 122, topic: "algorithms", currentAnswer: "Two lists (correct_answers, incorrect_answers)",                               reasoning: "Using two separate lists lets you group and organize the answers." },
  { id: 123, topic: "logic",      currentAnswer: "A conditional filter",                                                        reasoning: "This is filtering! You're using a condition to decide which items to keep." },

  // ── Science - Water Cycle ─────────────────────────────────────────────────
  { id: 130, topic: "logic",      currentAnswer: "It freezes",                                                                  reasoning: "Water freezes at 32°F or below. Since 30 < 32, the water will freeze!" },
  { id: 131, topic: "loops",      currentAnswer: "A loop with a condition",                                                    reasoning: "You need a loop to check each day's temperature AND a condition to filter." },
  { id: 132, topic: "algorithms", currentAnswer: "Filtering",                                                                   reasoning: "You're keeping days that match certain conditions - that's filtering!" },
  { id: 133, topic: "algorithms", currentAnswer: "Finding the maximum",                                                        reasoning: "Finding the maximum is a common algorithm!" },

  // ── Science - Rock Types & Cells ──────────────────────────────────────────
  { id: 140, topic: "logic",      currentAnswer: "Conditional",                                                                 reasoning: "This checks a condition and categorizes the rock - that's a conditional!" },
  { id: 141, topic: "algorithms", currentAnswer: "Cell wall presence",                                                          reasoning: "Plant cells have cell walls, animal cells don't." },
  { id: 142, topic: "algorithms", currentAnswer: "Filtering",                                                                   reasoning: "You're keeping only complete cells and removing incomplete ones." },
  { id: 143, topic: "logic",      currentAnswer: "A conditional classification",                                               reasoning: "You're using a condition to classify items into groups." },

  // ── Science - Organisms & Food Chains ─────────────────────────────────────
  { id: 150, topic: "logic",      currentAnswer: "How it gets energy",                                                          reasoning: "Organisms are classified by their role in the food chain!" },
  { id: 151, topic: "algorithms", currentAnswer: "Filtering",                                                                   reasoning: "You're removing items that don't belong - that's filtering!" },
  { id: 152, topic: "algorithms", currentAnswer: "Sorting",                                                                     reasoning: "Putting things in a specific order based on a rule is sorting!" },

  // ── ELA - Sentence Structure & Grammar ────────────────────────────────────
  { id: 160, topic: "logic",      currentAnswer: "A conditional check",                                                        reasoning: "You're checking each sentence for a specific condition." },
  { id: 161, topic: "algorithms", currentAnswer: "Filtering",                                                                   reasoning: "You're keeping only unique sentences and removing duplicates." },
  { id: 162, topic: "logic",      currentAnswer: "Marks paragraphs missing a topic sentence",                                  reasoning: "This conditional checks for a missing topic sentence." },
  { id: 163, topic: "algorithms", currentAnswer: "A dictionary (claim: evidence)",                                              reasoning: "A dictionary lets you store key-value pairs." },

  // ── ELA - Stories & Arguments ─────────────────────────────────────────────
  { id: 170, topic: "algorithms", currentAnswer: "Sorting",                                                                     reasoning: "Putting events in order is sorting!" },
  { id: 171, topic: "algorithms", currentAnswer: "Filtering",                                                                   reasoning: "You're keeping only relevant events - that's filtering!" },
  { id: 172, topic: "logic",      currentAnswer: "A comparison for sorting",                                                   reasoning: "Comparing values to determine order is how sorting algorithms work!" },
  { id: 173, topic: "logic",      currentAnswer: "A conditional filter",                                                        reasoning: "You're using a condition to identify and flag arguments." },

  // ── History - Government & Voting ─────────────────────────────────────────
  { id: 180, topic: "logic",      currentAnswer: "Number of people in power",                                                  reasoning: "Government types are classified by how many people hold power!" },
  { id: 181, topic: "algorithms", currentAnswer: "Sorting and filtering",                                                      reasoning: "Separating votes by candidate is sorting, removing invalid ballots is filtering!" },
  { id: 182, topic: "algorithms", currentAnswer: "Finding the maximum",                                                        reasoning: "Finding who has the most votes is finding the maximum value!" },
  { id: 183, topic: "logic",      currentAnswer: "A compound conditional",                                                     reasoning: "This checks multiple conditions before accepting - that's a compound conditional!" },

  // ── History - Events & Causes ─────────────────────────────────────────────
  { id: 190, topic: "algorithms", currentAnswer: "Sorting",                                                                     reasoning: "You're categorizing events into groups - that's sorting!" },
  { id: 191, topic: "algorithms", currentAnswer: "Filtering",                                                                   reasoning: "You're keeping only relevant events - that's filtering!" },
  { id: 192, topic: "logic",      currentAnswer: "A conditional matching",                                                     reasoning: "You're using a condition to find and pair related items!" },
  { id: 193, topic: "algorithms", currentAnswer: "A list of pairs",                                                             reasoning: "Storing cause-effect pairs in a list lets you track relationships!" },
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
