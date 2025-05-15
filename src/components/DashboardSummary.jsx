import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function DashboardSummary({ tasks, streakData }) {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  const TrendingUpIcon = getIcon('TrendingUp');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const FlameIcon = getIcon('Flame');
  
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
  
  // Theme colors based on dark mode
  const textColor = isDarkMode ? '#cbd5e1' : '#1e293b';
  
  // Chart options
  const chartOptions = {
    chart: {
      type: 'radialBar',
      foreColor: textColor,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        track: { background: isDarkMode ? '#334155' : '#e2e8f0' },
        dataLabels: {
          name: { show: false },
          value: { fontSize: '24px', fontWeight: 600, formatter: function (val) { return Math.round(val) + '%' } }
        }
      }
    },
    colors: ['#6366f1'],
    stroke: { lineCap: 'round' }
  };

  // Streak progress chart options
  const streakChartOptions = {
    chart: {
      type: 'radialBar',
      foreColor: textColor,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        track: { background: isDarkMode ? '#334155' : '#e2e8f0' },
        dataLabels: {
          name: { show: false },
          value: { 
            fontSize: '24px', 
            fontWeight: 600, 
            formatter: function (val) { return streakData.currentStreak }
          }
        }
      }
    },
    colors: ['#f59e0b'], // Amber color for streaks
    stroke: { lineCap: 'round' }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <TrendingUpIcon className="mr-2 text-primary" size={20} />
        Productivity Summary
      </h2>
      
      <div className="flex flex-col md:flex-row md:divide-x dark:divide-surface-700">
        <div className="flex-1 flex justify-center items-center">
          <Chart 
            options={chartOptions} 
            series={[completionRate]} 
            type="radialBar" 
            height={200} 
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-center mt-4 md:mt-0">
          <div className="flex items-center mb-3">
            <CheckCircleIcon className="text-green-500 mr-2" size={20} />
            <div>
              <p className="text-lg font-semibold">{completedTasks} Tasks Completed</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {completionRate > 0 ? `That's ${Math.round(completionRate)}% of your tasks` : 'Start completing tasks'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <ClockIcon className="text-accent mr-2" size={20} />
            <div>
              <p className="text-lg font-semibold">{pendingTasks} Tasks Pending</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {pendingTasks > 0 ? `Focus on completing these tasks` : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 mt-6 md:mt-0 md:pl-4 pt-6 md:pt-0 border-t md:border-t-0 border-surface-200 dark:border-surface-700">
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center mb-2">
              <FlameIcon className="text-amber-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold">Streak Stats</h3>
            </div>
            
            <Chart 
              options={streakChartOptions} 
              series={[streakData.currentStreak > 0 ? 100 : 0]} 
              type="radialBar" 
              height={120} 
              width={100}
            />
            
            <div className="text-center">
              <p className="text-sm text-surface-500 dark:text-surface-400">DAY STREAK</p>
              <p className="text-sm mt-2">
                Highest streak: <span className="font-semibold">{streakData.highestStreak}</span> days
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
}

export default DashboardSummary;