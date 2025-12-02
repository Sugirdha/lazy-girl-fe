import { useState, useMemo } from 'react';
import { startOfToday, format } from 'date-fns';
import { usePlannerWeek, useUpdatePlannerSlot } from '../api/planner';
import CalendarCarousel from '../components/planner/CalendarCarousel';
import DayTitle from '../components/planner/DayTitle';
import SlotCard from '../components/planner/SlotCard';
import { getCurrentWeekStartISO } from '../utils/dates';

function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  
  const { data: plannerData, isLoading: isPlannerLoading, isError: isPlannerError } = usePlannerWeek(getCurrentWeekStartISO(selectedDate)); // TODO: handle loading and error states
  const { mutate: updateSlot } = useUpdatePlannerSlot(getCurrentWeekStartISO(selectedDate));

  const mealSlots = useMemo(() => {
    const dayName = format(selectedDate, 'EEE').toLowerCase();
    return plannerData?.entries.filter(entry => entry.day === dayName);
  }, [plannerData, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEditMeal = (slot: string) => {
    console.log(`Edit ${slot} meal`);
    
    const recipeId = 1; // placeholder - you would get this from user input
    updateSlot({ day: format(selectedDate, 'EEE').toLowerCase(), slot, recipeId });
  };

  const handleCreateMeal = (slot: string) => {
    console.log(`Create ${slot} meal`);
    // For create, we'll use the same edit handler but with a different flow
    // For now, just call edit to demonstrate the flow
    handleEditMeal(slot);
  };

  return (
    <div className="min-h-screen">
      {/* Calendar Carousel */}
      <div className="px-4 pt-2 pb-8">
        <CalendarCarousel 
          selectedDate={selectedDate} 
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Day Title */}
      <div className="p-1 space-y-4 bg-white/40 rounded-2xl">
        <DayTitle date={selectedDate} />
        <div className="space-y-4">
          {mealSlots?.map((meal) => (
            <SlotCard
              key={meal.slot}
              meal={meal}
              onEdit={() => handleEditMeal(meal.slot)}
              onCreate={() => handleCreateMeal(meal.slot)}
            />
          ))}
        </div>
      </div>
      </div>
  );
}

export default PlannerPage;
