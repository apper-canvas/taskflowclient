import { motion } from 'framer-motion';
import { completedTaskToday, isStreakAtRisk } from '../utils/streakUtils';
import getIcon from '../utils/iconUtils';

function DashboardSummary({ tasks, streakData }) {
  // Icons
  const CheckCircleIcon = getIcon('CheckCircle');
  const FlameIcon = getIcon('Flame');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  
  // Task statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;
  
  // Calculate streak status
  const todayCompleted = completedTaskToday(streakData.lastCompletionDate);
  const streakRisk = isStreakAtRisk(streakData.lastCompletionDate, streakData.currentStreak);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-primary to-primary-dark text-white"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Current Streak</h3>
          <FlameIcon className="text-amber-300" size={20} />
        </div>
        <div className="flex items-baseline">
          <p className="text-3xl font-bold">{streakData.currentStreak}</p>
          <p className="ml-1 text-primary-light">days</p>
        </div>
        <div className="mt-2 text-sm text-primary-light">
          {streakData.currentStreak === 0 ? (
            <p>Start your streak by completing a task today!</p>
          ) : todayCompleted ? (
            <p className="flex items-center">
              <CheckCircleIcon className="inline mr-1 text-green-300" size={14} />
              You've completed a task today!
            </p>
          ) : streakRisk ? (
            <p className="text-amber-300">Complete a task today to keep your streak!</p>
          ) : (
            <p>Highest streak: {streakData.highestStreak} days</p>
          )}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Completion Rate</h3>
          <CheckCircleIcon className="text-green-500" size={20} />
        </div>
        <div className="flex items-baseline">
          <p className="text-3xl font-bold">
            {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
          </p>
        </div>
        <div className="flex justify-between mt-2 text-sm text-surface-600 dark:text-surface-400">
          <p>{completedTasks} completed</p>
          <p>{pendingTasks} pending</p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Priority Tasks</h3>
          <ArrowUpDownIcon className="text-accent" size={20} />
        </div>
        <div className="flex items-baseline">
          <p className="text-3xl font-bold">{highPriorityTasks}</p>
          <p className="ml-1 text-sm text-surface-600 dark:text-surface-400">high priority</p>
        </div>
        <div className="mt-2 text-sm text-surface-600 dark:text-surface-400">
          {highPriorityTasks > 0 ? (
            <p>You have {highPriorityTasks} high priority tasks to complete</p>
          ) : (
            <p>No high priority tasks pending. Great job!</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardSummary;