/**
 * Streak Service - Handles all operations related to user streak records
 * Uses ApperClient to interact with the database
 */
import { initializeStreakData } from '../utils/streakUtils';

// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name from schema
const STREAK_TABLE = 'streak_record';

/**
 * Fetch streak record for the current user
 * @param {String} userId - User ID to fetch streak for
 * @returns {Promise} Promise resolving to streak data
 */
export const fetchStreakRecord = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch streak record");
    }
    
    const apperClient = getApperClient();
    
    // Setup query parameters to find streak record for this user
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "current_streak" } },
        { Field: { Name: "highest_streak" } },
        { Field: { Name: "last_completion_date" } },
        { Field: { Name: "completed_dates" } },
        { Field: { Name: "Owner" } }
      ],
      where: [
        {
          fieldName: "Owner",
          Operator: "ExactMatch",
          values: [userId]
        }
      ],
      pagingInfo: {
        limit: 1  // We only need one record per user
      }
    };
    
    const response = await apperClient.fetchRecords(STREAK_TABLE, params);
    
    // If no streak record exists, return the default initialized streak data
    if (!response || !response.data || response.data.length === 0) {
      return {
        ...initializeStreakData(),
        userId
      };
    }
    
    const streakRecord = response.data[0];
    
    // Transform the database record to the expected format in the application
    return {
      Id: streakRecord.Id,
      currentStreak: streakRecord.current_streak || 0,
      highestStreak: streakRecord.highest_streak || 0,
      lastCompletionDate: streakRecord.last_completion_date || null,
      completedDates: streakRecord.completed_dates || [],
      userId: streakRecord.Owner
    };
  } catch (error) {
    console.error("Error fetching streak record:", error);
    throw error;
  }
};

/**
 * Create a new streak record
 * @param {Object} streakData - Streak data object
 * @returns {Promise} Promise resolving to created streak record
 */
export const createStreakRecord = async (streakData) => {
  try {
    const apperClient = getApperClient();
    
    if (!streakData.userId) {
      throw new Error("User ID is required to create streak record");
    }
    
    // Prepare the streak data for the database
    const dbStreak = {
      Name: `Streak for ${streakData.userId}`,
      current_streak: streakData.currentStreak || 0,
      highest_streak: streakData.highestStreak || 0,
      last_completion_date: streakData.lastCompletionDate || null,
      completed_dates: streakData.completedDates || []
    };
    
    const response = await apperClient.createRecord(STREAK_TABLE, dbStreak);
    
    if (!response || !response.data) {
      throw new Error("Failed to create streak record");
    }
    
    // Return the created streak record with the ID assigned by the database
    return {
      Id: response.data.Id,
      currentStreak: response.data.current_streak || 0,
      highestStreak: response.data.highest_streak || 0,
      lastCompletionDate: response.data.last_completion_date || null,
      completedDates: response.data.completed_dates || [],
      userId: streakData.userId
    };
  } catch (error) {
    console.error("Error creating streak record:", error);
    throw error;
  }
};

/**
 * Update an existing streak record
 * @param {Object} streakData - Streak data object with Id
 * @returns {Promise} Promise resolving to updated streak record
 */
export const updateStreakRecord = async (streakData) => {
  try {
    const apperClient = getApperClient();
    
    // Ensure we have the streak record ID
    if (!streakData.Id) {
      throw new Error("Streak record ID is required for updates");
    }
    
    // Prepare the streak data for the database
    const dbStreak = {
      Id: streakData.Id,
      current_streak: streakData.currentStreak || 0,
      highest_streak: streakData.highestStreak || 0,
      last_completion_date: streakData.lastCompletionDate || null,
      completed_dates: streakData.completedDates || []
    };
    
    const response = await apperClient.updateRecord(STREAK_TABLE, dbStreak);
    
    if (!response || !response.data) {
      throw new Error("Failed to update streak record");
    }
    
    // Return the updated streak record
    return {
      Id: response.data.Id,
      currentStreak: response.data.current_streak || 0,
      highestStreak: response.data.highest_streak || 0,
      lastCompletionDate: response.data.last_completion_date || null,
      completedDates: response.data.completed_dates || [],
      userId: streakData.userId
    };
  } catch (error) {
    console.error("Error updating streak record:", error);
    throw error;
  }
};

/**
 * Get or create streak record for a user
 * @param {String} userId - User ID to get/create streak for
 * @returns {Promise} Promise resolving to streak data
 */
export const getOrCreateStreakRecord = async (userId) => {
  try {
    const streakRecord = await fetchStreakRecord(userId);
    
    // If the streak record doesn't have an ID, it's a new default record
    if (!streakRecord.Id) {
      return await createStreakRecord(streakRecord);
    }
    
    return streakRecord;
  } catch (error) {
    console.error("Error in getOrCreateStreakRecord:", error);
    throw error;
  }
};

export default {
  fetchStreakRecord,
  createStreakRecord,
  updateStreakRecord,
  getOrCreateStreakRecord
};