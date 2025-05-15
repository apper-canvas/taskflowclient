import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { initializeStreakData, calculateStreak, completedTaskToday, isStreakAtRisk } from '../utils/streakUtils';
import { getSampleTasks } from '../utils/sampleData';
import MainFeature from '../components/MainFeature';
import DashboardSummary from '../components/DashboardSummary';
import ImportExportTasks from '../components/ImportExportTasks';
import StreakCalendar from '../components/StreakCalendar';

function Home() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks && JSON.parse(savedTasks).length > 0) {
      return JSON.parse(savedTasks);
    }
    return getSampleTasks(); // Use sample data for new users
  });
  
  const [streakData, setStreakData] = useState(() => {
    const savedStreakData = localStorage.getItem('streakData');
    return savedStreakData ? JSON.parse(savedStreakData) : initializeStreakData();
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([
    { id: 'personal', name: 'Personal', color: '#6366f1' },
    { id: 'work', name: 'Work', color: '#f43f5e' },
    { id: 'shopping', name: 'Shopping', color: '#14b8a6' }
  ]);

  const CheckCircleIcon = getIcon('CheckCircle');
  const CircleIcon = getIcon('Circle');
  const TrashIcon = getIcon('Trash');
  const LayersIcon = getIcon('Layers');
  const ListChecksIcon = getIcon('ListChecks');
  const FlameIcon = getIcon('Flame');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('streakData', JSON.stringify(streakData));
  }, [streakData]);
  
  // Check for streak at risk warning on page load
  useEffect(() => {
    if (isStreakAtRisk(streakData.lastCompletionDate, streakData.currentStreak)) {
      toast.warning(`Don't break your ${streakData.currentStreak} day streak! Complete a task today.`, {
        icon: <FlameIcon className="text-amber-500" />
      });
    }
  }, []);
  
  // Update streak when a task is completed
  const updateStreak = useCallback(() => {
    // Only update if not already completed today
    if (!completedTaskToday(streakData.lastCompletionDate)) {
      const today = new Date().toISOString().split('T')[0];
      const updatedCompletedDates = [...streakData.completedDates, today];
      
      const updatedStreakData = {
        lastCompletionDate: today,
        completedDates: updatedCompletedDates,
        currentStreak: calculateStreak(updatedCompletedDates, today),
        highestStreak: Math.max(streakData.highestStreak, calculateStreak(updatedCompletedDates, today))
      };
      
      setStreakData(updatedStreakData);
      return updatedStreakData.currentStreak;
    }
  }, [streakData]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully!');
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(task => task.id === id);
    if (!task.completed) {
      toast.success('Task completed! 🎉');
      
      // Update streak when a task is completed
      const newStreak = updateStreak();
      
      // Show streak milestone celebrations
      if (newStreak && newStreak > 1) {
        toast.success(`🔥 ${newStreak} day streak! Keep it up!`, {
          icon: <FlameIcon className="text-amber-500" />
        });
      }
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully!');
  };
  
  // Filter tasks based on selected category
  const filteredTasks = (() => {
    if (selectedCategory === 'all') return tasks;
    if (selectedCategory === 'streaks') 
      return completedTaskToday(streakData.lastCompletionDate) ? [] : tasks.filter(task => !task.completed);
    return tasks.filter(task => task.category === selectedCategory);
  })();
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen pt-16">
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-6 md:py-8 mt-2">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold flex items-center">
                <ListChecksIcon className="mr-2" size={28} />
                My Tasks
              </h1>
              <p className="text-primary-light mt-1">Manage your tasks effortlessly</p>
            </div>
            <div className="flex items-center space-x-2 text-sm bg-white/10 rounded-lg px-3 py-2">
              <CheckCircleIcon className="text-green-300" size={16} />
              <span>{completedTasks} of {tasks.length} tasks completed</span>
              <div className="w-20 h-2 bg-white/20 rounded-full ml-2">
                <div 
                  className="h-full bg-green-300 rounded-full transition-all duration-300" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <LayersIcon className="mr-2 text-primary" size={20} />
                Categories
              </h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === 'all' 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  All Tasks
                </button>
                
                <button 
                  onClick={() => setSelectedCategory('streaks')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center ${
                    selectedCategory === 'streaks' 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <span 
                    className="w-3 h-3 rounded-full mr-2 text-amber-500 flex items-center justify-center"
                  >
                    <FlameIcon size={16} />
                  </span>
                  Streaks</button>
                
                {categories.map(category => (
                  <button 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center ${
                      selectedCategory === category.id 
                        ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Task Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Total Tasks</span>
                    <span className="font-medium">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Completed</span>
                    <span className="font-medium">{completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Pending</span>
                    <span className="font-medium">{tasks.length - completedTasks}</span>
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">
                      Current Streak
                    </span>
                    <span className="font-medium flex items-center">
                      {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}
                      {streakData.currentStreak > 0 && (
                        <FlameIcon size={16} className="ml-1 text-amber-500" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 order-1 lg:order-2">
            <DashboardSummary 
              tasks={tasks} 
              streakData={streakData} 
            />
            
            <MainFeature 
              addTask={addTask}
              categories={categories} 
            />
            
            <ImportExportTasks 
              tasks={tasks}
              setTasks={setTasks}
            />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                {selectedCategory === 'all' ? 'All Tasks' : 
                 selectedCategory === 'streaks' ? 'Tasks for Today\'s Streak' : 
                 `${categories.find(c => c.id === selectedCategory)?.name} Tasks`}
              </h2>
              
              {filteredTasks.length === 0 ? (
                <div className="card flex flex-col items-center justify-center p-8 text-center">
                  <img 
                    src="https://source.unsplash.com/featured/300x200/?task,organize" 
                    alt="No tasks" 
                    className="w-40 h-40 object-cover rounded-lg mb-4 opacity-70"
                  />
                  <h3 className="text-xl font-medium mb-2">No tasks yet</h3>
                  <p className="text-surface-500 max-w-sm">
                    Create your first task using the form above to get started with managing your tasks.
                  </p>
                  {selectedCategory === 'streaks' && completedTaskToday(streakData.lastCompletionDate) && (
                    <div className="mt-4 text-green-500 font-medium flex items-center">
                      <CheckCircleIcon className="mr-2" size={20} /> You've already completed a task today! Streak is safe.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map(task => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`card p-4 transition-all ${
                        task.completed ? 'bg-surface-100 dark:bg-surface-800/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-1 flex-shrink-0 ${
                            task.completed ? 'text-green-500' : 'text-surface-400 hover:text-primary'
                          }`}
                        >
                          {task.completed ? <CheckCircleIcon size={20} /> : <CircleIcon size={20} />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className={`font-medium ${
                              task.completed ? 'line-through text-surface-500 dark:text-surface-400' : ''
                            }`}>
                              {task.title}
                            </h3>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="text-surface-400 hover:text-accent transition-colors"
                              aria-label="Delete task"
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                          
                          {task.description && (
                            <p className={`mt-1 text-sm ${
                              task.completed ? 'text-surface-500 dark:text-surface-500' : 'text-surface-600 dark:text-surface-300'
                            }`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <span 
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ 
                                  backgroundColor: categories.find(c => c.id === task.category)?.color || '#6366f1' 
                                }}
                              ></span>
                              <span className="text-xs text-surface-500 dark:text-surface-400">
                                {categories.find(c => c.id === task.category)?.name || 'Uncategorized'}
                              </span>
                            </div>
                            
                            <div className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Streak Calendar */}
              {selectedCategory === 'streaks' && (
                <StreakCalendar streakData={streakData} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;