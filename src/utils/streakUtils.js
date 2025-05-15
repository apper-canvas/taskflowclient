/**
 * Utility functions for managing user streaks
 */

/**
 * Initialize default streak data for new users
 * @returns {Object} Default streak data object
 */
export const initializeStreakData = () => {
  return {
    currentStreak: 0,
    highestStreak: 0,
    lastCompletionDate: null,
    completedDates: []
  };
};