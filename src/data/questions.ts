export type Question = {
  id: number;
  topic: string;
  type: string;
  question: string;
  options: string[];
  currentAnswer: string;
  reasoning: string;
};