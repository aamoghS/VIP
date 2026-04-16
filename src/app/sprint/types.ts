export type QuizQuestion = {
  prompt: string;
  code?: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type SprintMission = {
  id: string;
  title: string;
  topic: string;
  topicIcon: string;
  topicColor: string;
  description: string;
  xpReward: number;
  groupA: {
    role: string;
    challenge: string;
    questions: QuizQuestion[];
  };
  groupB: {
    role: string;
    challenge: string;
    questions: QuizQuestion[];
  };
  handoffMessage: string;
  successMessage: string;
};

export type TeamResult = {
  questionsAnswered: number;
  questionsCorrect: number;
  points: number;
  completed: boolean;
};

export const freshTeam = (): TeamResult => ({
  questionsAnswered: 0,
  questionsCorrect: 0,
  points: 0,
  completed: false,
});
