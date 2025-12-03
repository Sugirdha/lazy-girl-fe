import React from 'react';
import { format } from 'date-fns';

interface DateChipProps {
  date: Date;
  isSelected: boolean;
  isToday?: boolean;
  onClick: (date: Date) => void;
  monthName?: string;
}

const DateChip: React.FC<DateChipProps> = ({ 
  date, 
  isSelected, 
  isToday = false, 
  onClick, 
  monthName 
}) => {
  const dayOfWeek = format(date, 'EEE');
  const dayOfMonth = format(date, 'd');

  const baseStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '3.5rem',
    height: '6rem',
    borderRadius: '2rem',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    padding: '0.20rem',
  };

  const selectedStyle = {
    ...baseStyle,
    backgroundColor: '#f97316',
    color: 'white',
  };

  const todayStyle = {
    ...baseStyle,
    border: '2px solid #f97316',
  };

  const normalStyle = {
    ...baseStyle,
    backgroundColor: 'white',
    color: '#1f2937',
  };

  const dayOfWeekStyle = {
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '0.2rem',
  };

  const dayOfMonthStyle = {
    fontSize: '1.725rem',
    fontWeight: 600,
  };

  const monthNameStyle = {
    fontSize: '0.625rem',
    fontWeight: 400,
    opacity: 0.7,
  };

  return (
    <div
      className={`date-chip ${isSelected ? 'date-chip--selected' : ''} ${isToday ? 'date-chip--today' : ''}`}
      style={isSelected ? selectedStyle : (isToday ? todayStyle : normalStyle)}
      onClick={() => onClick(date)}
      data-date={date.toISOString()}
    >
      <span style={dayOfWeekStyle}>{dayOfWeek}</span>
      <span style={dayOfMonthStyle}>{dayOfMonth}</span>
      {monthName && <span style={monthNameStyle}>{monthName}</span>}
    </div>
  );
};

export default DateChip;