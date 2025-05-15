import { format, isToday, isSameDay, parseISO, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

/**
 * Utility functions for managing task completion streaks
 */

/**
 * Initialize streak data object
 * @returns {Object} Default streak object
 */
export const initializeStreakData = () => {
  return {
    currentStreak: 0,
    highestStreak: 0,
    lastCompletionDate: null,
    completedDates: []
  };
};

/**
 * Calculate current streak based on completion dates
 * @param {Array} completedDates - Array of dates when tasks were completed
 * @param {String} lastCompletionDate - Last date a task was completed
 * @returns {Number} Current streak count
 */
export const calculateStreak = (completedDates, lastCompletionDate) => {
  if (!lastCompletionDate || completedDates.length === 0) return 0;
  
  // If last completion wasn't today or yesterday, streak is broken
  const lastCompletionDateObj = parseISO(lastCompletionDate);
  const isStreakActive = isToday(lastCompletionDateObj) || 
                          isSameDay(lastCompletionDateObj, subDays(new Date(), 1));
  
  if (!isStreakActive) return 0;
  
  // Count consecutive days backwards
  let streak = 1;
  let currentDate = subDays(lastCompletionDateObj, 1);
  
  while (completedDates.some(date => isSameDay(parseISO(date), currentDate))) {
    streak++;
    currentDate = subDays(currentDate, 1);
  }
  
  return streak;
};

/**
 * Check if user completed a task today
 * @param {String} lastCompletionDate - Last date a task was completed
 * @returns {Boolean} Whether a task was completed today
 */
export const completedTaskToday = (lastCompletionDate) => {
  if (!lastCompletionDate) return false;
  return isToday(parseISO(lastCompletionDate));
};

/**
 * Check if user is at risk of breaking their streak
 * @param {String} lastCompletionDate - Last date a task was completed
 * @param {Number} currentStreak - Current streak count
 * @returns {Boolean} Whether streak is at risk
 */
export const isStreakAtRisk = (lastCompletionDate, currentStreak) => {
  if (!lastCompletionDate || currentStreak === 0) return false;
  const lastDate = parseISO(lastCompletionDate);
  return !isToday(lastDate) && isSameDay(lastDate, subDays(new Date(), 1));
};

/**
 * Get calendar data for a given month
 * @param {Date} date - Date to get month calendar for
 * @param {Array} completedDates - Array of dates when tasks were completed
 * @returns {Array} Calendar data for the month
 */
export const getCalendarData = (date, completedDates) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  return daysInMonth.map(day => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const isCompleted = completedDates.includes(formattedDate);
    
    return {
      date: day,
      formattedDate: formattedDate,
      dayOfMonth: parseInt(format(day, 'd')),
      isCompleted: isCompleted,
      isToday: isToday(day)
    };
  });
};

export default { initializeStreakData, calculateStreak, completedTaskToday, isStreakAtRisk, getCalendarData };