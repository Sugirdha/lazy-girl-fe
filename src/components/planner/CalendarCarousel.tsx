import { useRef, useState, useEffect, useCallback } from 'react';
import { 
  format, 
  addDays, 
  isSameDay, 
  addMonths, 
  subMonths, 
  differenceInDays,
  endOfMonth,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DateChip from './DateChip';

interface CalendarCarouselProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const CalendarCarousel: React.FC<CalendarCarouselProps> = ({ onDateSelect, selectedDate: externalSelectedDate }) => {
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(externalSelectedDate);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());

  // Generate visible dates around the selected date
  const generateVisibleDates = useCallback((centerDate: Date) => {
    const dates: Date[] = [];
    // Show 30 days total (15 before and 14 after the center date)
    for (let i = -15; i <= 14; i++) {
      dates.push(addDays(centerDate, i));
    }
    setVisibleDates(dates);
  }, []);

  // Scroll to the selected date when it changes
  const scrollToDate = useCallback((date: Date) => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const dateElements = container.getElementsByClassName('date-chip');
    const targetIndex = Array.from(dateElements).findIndex(el => {
      const dateStr = el.getAttribute('data-date');
      return dateStr && isSameDay(new Date(dateStr), date);
    });

    if (targetIndex !== -1) {
      const targetElement = dateElements[targetIndex] as HTMLElement;
      container.scrollTo({
        left: targetElement.offsetLeft - (container.offsetWidth - targetElement.offsetWidth) / 2,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle scroll end to update selected date
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    setIsScrolling(true);
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      if (carouselRef.current) {
        const container = carouselRef.current;
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        const dateElements = container.getElementsByClassName('date-chip');
        let closestDate = null;
        let minDistance = Infinity;

        Array.from(dateElements).forEach(el => {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.left + rect.width / 2;
          const distance = Math.abs(elementCenter - containerCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestDate = el.getAttribute('data-date');
          }
        });

        if (closestDate) {
          const newSelectedDate = new Date(closestDate);
          if (!isSameDay(newSelectedDate, internalSelectedDate)) {
            setInternalSelectedDate(newSelectedDate);
            onDateSelect(newSelectedDate);
            
            // If we're at the edge of the visible dates, generate new ones
            const visibleStart = visibleDates[0];
            const visibleEnd = visibleDates[visibleDates.length - 1];
            
            if (differenceInDays(newSelectedDate, visibleStart) < 3) {
              generateVisibleDates(addDays(visibleStart, -7));
            } else if (differenceInDays(visibleEnd, newSelectedDate) < 3) {
              generateVisibleDates(addDays(visibleEnd, -23));
            }
          }
        }
      }
    }, 150);
  }, [internalSelectedDate, onDateSelect, visibleDates, generateVisibleDates]);

  // Navigate to previous/next month
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    let newDate = direction === 'prev' 
      ? subMonths(internalSelectedDate, 1)
      : addMonths(internalSelectedDate, 1);

    // If the new month doesn't have the same day (e.g., Jan 31 -> Feb 28/29),
    // adjust to the last day of the target month
    if (newDate.getMonth() !== (direction === 'prev' 
      ? subMonths(internalSelectedDate, 1).getMonth() 
      : addMonths(internalSelectedDate, 1).getMonth())) {
      newDate = endOfMonth(newDate);
    }

    setInternalSelectedDate(newDate);
    onDateSelect(newDate);
    generateVisibleDates(newDate);
    
    // Scroll to the new date after a short delay to allow state updates
    setTimeout(() => {
      scrollToDate(newDate);
    }, 50);
  }, [internalSelectedDate, onDateSelect, generateVisibleDates, scrollToDate]);

  // Initialize with current date
  useEffect(() => {
    generateVisibleDates(internalSelectedDate);
    const timer = setTimeout(() => {
      scrollToDate(internalSelectedDate);
    }, 100);
    return () => clearTimeout(timer);
  }, [generateVisibleDates, internalSelectedDate, scrollToDate]);

  // Sync with external selected date
  useEffect(() => {
    if (!isSameDay(externalSelectedDate, internalSelectedDate) && !isScrolling) {
      setInternalSelectedDate(externalSelectedDate);
      generateVisibleDates(externalSelectedDate);
      scrollToDate(externalSelectedDate);
    }
  }, [externalSelectedDate, isScrolling, generateVisibleDates, scrollToDate, internalSelectedDate]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="py-4 max-w-[600px] mx-auto">
      <div className="relative flex items-center justify-center mb-4">
        <button 
          onClick={() => navigateMonth('prev')}
          className="absolute left-0 p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold">
          {format(internalSelectedDate, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={() => navigateMonth('next')}
          className="absolute right-0 p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
        onScroll={handleScroll}
      >
        {visibleDates.map((date) => (
          <div 
            key={date.toString()}
            className="flex-shrink-0"
          >
            <DateChip
              date={date}
              isSelected={isSameDay(date, internalSelectedDate)}
              isToday={isSameDay(date, today)}
              onClick={(clickedDate) => {
                setInternalSelectedDate(clickedDate);
                onDateSelect(clickedDate);
                scrollToDate(clickedDate);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCarousel;