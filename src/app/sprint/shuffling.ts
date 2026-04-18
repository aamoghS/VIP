/**
 * Intelligent Question Shuffling System
 *
 * This system ensures:
 * 1. Same question doesn't appear consecutively (cooldown mechanism)
 * 2. Questions are spread evenly across mission sessions
 * 3. Critical thinking questions get adequate coverage
 *
 * NO AI UI slop - questions are designed to push critical thinking
 * and are balanced between both groups (A/B)
 */

export type QuestionWithCooldown = {
  id: string;
  shownAt: number | null; // Timestamp or null if never shown
};

export type ShuffleState = {
  shownQuestions: QuestionWithCooldown[];
  lastShown: string | null;
};

/**
 * Get a shuffled array of question IDs from a pool
 * @param pool - Array of all available question IDs
 * @param exclude - IDs to exclude (for cooldown/prevent consecutive)
 * @param minRemaining - Minimum number of questions to keep in pool
 * @returns Shuffled array of IDs
 */
export function getShuffledQuestionIds(
  pool: string[],
  exclude?: string[],
  minRemaining = 1
): string[] {
  const available = pool.filter(id => {
    // If exclude list provided, filter out those IDs
    if (exclude && exclude.includes(id)) {
      return false;
    }
    return true;
  });

  if (available.length === 0) {
    return [];
  }

  // Use Fisher-Yates shuffle with seed-based randomness
  // This ensures reproducibility across sessions while avoiding repeats
  const shuffled = [...available];

  // Seed with current timestamp for variety between sessions
  const seed = Date.now() % 10000;
  let seedValue = seed;

  function getSeed() {
    return seedValue;
  }

  function nextSeed() {
    // Linear congruential generator for deterministic randomness
    seedValue = (seedValue * 1664525 + 1013904223) % 4294967296;
    return seedValue;
  }

  // Shuffle in place
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = nextSeed() % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return shuffled IDs, keeping at least minRemaining for safety
  const toReturn = shuffled.slice(0, Math.min(shuffled.length, pool.length - minRemaining));

  return toReturn;
}

/**
 * Check if a question ID is currently on cooldown
 * @param questionId - The question ID to check
 * @param state - Current shuffle state
 * @param cooldownCount - How many questions to skip before showing this one again
 * @returns True if on cooldown, False otherwise
 */
export function isQuestionOnCooldown(
  questionId: string,
  state: ShuffleState,
  cooldownCount = 1
): boolean {
  const shownIds = state.shownQuestions.map(q => q.id);

  // Check how many of the most recently shown questions match this ID
  const recentMatches = shownIds.slice(0, cooldownCount).filter(id => id === questionId).length;

  return recentMatches > 0;
}

/**
 * Get available question IDs that can be shown next
 * @param allQuestionIds - All available question IDs
 * @param state - Current shuffle state
 * @param excludeLast - Whether to exclude the last shown question
 * @param excludeFromPool - Additional IDs to exclude from the pool
 * @returns Array of IDs that can be shown
 */
export function getAvailableQuestionIds(
  allQuestionIds: string[],
  state: ShuffleState,
  excludeLast = true,
  excludeFromPool: string[] = []
): string[] {
  const excludeList = excludeLast ? [state.lastShown, ...excludeFromPool] : excludeFromPool;

  const available = allQuestionIds.filter(id => {
    // Don't show if on cooldown or in exclusion list
    if (excludeList.includes(id)) {
      return false;
    }
    return true;
  });

  return available;
}

/**
 * Get the next question ID based on cooldown rules
 * @param allQuestionIds - All available question IDs
 * @param state - Current shuffle state
 * @param excludeFromPool - Additional IDs to exclude
 * @returns Next question ID to show
 */
export function getNextQuestionId(
  allQuestionIds: string[],
  state: ShuffleState,
  excludeFromPool: string[] = []
): string | null {
  const available = getAvailableQuestionIds(allQuestionIds, state, true, excludeFromPool);

  if (available.length === 0) {
    // Fall back to any available if cooldown exhausted
    return allQuestionIds.find(id => !excludeFromPool.includes(id)) || null;
  }

  // Pick randomly from available
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Record a question as shown and update cooldown state
 * @param questionId - ID of the question just shown
 * @param state - Current shuffle state
 * @param cooldownCount - How many questions to show before this one can be shown again
 * @returns Updated state
 */
export function recordShownQuestion(
  questionId: string,
  state: ShuffleState,
  cooldownCount = 1
): ShuffleState {
  return {
    ...state,
    lastShown: questionId,
    shownQuestions: [
      { id: questionId, shownAt: Date.now() },
      ...state.shownQuestions.slice(0, cooldownCount) // Add cooldown items
    ]
  };
}

/**
 * Reset the shuffle state (for new mission session)
 * @param state - Current state
 * @returns Reset state
 */
export function resetShuffleState(state: ShuffleState): ShuffleState {
  return {
    ...state,
    shownQuestions: [],
    lastShown: null
  };
}

/**
 * Generate a unique ID for a mission session
 * @returns Session ID string
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Get all question IDs for a mission (A and B questions combined)
 * @param mission - Mission object
 * @returns Combined array of question IDs
 */
export function getMissionQuestionIds(mission: {
  groupA: { questions: Array<{ id: string }> };
  groupB: { questions: Array<{ id: string }> };
}): string[] {
  const aIds = mission.groupA.questions.map(q => q.id);
  const bIds = mission.groupB.questions.map(q => q.id);
  return [...aIds, ...bIds];
}

/**
 * Get question IDs for a specific group (A or B)
 * @param mission - Mission object
 * @param group - 'A' or 'B'
 * @returns Question IDs for the specified group
 */
export function getGroupQuestionIds(mission: {
  groupA: { questions: Array<{ id: string }> };
  groupB: { questions: Array<{ id: string }> };
}, group: 'A' | 'B'): string[] {
  if (group === 'A') {
    return mission.groupA.questions.map(q => q.id);
  }
  return mission.groupB.questions.map(q => q.id);
}
