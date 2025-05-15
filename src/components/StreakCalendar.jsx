import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths } from 'date-fns';
import { getCalendarData } from '../utils/streakUtils';
import getIcon from '../utils/iconUtils';

function StreakCalendar({ streakData }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const ChevronRightIcon = getIcon('ChevronRight');
  const CalendarIcon = getIcon('Calendar');
  const FlameIcon = getIcon('Flame');

  const calendarData = getCalendarData(
    currentMonth, 
    streakData.completedDates || []
  );

  // Generate day headers (Sun, Mon, etc.)
  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Calculate day offset for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOffset = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Create a grid with empty cells for the offset days
  const calendarGrid = Array(firstDayOffset).fill(null).concat(calendarData);
  
  // Navigation handlers
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="mr-2 text-primary" size={20} />
          Streak Calendar
        </h2>
        <div className="flex items-center space-x-1">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <span className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {dayHeaders.map((day, i) => (
          <div 
            key={`header-${i}`} 
            className="text-center font-medium text-surface-500 text-sm py-1"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarGrid.map((day, i) => (
          <div 
            key={`day-${i}`} 
            className={`
              aspect-square flex items-center justify-center rounded-full text-sm relative
              ${!day ? 'invisible' : ''}
              ${day?.isToday ? 'border-2 border-primary' : ''}
            `}
          >
            {day && (
              <>
                <div 
                  className={`
                    h-full w-full absolute inset-0 rounded-full
                    ${day.isCompleted ? 'bg-primary/10 dark:bg-primary/20' : ''}
                  `}
                ></div>
                <span className="relative z-10">{day.dayOfMonth}</span>
                {day.isCompleted && (
                  <span className="absolute bottom-1 right-1 text-primary">
                    <FlameIcon size={10} />
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center gap-4 text-sm text-surface-500">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary/20 mr-1"></div>
          <span>Completed</span>
        </div>
      </div>
    </motion.div>
  );
}

export default StreakCalendar;