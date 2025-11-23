import { useState } from "react";
import { getCurrentWeekStartISO } from "../utils/dates";
import { useRecipes } from "../api/recipes";
import { findRecipeName, usePlannerWeek, useUpdatePlannerSlot } from "../api/planner";

const DAY_LABELS: Record<string, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

function PlannerPage() {
  const [startDate] = useState<string>(getCurrentWeekStartISO());

  const {data: recipes, isLoading: isRecipesLoading, isError: isRecipesError} = useRecipes();
  const {data: plannerData, isLoading: isPlannerLoading, isError: isPlannerError} = usePlannerWeek(startDate);
  const {mutate: updateSlot, isPending: isUpdatePending} = useUpdatePlannerSlot(startDate);

  const recipeList = recipes ?? [];
  
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-semibold mb-1">Weekly Planner</h1>
        <p className="text-sm text-slate-600">
          Planner v0: choose a dinner recipe for each day of the week. We&apos;ll
          add leftovers and extra slots later.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Week starting: <span className="font-mono">{startDate}</span>
        </p>
      </header>

       {(isPlannerLoading || isRecipesLoading) && (
        <p>Loading planner…</p>
      )}

      {(isPlannerError || isRecipesError) && (
        <p className="text-sm text-red-600">
          Could not load planner or recipes. Please try again.
        </p>
      )}

      {plannerData && (
        <section className="mt-2">
          <div className="grid grid-cols-[80px,1fr] gap-3 text-sm">
            {plannerData.days.map((day) => (
              <div
                key={`${day.day}-${day.slot}`}
                className="contents"
              >
                <div className="pt-2 text-right font-medium">
                  {DAY_LABELS[day.day] ?? day.day}
                </div>
                <div>
                  <select
                    className="w-full rounded border bg-white px-2 py-1 text-sm"
                    value={day.recipeId != null ? day.recipeId.toString() : ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      const recipeId =
                        value === '' ? null : Number.parseInt(value, 10);
                      updateSlot({
                        day: day.day,
                        slot: day.slot,
                        recipeId,
                      });
                    }}
                  >
                    <option value="">
                      — No meal planned ({findRecipeName(recipes, null)})
                    </option>
                    {recipeList.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    {day.recipeId
                      ? `Planned: ${findRecipeName(recipes, day.recipeId)}`
                      : 'Nothing planned yet'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isUpdatePending && (
            <p className="text-xs text-slate-500 mt-1">Updating slot…</p>
          )}  
        </section>
      )}

    </div>
  );
}

export default PlannerPage;
