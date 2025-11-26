import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from './client';
import type { Recipe } from './recipes';

export type PlannerDay = {
  day: string;
  slot: string;
  recipeId: number | null;
};

export type PlannerWeek = {
  startDate: string;
  entries: PlannerDay[];
};

export function getPlannerWeek(startDate: string) {
  return apiGet<PlannerWeek>(`/planner/week?startDate=${startDate}`);
}

export function usePlannerWeek(startDate: string) {
  return useQuery({
    queryKey: ['plannerWeek', startDate],
    queryFn: () => getPlannerWeek(startDate),
  });
}

type UpdatePlannerSlotBody = {
  startDate: string;
  day: string;
  slot: string;
  recipeId: number | null;
};

export function useUpdatePlannerSlot(startDate: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // what the component passes in (no startDate)
    mutationFn: (input: Omit<UpdatePlannerSlotBody, 'startDate'>) =>
      apiPost<UpdatePlannerSlotBody, PlannerWeek>('/planner/week/slot', {
        ...input,
        startDate,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['plannerWeek', startDate],
      });
    },
  });
}

export function findRecipeName(recipes: Recipe[] | undefined, recipeId: number | null): string {
    if (!recipes || recipeId === null) return 'No Recipe';
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'No Recipe';
}