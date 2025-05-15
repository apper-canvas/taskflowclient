import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';
import getIcon from '../utils/iconUtils';
import { fetchTasks } from '../services/taskService';

function Analytics() {
  const { user } = useSelector(state => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [categories] = useState([
    { id: 'personal', name: 'Personal', color: '#6366f1' },
    { id: 'work', name: 'Work', color: '#f43f5e' },
    { id: 'shopping', name: 'Shopping', color: '#14b8a6' }
  ]);
  
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  // Fetch tasks for the current user
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const tasksData = await fetchTasks({ userId: user.emailAddress });
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [user]);
  
  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      incomplete: tasks.filter(task => !task.completed).length,
      personal: tasks.filter(task => task.category === 'personal').length,
      work: tasks.filter(task => task.category === 'work').length,
      shopping: tasks.filter(task => task.category === 'shopping').length,
      highPriority: tasks.filter(task => task.priority === 'high').length,
      mediumPriority: tasks.filter(task => task.priority === 'medium').length,
      lowPriority: tasks.filter(task => task.priority === 'low').length,
      completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) : 0
    };
  }, [tasks]);

  // Loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-primary">Loading analytics data...</div>
    </div>;
  }
  
  const categoryChartOptions = useMemo(() => {
    return {
      chart: { 
        id: 'task-categories',
        foreColor: isDarkMode ? '#cbd5e1' : '#334155' 
      },
      labels: ['Personal', 'Work', 'Shopping'],
      colors: ['#4ade80', '#60a5fa', '#f97316'],
      legend: {
        position: 'bottom'
      }
    };
  }, [isDarkMode]);
  
  const categoryChartSeries = useMemo(() => {
    return [
      taskStats.personal, 
      taskStats.work, 
      taskStats.shopping
    ];
  }, [taskStats.personal, taskStats.work, taskStats.shopping]);

  // Theme-based colors for charts
  const textColor = isDarkMode ? '#cbd5e1' : '#334155';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  // Completion rate chart options
  const completionChartOptions = {
    chart: {
      foreColor: textColor
    },
      radialBar: {
        hollow: { size: '70%' },
        track: { background: isDarkMode ? '#334155' : '#e2e8f0' },
        dataLabels: {
          name: { show: false },
        value: {
            fontSize: '30px',
            fontWeight: 600,
          formatter: function (val) { return Math.round(val) + '%' }
          }
      }
    },
    colors: ['#6366f1'],
    stroke: { lineCap: 'round' }
  };
  
  // Priority distribution data
  const priorityCount = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  };
  
  const priorityChartOptions = {
    chart: {
      id: 'task-priorities',
      foreColor: textColor
    },
    colors: ['#f43f5e', '#fb923c', '#3b82f6'],
    xaxis: {
      categories: ['High', 'Medium', 'Low']
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: [textColor]
      }
    },
      formatter: function(val) {
        return Math.round(val) + '%';
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { height: 250 },
        legend: { position: 'bottom' }
      }
    }]
  };
  
  // Weekly task completion chart data
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyCompletionData = daysInWeek.map(day => {
    const dayTasks = tasks.filter(task => {
      // Simulating task completion dates for demo
      // In a real app, you would use actual task completion dates
      const taskDate = new Date(task.id); // Using task id as a proxy for timestamp
      return getDay(taskDate) === getDay(day) && task.completed;
    }).length;
    
    return {
      x: format(day, 'EEE'),
      y: dayTasks
    };
  });
  
  const weeklyChartOptions = {
    chart: { foreColor: textColor },
    colors: ['#14b8a6'],
    xaxis: { categories: weeklyCompletionData.map(d => d.x) },
    grid: { borderColor: gridColor }
  };

  // Get icons
  const BarChartIcon = getIcon('BarChart');
  const PieChartIcon = getIcon('PieChart');
  const TrendingUpIcon = getIcon('TrendingUp');
  const ListIcon = getIcon('List');
  const CalendarIcon = getIcon('Calendar');
  
  return (
    <>
    {error && (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          <p className="font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="text-primary underline mt-2">Retry</button>
        </div>
      </div>
    )}
    
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <BarChartIcon className="mr-2 text-primary" size={28} />
            Productivity Analytics
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Visualize your task completion patterns and productivity trends
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUpIcon className="mr-2 text-primary" size={20} />
              Task Completion Rate
            </h2>
            <div className="flex justify-center">
              <Chart 
                options={completionChartOptions} 
                series={[taskStats.completionRate]} 
                type="radialBar" 
                height={300} 
              />
            </div>
            <div className="flex justify-between mt-4 text-center">
              <div className="flex-1">
                <p className="text-surface-500 text-sm">Completed</p>
                <p className="text-xl font-semibold text-primary">{taskStats.completed}</p>
              </div>
              <div className="flex-1">
                <p className="text-surface-500 text-sm">Pending</p>
                <p className="text-xl font-semibold text-accent">{taskStats.incomplete}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PieChartIcon className="mr-2 text-primary" size={20} />
              Task Categories
            </h2>
            <Chart 
              options={categoryChartOptions} 
              series={categoryChartSeries} 
              type="pie" 
              height={300} 
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ListIcon className="mr-2 text-primary" size={20} />
              Task Priority Distribution
            </h2>
            <Chart 
              options={priorityChartOptions} 
              series={[{ name: 'Tasks', data: [priorityCount.high, priorityCount.medium, priorityCount.low] }]} 
              type="bar" 
              height={300} 
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CalendarIcon className="mr-2 text-primary" size={20} />
              Weekly Task Completion
            </h2>
            <Chart 
              options={weeklyChartOptions} 
              series={[{ name: 'Completed Tasks', data: weeklyCompletionData.map(d => d.y) }]} 
              type="line" 
              height={300} 
            />
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Analytics;