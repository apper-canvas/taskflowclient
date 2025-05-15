import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, getDay } from 'date-fns';
import { motion } from 'framer-motion';
import { getCalendarData } from '../utils/streakUtils';
import getIcon from '../utils/iconUtils';

function StreakCalendar({ streakData }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const CalendarIcon = getIcon('Calendar');
  const ChevronLeftIcon = getIcon('ChevronDown');
  const ChevronRightIcon = getIcon('ChevronUp');
  
  const monthData = getCalendarData(currentMonth, streakData.completedDates);
  const monthStart = startOfMonth(currentMonth);
  const startDay = getDay(monthStart);
  
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 card"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <CalendarIcon className="mr-2 text-primary" size={20} />
        Task Completion Calendar
      </h3>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
        >
          <ChevronLeftIcon size={20} className="transform rotate-90" />
        </button>
        
        <h4 className="text-md font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        
        <button 
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
        >
          <ChevronRightIcon size={20} className="transform rotate-90" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-surface-500 dark:text-surface-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for the days before the first day of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}
        
        {/* Days of the month */}
        {monthData.map(day => (
          <div
            key={day.formattedDate}
            className={`aspect-square flex items-center justify-center rounded-full relative text-sm ${
              day.isToday
                ? 'ring-2 ring-primary/50 dark:ring-primary/30'
                : ''
            }`}
          >
            <div
              className={`w-full h-full absolute rounded-full ${
                day.isCompleted
                  ? 'bg-green-500/20 dark:bg-green-500/30'
                  : ''
              }`}
            ></div>
            <span className="relative z-10">{day.dayOfMonth}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-surface-500 dark:text-surface-400">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500/20 dark:bg-green-500/30 mr-1"></div>
          <span>Task Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full ring-2 ring-primary/50 dark:ring-primary/30 mr-1"></div>
          <span>Today</span>
        </div>
      </div>
    </motion.div>
  );
}

export default StreakCalendar;