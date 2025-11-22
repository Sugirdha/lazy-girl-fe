import { type FormEvent, useState } from 'react';
import { useCreateRecipe, useRecipes } from '../api/recipes';

function RecipesPage() {
  const { data, isLoading, isError } = useRecipes();
  const createRecipe = useCreateRecipe();

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [effortLevel, setEffortLevel] =
    useState<'low' | 'medium' | 'high'>('low');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || ingredients.length === 0) {
      return;
    }

    createRecipe.mutate(
      {
        name: name.trim(),
        ingredients,
        effortLevel,
      },
      {
        onSuccess: () => {
          setName('');
          setIngredients([]);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Recipes</h1>
        <p className="text-sm text-slate-600 mb-4">
          Your personal Lazy Girl recipe stash. Add, view, and manage your
          favorite quick recipes all in one place.
        </p>

        {isLoading && <p>Loading recipes…</p>}
        {isError && <p>Could not load recipes. Please try again.</p>}

        {!isLoading && !isError && (
          <ul className="space-y-2">
            {data && data.length > 0 ? (
              data.map((recipe) => (
                <li
                  key={recipe.id}
                  className="rounded-lg border bg-white px-3 py-2 text-sm flex justify-between">
                  <div>
                    <div className="font-medium">{recipe.name}</div>
                    <div className="text-xs text-slate-600">
                      Ingredients: {recipe.ingredients.join(', ')}
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-wide">
                    {recipe.effortLevel} effort
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-600">
                No recipes yet. Add your first one below.
              </li>
            )}
          </ul>
        )}
      </section>

      <section className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Add a quick recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="recipe-name">
              Name
            </label>
            <input
              id="recipe-name"
              className="rounded border px-2 py-1 text-sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Ten-Minute Chicken Rice Bowl"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium"
              htmlFor="recipe-main-ingredient">
              Ingredients
            </label>
            <input
              id="recipe-main-ingredient"
              className="rounded border px-2 py-1 text-sm"
              value={ingredients.join(', ')}
              onChange={(event) => setIngredients(event.target.value.split(',').map(i => i.trim()))}
              placeholder="e.g. rice, chicken, soy sauce"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="effort-level">
              Effort level
            </label>
            <select
              id="effort-level"
              className="rounded border px-2 py-1 text-sm"
              value={effortLevel}
              onChange={(event) =>
                setEffortLevel(event.target.value as 'low' | 'medium' | 'high')
              }>
              <option value="low">Low (true Lazy Girl)</option>
              <option value="medium">Medium</option>
              <option value="high">High (special days)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={createRecipe.isPending}
            className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60">
            {createRecipe.isPending ? 'Adding…' : 'Add recipe'}
          </button>

          {createRecipe.isError && (
            <p className="text-xs text-red-600">
              Could not add recipe. Please try again.
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

export default RecipesPage;
