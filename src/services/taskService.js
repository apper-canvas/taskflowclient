/**
 * Task Service - Handles all operations related to tasks
 * Uses ApperClient to interact with the database
 */

// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name from schema
const TASK_TABLE = 'task2';

/**
 * Fetch all tasks for the current user
 * @param {Object} filters - Optional filters for tasks
 * @returns {Promise} Promise resolving to tasks array
 */
export const fetchTasks = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Setup query parameters
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "category" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "completed" } },
        { Field: { Name: "bookmarked" } },
        { Field: { Name: "completion_date" } },
        { Field: { Name: "Owner" } },
        { Field: { Name: "CreatedOn" } }
      ],
      orderBy: [
        {
          field: "CreatedOn",
          direction: "DESC"
        }
      ]
    };
    
    // Add filter for the current user
    if (filters.userId) {
      params.where = [
        {
          fieldName: "Owner",
          Operator: "ExactMatch",
          values: [filters.userId]
        }
      ];
    }
    
    // Add category filter if specified
    if (filters.category && filters.category !== 'all' && filters.category !== 'streaks') {
      if (!params.where) params.where = [];
      params.where.push({
        fieldName: "category",
        Operator: "ExactMatch",
        values: [filters.category]
      });
    }
    
    const response = await apperClient.fetchRecords(TASK_TABLE, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    // Transform the records to match the expected structure in the application
    return response.data.map(task => ({
      id: task.Id.toString(), // Convert Id to string to match existing app expectations
      title: task.title || '',
      description: task.description || '',
      category: task.category || 'personal',
      priority: task.priority || 'medium',
      completed: task.completed || false,
      bookmarked: task.bookmarked || false,
      completion_date: task.completion_date || null,
      // Keep the original fields for internal use
      Id: task.Id,
      Owner: task.Owner
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data object
 * @returns {Promise} Promise resolving to created task
 */
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare the task data for the database
    const dbTask = {
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category,
      priority: taskData.priority,
      completed: false,
      bookmarked: taskData.bookmarked || false
    };
    
    const response = await apperClient.createRecord(TASK_TABLE, dbTask);
    
    if (!response || !response.data) {
      throw new Error("Failed to create task");
    }
    
    // Return the created task with the ID assigned by the database
    return {
      id: response.data.Id.toString(),
      ...taskData,
      Id: response.data.Id,
      completed: false
    };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {Object} taskData - Task data object with Id
 * @returns {Promise} Promise resolving to updated task
 */
export const updateTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Ensure we have the task ID
    if (!taskData.Id) {
      throw new Error("Task ID is required for updates");
    }
    
    // Prepare the task data for the database
    const dbTask = {
      Id: taskData.Id,
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category,
      priority: taskData.priority,
      completed: taskData.completed,
      bookmarked: taskData.bookmarked || false
    };
    
    // Add completion date if task is completed
    if (taskData.completed) {
      dbTask.completion_date = new Date().toISOString().split('T')[0];
    }
    
    const response = await apperClient.updateRecord(TASK_TABLE, dbTask);
    
    if (!response || !response.data) {
      throw new Error("Failed to update task");
    }
    
    // Return the updated task
    return {
      id: response.data.Id.toString(),
      ...taskData,
      Id: response.data.Id,
      completion_date: response.data.completion_date
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {String|Number} taskId - Task ID to delete
 * @returns {Promise} Promise resolving to success status
 */
export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare the delete parameters
    const params = {
      RecordIds: [parseInt(taskId)]
    };
    
    const response = await apperClient.deleteRecord(TASK_TABLE, params);
    
    if (!response || !response.success) {
      throw new Error("Failed to delete task");
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export default {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
};