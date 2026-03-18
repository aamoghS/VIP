export type Question = {
  id: number;
  topic: string;
  type: string;
  question: string;
  options: string[];
  currentAnswer: string;
  reasoning: string;
};

export const questionBank: Question[] = [
  // VARIABLES
  { id: 1, topic: 'variables', type: 'multiple-choice', question: 'Which variable type is best used to store a name like "Sona"?', options: ['int', 'boolean', 'String', 'float'], currentAnswer: 'String', reasoning: 'A String is designed specifically to hold sequences of characters, like names or words.' },
  { id: 11, topic: 'variables', type: 'categorization', question: 'If you want to store a person\'s age (e.g., 14), which variable type should you use?', options: ['String', 'int', 'boolean', 'float'], currentAnswer: 'int', reasoning: 'An "int" (integer) is used for whole numbers without decimals, which is perfect for an age like 14.' },
  { id: 12, topic: 'variables', type: 'multiple-choice', question: 'Which of the following is an example of a float variable?', options: ['"Hello"', '42', '3.14', 'True'], currentAnswer: '3.14', reasoning: 'A float is a number that includes a decimal point, making 3.14 the correct choice.' },
  { id: 13, topic: 'variables', type: 'categorization', question: 'If you need to track whether a player has a key or not, what type is best?', options: ['double', 'String', 'int', 'boolean'], currentAnswer: 'boolean', reasoning: 'Booleans can only be True or False, making them ideal for tracking simple "yes or no" states like holding a key.' },

  // LOGIC & CONDITIONALS
  { id: 2, topic: 'logic', type: 'if-statement', question: 'If temperature = 30 and water freezes at 32, does the water freeze?', options: ['Yes', 'No'], currentAnswer: 'Yes', reasoning: '30 is less than 32, so the condition for freezing is met!' },
  { id: 21, topic: 'logic', type: 'multiple-choice', question: 'What does the "==" operator do in an if-statement?', options: ['Assigns a value', 'Checks for equality', 'Adds two numbers', 'Ends the program'], currentAnswer: 'Checks for equality', reasoning: 'The double equals (==) is a comparison operator that checks if the two sides are perfectly equal to each other.' },
  { id: 22, topic: 'logic', type: 'if-statement', question: 'If player_health <= 0, what should the game logically do?', options: ['Level Up', 'Game Over', 'Jump', 'Save Game'], currentAnswer: 'Game Over', reasoning: 'When health reaches zero or drops below it (<= 0), the typical logic is to end the game.' },
  { id: 23, topic: 'logic', type: 'multiple-choice', question: 'Which statement runs only if the primary "if" condition is false?', options: ['else', 'while', 'for', 'return'], currentAnswer: 'else', reasoning: 'An "else" block provides the fallback plan—it automatically runs if the preceding "if" statement turns out to be false.' },

  // LOOPS
  { id: 3, topic: 'loops', type: 'fill-in-blank', question: 'Which loop is best used when you know exactly how many times you want to repeat an action?', options: ['while', 'do-while', 'for', 'if'], currentAnswer: 'for', reasoning: 'A "for" loop is specifically structured to run a predetermined number of times, exactly suited for counting sequences.' },
  { id: 31, topic: 'loops', type: 'multiple-choice', question: 'Which loop runs continuously as long as a condition remains true?', options: ['for loop', 'while loop', 'switch statement', 'array'], currentAnswer: 'while loop', reasoning: 'A "while" loop keeps spinning endlessly in a circle until the specific condition it is checking finally becomes false.' },
  { id: 32, topic: 'loops', type: 'fill-in-blank', question: 'To skip to the next iteration of a loop without finishing the current one, you use the keyword:', options: ['break', 'stop', 'continue', 'next'], currentAnswer: 'continue', reasoning: 'The "continue" keyword acts as a "skip button," jumping directly back to the top of the loop for the next round.' },

  // MATH (ANGLES & GEOMETRY)
  { id: 4, topic: 'math', type: 'multiple-choice', question: 'An angle that measures exactly 90 degrees is called a:', options: ['Acute Angle', 'Obtuse Angle', 'Right Angle', 'Straight Angle'], currentAnswer: 'Right Angle', reasoning: 'A perfect 90-degree corner, like the corner of a square, is defined geometrically as a Right Angle.' },
  { id: 5, topic: 'math', type: 'categorization', question: 'Sort this shape based on its angles: It has four 90 degree angles and four equal sides.', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'], currentAnswer: 'Square', reasoning: 'A shape with perfectly equal sides AND perfectly square (90-degree) corners is definitively a Square.' },
  { id: 41, topic: 'math', type: 'multiple-choice', question: 'An angle measuring 45 degrees is considered:', options: ['Obtuse', 'Right', 'Acute', 'Reflex'], currentAnswer: 'Acute', reasoning: 'Any angle that is smaller/sharper than a 90-degree right angle is called an "Acute" angle.' },

  // SCIENCE
  { id: 6, topic: 'science', type: 'logic', question: 'Given the temperature is 32°F, will water freeze according to the rule: If temp <= 32 water will freeze?', options: ['True', 'False'], currentAnswer: 'True', reasoning: 'Because the rule uses "<=" (less than OR equal to), exactly 32 triggers the freezing action.' },
  { id: 7, topic: 'science', type: 'multiple-choice', question: 'Which of these is NOT a primary rock type?', options: ['Igneous', 'Sedimentary', 'Metamorphic', 'Crystal'], currentAnswer: 'Crystal', reasoning: 'Crystals are minerals, but the three primary rock classifications found in the rock cycle are Igneous, Sedimentary, and Metamorphic.' },
  { id: 61, topic: 'science', type: 'categorization', question: 'Which force pulls objects toward the center of the Earth?', options: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], currentAnswer: 'Gravity', reasoning: 'Gravity is the fundamental attractive force exerted by the Earth\'s massive core.' },

  // ELA / HISTORY
  { id: 8, topic: 'ela', type: 'boolean', question: 'Is this a run-on sentence: "I love to write papers I would write one every day if I had the time."?', options: ['Yes', 'No'], currentAnswer: 'Yes', reasoning: 'It fuses two complete independent clauses together without a conjunction or semicolon!' },
  { id: 81, topic: 'ela', type: 'multiple-choice', question: 'Which word is the adjective in this sentence? "The fast dog ran across the yard."', options: ['ran', 'dog', 'fast', 'yard'], currentAnswer: 'fast', reasoning: 'An adjective describes a noun. "Fast" is explicitly describing the noun "dog".' },
  { id: 82, topic: 'history', type: 'multiple-choice', question: 'In what year did the United States declare independence?', options: ['1776', '1492', '1812', '1620'], currentAnswer: '1776', reasoning: 'The Declaration of Independence was famously signed and adopted in July 1776.' },
];
