/**
 * Sample task data for demonstration purposes
 * This provides realistic examples of tasks for new users
 */

// Get today's date in ISO format (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];

// Create dates for the past few days to simulate streak data
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayString = yesterday.toISOString().split('T')[0];

const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const twoDaysAgoString = twoDaysAgo.toISOString().split('T')[0];

/**
 * Generate sample tasks for demonstration
 * @returns {Array} Array of sample task objects
 */
export const getSampleTasks = () => {
  return [
    // Personal tasks
    {
      id: "sample-1",
      title: "Morning workout routine",
      description: "30 minutes of cardio followed by 15 minutes of stretching",
      category: "personal",
      priority: "high",
      completed: true,
      bookmarked: true,
      completedOn: yesterdayString
    },
    {
      id: "sample-2",
      title: "Plan weekend activities",
      description: "Research hiking trails and restaurant options for Saturday",
      category: "personal",
      priority: "medium",
      completed: false,
      bookmarked: false
    },
    {
      id: "sample-3",
      title: "Read 30 pages of current book",
      description: "Continue reading 'Atomic Habits' - Chapter 5",
      category: "personal",
      priority: "low",
      completed: false,
      bookmarked: true
    },
    
    // Work tasks
    {
      id: "sample-4",
      title: "Prepare quarterly report",
      description: "Compile sales data and create presentation for leadership meeting",
      category: "work",
      priority: "high",
      completed: false,
      bookmarked: true
    },
    {
      id: "sample-5",
      title: "Schedule team meeting",
      description: "Set up video call to discuss project milestones and blockers",
      category: "work",
      priority: "medium",
      completed: true,
      bookmarked: false,
      completedOn: twoDaysAgoString
    },
    {
      id: "sample-6",
      title: "Review pull requests",
      description: "Check code changes and provide feedback on recent submissions",
      category: "work",
      priority: "high",
      completed: false,
      bookmarked: false
    },
    
    // Shopping tasks
    {
      id: "sample-7",
      title: "Grocery shopping",
      description: "Buy fruits, vegetables, milk, eggs, and bread",
      category: "shopping",
      priority: "medium",
      completed: false,
      bookmarked: false
    }
  ];
};

export default getSampleTasks;