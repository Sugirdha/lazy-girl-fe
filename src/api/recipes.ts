import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "./client";

export type Recipe = {
    id: number;
    name: string;
    ingredients: string[];
    effortLevel: 'low' | 'medium' | 'high';
}

export type CreateRecipeInput = {
    name: string;
    ingredients: string[];
    effortLevel: Recipe['effortLevel'];
}

function getRecipes() {
    return apiGet<Recipe[]>('/recipes');
}

function getRecipeById(id: number) {
    return apiGet<Recipe>(`/recipes/${id}`);
}

function createRecipe(input: CreateRecipeInput) {
    return apiPost<CreateRecipeInput, Recipe>('/recipes', input);
}

export function useRecipes() {
    return useQuery({
        queryKey: ['recipes'],
        queryFn: getRecipes,
    });
}

export function useRecipe(id: number) {
    return useQuery({
        queryKey: ['recipes', id],
        queryFn: () => getRecipeById(id),
    });
}

export function useCreateRecipe() {
    const queryClient =  useQueryClient();
    return useMutation ({
        mutationFn: (input: CreateRecipeInput) => createRecipe(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['recipes'] });
        }
    });
}