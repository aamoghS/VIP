import { NextResponse } from 'next/server';

const questionBank = [
  { id: 1, topic: 'variables', type: 'multiple-choice', question: 'Which variable type is best used to store a name like "Sona"?', options: ['int', 'boolean', 'String', 'float'], currentAnswer: 'String' },
  { id: 2, topic: 'logic', type: 'if-statement', question: 'If temperature = 30 and water freezes at 32, does the water freeze?', options: ['Yes', 'No'], currentAnswer: 'Yes' },
  { id: 3, topic: 'loops', type: 'fill-in-blank', question: 'Which loop is best used when you know exactly how many times you want to repeat an action?', options: ['while', 'do-while', 'for', 'if'], currentAnswer: 'for' },
  
  { id: 4, topic: 'math', type: 'multiple-choice', question: 'An angle that measures exactly 90 degrees is called a:', options: ['Acute Angle', 'Obtuse Angle', 'Right Angle', 'Straight Angle'], currentAnswer: 'Right Angle' },
  { id: 5, topic: 'math', type: 'categorization', question: 'Sort this shape based on its angles: It has four 90 degree angles and four equal sides.', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'], currentAnswer: 'Square' },
  
  { id: 6, topic: 'science', type: 'logic', question: 'Given the temperature is 32°F, will water freeze according to the rule: If temp <= 32 water will freeze?', options: ['True', 'False'], currentAnswer: 'True' },
  { id: 7, topic: 'science', type: 'multiple-choice', question: 'Which of these is NOT a primary rock type?', options: ['Igneous', 'Sedimentary', 'Metamorphic', 'Crystal'], currentAnswer: 'Crystal' },
  
  { id: 8, topic: 'ela', type: 'boolean', question: 'Is this a run-on sentence: "I love to write papers I would write one every day if I had the time."?', options: ['Yes', 'No'], currentAnswer: 'Yes' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  
  let filteredBank = questionBank;
  if (topic) {
    filteredBank = questionBank.filter(q => q.topic === topic);
  }

  if (filteredBank.length === 0) {
    return NextResponse.json({ error: 'No questions found for this topic.' }, { status: 404 });
  }
  
  const randomIndex = Math.floor(Math.random() * filteredBank.length);
  const selectedQuestion = { ...filteredBank[randomIndex] };
  
  return NextResponse.json(selectedQuestion);
}
