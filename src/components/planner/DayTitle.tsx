import React from 'react';
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';

interface DayTitleProps {
  date: Date;
}

const DayTitle: React.FC<DayTitleProps> = ({ date }) => {
  let title = '';
  
  if (isToday(date)) {
    title = 'Today';
  } else if (isYesterday(date)) {
    title = 'Yesterday';
  } else if (isTomorrow(date)) {
    title = 'Tomorrow';
  } else {
    title = format(date, 'dd MMM yy');
  }

  return (
    <div className="mb-6 px-6">
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <span className="text-md font-medium text-gray-500">Meal Plan</span>
      </div>
    </div>
  );
};

export default DayTitle;
