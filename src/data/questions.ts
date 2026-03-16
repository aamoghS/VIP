export type Question = {
  id: number;
  topic: string;
  type: string;
  question: string;
  options: string[];
  currentAnswer: string;
};

export const questionBank: Question[] = [
  // VARIABLES
  { id: 1, topic: 'variables', type: 'multiple-choice', question: 'Which variable type is best used to store a name like "Sona"?', options: ['int', 'boolean', 'String', 'float'], currentAnswer: 'String' },
  { id: 11, topic: 'variables', type: 'categorization', question: 'If you want to store a person\'s age (e.g., 14), which variable type should you use?', options: ['String', 'int', 'boolean', 'float'], currentAnswer: 'int' },
  { id: 12, topic: 'variables', type: 'multiple-choice', question: 'Which of the following is an example of a float variable?', options: ['"Hello"', '42', '3.14', 'True'], currentAnswer: '3.14' },
  { id: 13, topic: 'variables', type: 'categorization', question: 'If you need to track whether a player has a key or not, what type is best?', options: ['double', 'String', 'int', 'boolean'], currentAnswer: 'boolean' },

  // LOGIC & CONDITIONALS
  { id: 2, topic: 'logic', type: 'if-statement', question: 'If temperature = 30 and water freezes at 32, does the water freeze?', options: ['Yes', 'No'], currentAnswer: 'Yes' },
  { id: 21, topic: 'logic', type: 'multiple-choice', question: 'What does the "==" operator do in an if-statement?', options: ['Assigns a value', 'Checks for equality', 'Adds two numbers', 'Ends the program'], currentAnswer: 'Checks for equality' },
  { id: 22, topic: 'logic', type: 'if-statement', question: 'If player_health <= 0, what should the game logically do?', options: ['Level Up', 'Game Over', 'Jump', 'Save Game'], currentAnswer: 'Game Over' },
  { id: 23, topic: 'logic', type: 'multiple-choice', question: 'Which statement runs only if the primary "if" condition is false?', options: ['else', 'while', 'for', 'return'], currentAnswer: 'else' },

  // LOOPS
  { id: 3, topic: 'loops', type: 'fill-in-blank', question: 'Which loop is best used when you know exactly how many times you want to repeat an action?', options: ['while', 'do-while', 'for', 'if'], currentAnswer: 'for' },
  { id: 31, topic: 'loops', type: 'multiple-choice', question: 'Which loop runs continuously as long as a condition remains true?', options: ['for loop', 'while loop', 'switch statement', 'array'], currentAnswer: 'while loop' },
  { id: 32, topic: 'loops', type: 'fill-in-blank', question: 'To skip to the next iteration of a loop without finishing the current one, you use the keyword:', options: ['break', 'stop', 'continue', 'next'], currentAnswer: 'continue' },

  // MATH (ANGLES & GEOMETRY)
  { id: 4, topic: 'math', type: 'multiple-choice', question: 'An angle that measures exactly 90 degrees is called a:', options: ['Acute Angle', 'Obtuse Angle', 'Right Angle', 'Straight Angle'], currentAnswer: 'Right Angle' },
  { id: 5, topic: 'math', type: 'categorization', question: 'Sort this shape based on its angles: It has four 90 degree angles and four equal sides.', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'], currentAnswer: 'Square' },
  { id: 41, topic: 'math', type: 'multiple-choice', question: 'An angle measuring 45 degrees is considered:', options: ['Obtuse', 'Right', 'Acute', 'Reflex'], currentAnswer: 'Acute' },

  // SCIENCE
  { id: 6, topic: 'science', type: 'logic', question: 'Given the temperature is 32°F, will water freeze according to the rule: If temp <= 32 water will freeze?', options: ['True', 'False'], currentAnswer: 'True' },
  { id: 7, topic: 'science', type: 'multiple-choice', question: 'Which of these is NOT a primary rock type?', options: ['Igneous', 'Sedimentary', 'Metamorphic', 'Crystal'], currentAnswer: 'Crystal' },
  { id: 61, topic: 'science', type: 'categorization', question: 'Which force pulls objects toward the center of the Earth?', options: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], currentAnswer: 'Gravity' },

  // ELA / HISTORY
  { id: 8, topic: 'ela', type: 'boolean', question: 'Is this a run-on sentence: "I love to write papers I would write one every day if I had the time."?', options: ['Yes', 'No'], currentAnswer: 'Yes' },
  { id: 81, topic: 'ela', type: 'multiple-choice', question: 'Which word is the adjective in this sentence? "The fast dog ran across the yard."', options: ['ran', 'dog', 'fast', 'yard'], currentAnswer: 'fast' },
  { id: 82, topic: 'history', type: 'multiple-choice', question: 'In what year did the United States declare independence?', options: ['1776', '1492', '1812', '1620'], currentAnswer: '1776' },
];
