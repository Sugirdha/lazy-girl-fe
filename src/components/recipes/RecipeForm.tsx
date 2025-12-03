import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import EffortChip from '../common/EffortChip';
import type { Recipe, CreateRecipeInput } from '../../api/recipes';

interface RecipeFormProps {
  initialData?: Omit<Recipe, 'id'>;
  onSubmit: (data: CreateRecipeInput) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function RecipeForm({ 
  initialData, 
  onSubmit, 
  isSubmitting, 
  onCancel 
}: RecipeFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || []);
  const [ingredientsInput, setIngredientsInput] = useState(initialData?.ingredients.join(', ') || '');
  const [effortLevel, setEffortLevel] = useState<'low' | 'medium' | 'high'>(initialData?.effortLevel || 'low');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || ingredients.length === 0) return;
    
    onSubmit({
      name: name.trim(),
      ingredients,
      effortLevel,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="recipe-name">
          Recipe Name
        </label>
        <input
          id="recipe-name"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Ten-Minute Chicken Rice Bowl"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="recipe-ingredients">
          Ingredients
          <span className="text-xs font-normal text-gray-500 ml-1">(comma or newline separated)</span>
        </label>
        <textarea
          id="recipe-ingredients"
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          value={ingredientsInput}
          onChange={(e) => {
            const value = e.target.value;
            setIngredientsInput(value);
            
            const ingredientsList = value
              .split(/[,\n]/)
              .map(ingredient => ingredient.trim())
              .filter(ingredient => ingredient.length > 0);
            
            setIngredients(ingredientsList);
          }}
          placeholder="e.g., 1 cup rice, 200g chicken breast, 2 tbsp soy sauce"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
        </p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="effort-level">
          Effort Level
        </label>
        <div className="mt-1">
          <select
            id="effort-level"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
            value={effortLevel}
            onChange={(e) => setEffortLevel(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Low (true Lazy Girl)</option>
            <option value="medium">Medium (worth the effort)</option>
            <option value="high">High (special days only)</option>
          </select>
        </div>
        <div className="mt-2">
          <EffortChip level={effortLevel} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || ingredients.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {initialData ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            <span className="flex items-center">
              <Plus size={16} className="mr-1.5" />
              {initialData ? 'Update Recipe' : 'Add Recipe'}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
