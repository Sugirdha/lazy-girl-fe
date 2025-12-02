import React from 'react';
import ButtonPill from './ButtonPill';
import EffortChip from './EffortChip';
import type { PlannerDay } from '../../api/planner';

interface SlotCardProps {
  meal: PlannerDay;
  onEdit: () => void;
  onCreate: () => void;
}

const getMealTitle = (slot: string): string => {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
};

const SlotCard: React.FC<SlotCardProps> = ({ meal, onEdit, onCreate }) => {
  const hasRecipe = meal.recipeName !== null;

  return (
    <div className="bg-neutral-50 rounded-xl pt-6 pb-6 pl-4 pr-2 h-40 flex flex-col">
      <h3 className="font-semibold text-gray-500 text-sm mb-1">
        {getMealTitle(meal.slot)}
      </h3>
      
      <div className="flex justify-between items-start flex-grow">
        <div className="flex flex-col justify-between h-full">
          {hasRecipe ? (
            <>
              <p className="text-gray-900 text-lg font-medium">
                {meal.recipeName}
              </p>
              <div className="flex items-center gap-3">
                {meal.totalCalories && <p className="text-sm text-gray-600">{meal.totalCalories} kcal</p>}
                <EffortChip level={meal.effortLevel} />
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-lg font-medium">No data</p>
          )}
        </div>
        
        <ButtonPill 
          variant={hasRecipe ? "outline" : "filled"} 
          onClick={hasRecipe ? onEdit : onCreate}
          className="w-16"
        >
          {hasRecipe ? 'Edit' : 'Create'}
        </ButtonPill>
      </div>
    </div>
  );
};
export default SlotCard;