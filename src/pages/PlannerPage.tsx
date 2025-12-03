import { useState, useMemo } from 'react';
import { startOfToday, format, startOfWeek } from 'date-fns';
import { usePlannerWeek, useUpdatePlannerSlot } from '../api/planner';
import CalendarCarousel from '../components/planner/CalendarCarousel';
import DayTitle from '../components/planner/DayTitle';
import SlotCard from '../components/planner/SlotCard';
import { getCurrentWeekStartISO } from '../utils/dates';
import Modal from '../components/common/Modal';
import { useRecipes } from '../api/recipes';
import type { Recipe } from '../api/recipes';
import EffortChip from '../components/common/EffortChip';

function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [isRecipePickerOpen, setIsRecipePickerOpen] = useState(false);
  const [createSlot, setCreateSlot] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [effortFilter, setEffortFilter] = useState<'all' | Recipe['effortLevel']>('all');

  // Get the start of the week (Sunday) for the selected date
  const weekStart = useMemo(() => {
    return startOfWeek(selectedDate, { weekStartsOn: 0 }); // 0 = Sunday
  }, [selectedDate]);

  const { data: plannerData, isLoading: isPlannerLoading, isError: isPlannerError } = usePlannerWeek(getCurrentWeekStartISO(weekStart));
  const { mutate: updateSlot } = useUpdatePlannerSlot(getCurrentWeekStartISO(weekStart));
  const { data: recipes } = useRecipes();

  const mealSlots = useMemo(() => {
    const dayName = format(selectedDate, 'EEE').toLowerCase();
    return plannerData?.entries.filter(entry => entry.day === dayName);
  }, [plannerData, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEditMeal = (slot: string) => {
    handleCreateMeal(slot);
  };

  const handleCreateMeal = (slot: string) => {
    setCreateSlot(slot);
    setIsRecipePickerOpen(true);
  };

  const handleCloseRecipePicker = () => {
    setIsRecipePickerOpen(false);
    setCreateSlot(null);
    setSearchTerm('');
    setEffortFilter('all');
  };

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];

    return recipes.filter((recipe) => {
      const matchesEffort =
        effortFilter === 'all' || recipe.effortLevel === effortFilter;

      const normalizedSearch = searchTerm.trim().toLowerCase();
      if (!normalizedSearch) {
        return matchesEffort;
      }

      const inName = recipe.name.toLowerCase().includes(normalizedSearch);
      const inIngredients = recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(normalizedSearch),
      );

      return matchesEffort && (inName || inIngredients);
    });
  }, [recipes, searchTerm, effortFilter]);

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!createSlot) return;

    updateSlot({ day: format(selectedDate, 'EEE').toLowerCase(), slot: createSlot, recipeId: recipe.id });
    handleCloseRecipePicker();
  };

  if (isPlannerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading planner...</p>
      </div>
    );
  }

  if (isPlannerError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-600">Something went wrong loading your planner. Please try again.</p>
      </div>
    );
  }

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

      {/* Recipe picker modal for create flow */}
      <Modal
        isOpen={isRecipePickerOpen}
        onClose={handleCloseRecipePicker}
        title="Choose a recipe"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or ingredient..."
              className="w-full sm:w-2/3 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <select
              value={effortFilter}
              onChange={(e) =>
                setEffortFilter(e.target.value as 'all' | Recipe['effortLevel'])
              }
              className="w-full sm:w-1/3 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">All effort levels</option>
              <option value="low">Low effort</option>
              <option value="medium">Medium effort</option>
              <option value="high">High effort</option>
            </select>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3">
            {filteredRecipes.length === 0 ? (
              <p className="text-sm text-gray-500">
                {recipes && recipes.length > 0
                  ? 'No recipes match your search.'
                  : 'No recipes yet. Add some recipes first on the Recipes tab.'}
              </p>
            ) : (
              filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => handleSelectRecipe(recipe)}
                  className="w-full text-left rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {recipe.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {recipe.ingredients.join(', ')}
                      </p>
                    </div>
                    <EffortChip level={recipe.effortLevel} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PlannerPage;
