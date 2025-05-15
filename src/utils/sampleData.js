/**
 * Sample task data for demonstration purposes
 * This is only used when a user has no existing tasks
 */

export const getSampleTasks = () => {
  return [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish writing the project proposal document and share with team for review.',
      category: 'work',
      priority: 'high',
      completed: false,
      bookmarked: true
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, fruits, and vegetables',
      category: 'shopping',
      priority: 'medium',
      completed: false,
      bookmarked: false
    },
    {
      id: '3',
      title: 'Schedule dentist appointment',
      description: 'Call dental clinic to schedule a check-up',
      category: 'personal',
      priority: 'low',
      completed: false,
      bookmarked: false
    },
    {
      id: '4',
      title: 'Exercise for 30 minutes',
      description: 'Go for a run or do home workout',
      category: 'personal',
      priority: 'medium',
      completed: true,
      bookmarked: false
    }
  ];
};

export default { getSampleTasks };