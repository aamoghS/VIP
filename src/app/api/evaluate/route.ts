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
  { id: 100, topic: "variables",  currentAnswer: "Adds 1 to current value and saves it back",                                  reasoning: "Variable update! You take the OLD value, add 1, and store the NEW result back in the same box." },
  { id: 101, topic: "logic",      currentAnswer: "It folds the shirt",                                                         reasoning: "Since it's NOT socks, the ELSE path runs - it folds the shirt!" },
  { id: 102, topic: "loops",      currentAnswer: "23 times",                                                                   reasoning: "The loop goes through EACH item one by one - 23 iterations!" },
  { id: 103, topic: "logic",      currentAnswer: "AND",                                                                        reasoning: "AND means BOTH must be true - sock needs NO left match AND NO right match to be set aside!" },

  // ── Fruits (Sorting, Filtering, Grouping) ─────────────────────────────────
  { id: 110, topic: "algorithms", currentAnswer: "Compares pairs and swaps if wrong",                                          reasoning: "Sorting compares items and swaps them if out of order - repeated until sorted!" },
  { id: 111, topic: "algorithms", currentAnswer: "Filtering",                                                                 reasoning: "Filtering keeps items that pass a test (not rotten) and removes ones that fail!" },
  { id: 112, topic: "logic",      currentAnswer: "It's thrown away",                                                           reasoning: "OR means EITHER condition being true is enough! Since it's brown, it gets thrown away." },
  { id: 113, topic: "loops",      currentAnswer: "They're skipped",                                                            reasoning: "The loop checks every fruit but only adds good ones - rotten ones are skipped!" },

  // ── Math (Expressions, Ratios, Fractions) ─────────────────────────────────
  { id: 120, topic: "variables",  currentAnswer: "5 * 2 first, then + 10",                                                     reasoning: "Order of operations! 5*2=10, then 10+10=20, not 15*2=30!" },
  { id: 121, topic: "logic",      currentAnswer: "Yes - both ratios are at least 2",                                           reasoning: "Each ratio must be at least 2! 6÷2=3 (✓), 2÷1=2 (✓). Both pass!" },
  { id: 122, topic: "algorithms", currentAnswer: "Check each and put in correct or incorrect pile",                           reasoning: "Single pass filtering! Go through each test once and place in the right pile." },
  { id: 123, topic: "logic",      currentAnswer: "Is not equal to",                                                            reasoning: "!= means 'not equal' - if answer doesn't match, mark it wrong!" },

  // ── Science - Water Cycle ─────────────────────────────────────────────────
  { id: 130, topic: "logic",      currentAnswer: "liquid",                                                                     reasoning: "50°F is not <= 32 (not frozen) and not >= 212 (not gas), so it falls to else - liquid!" },
  { id: 131, topic: "loops",      currentAnswer: "4",                                                                          reasoning: "Days above 80°F: 82, 91, 88, 85 = 4 days!" },
  { id: 132, topic: "algorithms", currentAnswer: "Filtering by condition",                                                    reasoning: "Applying a condition to each day and categorizing - that's conditional filtering!" },
  { id: 133, topic: "algorithms", currentAnswer: "Finding maximum",                                                            reasoning: "'Keep track of highest so far' pattern! Compare each temp and update if higher found." },

  // ── Science - Rock Types & Cells ──────────────────────────────────────────
  { id: 140, topic: "logic",      currentAnswer: "medium",                                                                    reasoning: "5 is not >= 6 (not hard), but IS >= 3, so it goes to medium!" },
  { id: 141, topic: "algorithms", currentAnswer: "Cell wall presence",                                                          reasoning: "Plant cells have cell walls and chloroplasts - the distinguishing features!" },
  { id: 142, topic: "algorithms", currentAnswer: "Filtering",                                                                 reasoning: "Keeping only cells that pass a completeness test - classic filtering!" },
  { id: 143, topic: "logic",      currentAnswer: "prokaryote",                                                                reasoning: "AND requires BOTH true! No mito = condition fails, goes to else - prokaryote!" },

  // ── Science - Organisms & Food Chains ─────────────────────────────────────
  { id: 150, topic: "logic",      currentAnswer: "decomposer",                                                                reasoning: "Mushrooms break down dead things - that's the 'else' case, so decomposer!" },
  { id: 151, topic: "algorithms", currentAnswer: "Filtering out an item",                                                     reasoning: "Removing an item that doesn't belong in this food chain - filtering it out!" },
  { id: 152, topic: "algorithms", currentAnswer: "Sorting by energy level",                                                   reasoning: "Ordering by position in energy flow - sorting by a specific criteria!" },

  // ── ELA - Sentence Structure & Grammar ────────────────────────────────────
  { id: 160, topic: "logic",      currentAnswer: "Word is NOT in the dictionary",                                              reasoning: "'not in' means the item is absent! If word isn't in dictionary, it gets flagged." },
  { id: 161, topic: "algorithms", currentAnswer: "Removing duplicates",                                                       reasoning: "Compare each sentence to previous ones and remove matches - deduplication/filtering!" },
  { id: 162, topic: "logic",      currentAnswer: "It's not flagged",                                                          reasoning: "Checks if topic_sentence is NOT in paragraph - since it IS in there, condition is FALSE, no flag!" },
  { id: 163, topic: "algorithms", currentAnswer: "A dictionary/hash map",                                                      reasoning: "Dictionaries store key-value pairs! Each claim maps to its evidence - perfect for lookups!" },

  // ── ELA - Stories & Arguments ─────────────────────────────────────────────
  { id: 170, topic: "algorithms", currentAnswer: "Sorting by time",                                                            reasoning: "Ordering events by when they happened - sorting by temporal criteria!" },
  { id: 171, topic: "algorithms", currentAnswer: "Remove it (filter)",                                                         reasoning: "Filtering out events that don't belong to the main story - keeping only relevant content!" },
  { id: 172, topic: "logic",      currentAnswer: "Which comes first in sorted order",                                        reasoning: "Comparing strength determines relative ordering - stronger one gets ranked higher!" },
  { id: 173, topic: "logic",      currentAnswer: "It's NOT marked weak",                                                      reasoning: "'not arg.has_evidence' means evidence is ABSENT. Since it HAS evidence, condition is FALSE - not marked!" },

  // ── History - Government & Voting ─────────────────────────────────────────
  { id: 180, topic: "logic",      currentAnswer: "oligarchy",                                                                 reasoning: "5 is not 1 (not dictatorship), but IS <= 10, so it falls to oligarchy! Small group rule." },
  { id: 181, topic: "algorithms", currentAnswer: "Sort then filter",                                                          reasoning: "First organize votes (sorting), then remove invalid ones (filtering) - sequential operations!" },
  { id: 182, topic: "algorithms", currentAnswer: "Finding the maximum",                                                        reasoning: "Finding who has the most votes is literally finding the maximum value!" },
  { id: 183, topic: "logic",      currentAnswer: "Rejected",                                                                  reasoning: "AND requires ALL true! 'already_voted' is TRUE, so NOT makes it FALSE - one condition fails, REJECTED!" },

  // ── History - Events & Causes ─────────────────────────────────────────────
  { id: 190, topic: "algorithms", currentAnswer: "Categorizing/filtering",                                                     reasoning: "Sorting events into groups based on type (cause vs effect) - that's categorization/filtering!" },
  { id: 191, topic: "algorithms", currentAnswer: "Filtering out irrelevant",                                                  reasoning: "Removing items that don't match your topic - filtering out the irrelevant ones!" },
  { id: 192, topic: "logic",      currentAnswer: "They're NOT linked",                                                        reasoning: "Condition requires year difference of 1! Since they're 2 years apart, condition fails - no link!" },
  { id: 193, topic: "algorithms", currentAnswer: "A list of pairs/dictionary",                                                reasoning: "Storing (cause, effect) pairs lets you look up effects by cause or reverse-lookup!" },
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
