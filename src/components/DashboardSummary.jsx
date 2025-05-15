import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function DashboardSummary({ tasks }) {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  const TrendingUpIcon = getIcon('TrendingUp');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  
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
      
      <div className="flex flex-col md:flex-row">
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
      </div>
    </motion.div>
  );
}

export default DashboardSummary;