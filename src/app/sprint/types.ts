export type Objective = 1 | 2 | 3 | 4;
export type Points = 1 | 2 | 3 | 5 | 8;

export type QuizQuestion = {
  prompt: string;
  code?: string;
  options: string[];
  answer: string;
  explanation: string;
  /** 1 trace loop + if, 2 fix boundary error, 3 explain why, 4 Agile */
  objective: Objective;
  /** Suggested story points (teams re-estimate in planning). */
  points: Points;
};

export type ExitTicket = { prompt: string; code?: string };

export type SprintMission = {
  id: string;
  title: string;
  topic: string;
  topicKey: string;
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
  exitTicket: ExitTicket;
  handoffMessage: string;
  successMessage: string;
};
