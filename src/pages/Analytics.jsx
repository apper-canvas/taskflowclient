import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';
import getIcon from '../utils/iconUtils';

function Analytics() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [categories, setCategories] = useState([
    { id: 'personal', name: 'Personal', color: '#6366f1' },
    { id: 'work', name: 'Work', color: '#f43f5e' },
    { id: 'shopping', name: 'Shopping', color: '#14b8a6' }
  ]);
  
  const [viewType, setViewType] = useState('weekly');
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  const BarChartIcon = getIcon('BarChart');
  const CalendarIcon = getIcon('Calendar');
  const TrendingUpIcon = getIcon('TrendingUp');
  const PieChartIcon = getIcon('PieChart');
  const ListIcon = getIcon('List');
  
  useEffect(() => {
    // Update dark mode status when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  // Category distribution data
  const categoryDistribution = categories.map(category => {
    const categoryTasks = tasks.filter(task => task.category === category.id).length;
    return {
      name: category.name,
      count: categoryTasks,
      color: category.color
    };
  });
  
  // Priority distribution data
  const priorityCount = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
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

  // Theme colors based on dark mode
  const textColor = isDarkMode ? '#cbd5e1' : '#1e293b';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  
  // Chart options
  const completionChartOptions = {
    chart: {
      type: 'radialBar',
      foreColor: textColor
    },
    plotOptions: {
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
      }
    },
    colors: ['#6366f1'],
    stroke: { lineCap: 'round' }
  };

  const categoryChartOptions = {
    chart: {
      foreColor: textColor
    },
    labels: categoryDistribution.map(cat => cat.name),
    colors: categoryDistribution.map(cat => cat.color),
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
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

  const priorityChartOptions = {
    chart: {
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
    grid: {
      borderColor: gridColor
    }
  };

  const weeklyChartOptions = {
    chart: {
      foreColor: textColor
    },
    colors: ['#14b8a6'],
    xaxis: {
      categories: weeklyCompletionData.map(d => d.x)
    },
    grid: {
      borderColor: gridColor
    }
  };

  return (
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
                series={[completionRate]} 
                type="radialBar" 
                height={300} 
              />
            </div>
            <div className="flex justify-between mt-4 text-center">
              <div className="flex-1">
                <p className="text-surface-500 text-sm">Completed</p>
                <p className="text-xl font-semibold text-primary">{completedTasks}</p>
              </div>
              <div className="flex-1">
                <p className="text-surface-500 text-sm">Pending</p>
                <p className="text-xl font-semibold text-accent">{pendingTasks}</p>
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
              series={categoryDistribution.map(cat => cat.count)} 
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
              Weekly Activity
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
  );
}

export default Analytics;