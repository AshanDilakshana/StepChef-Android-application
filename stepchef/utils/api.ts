import { supabase } from './supabase';
import { Recipe, Step, StepInput } from './types';

// ─── RECIPES ──────────────────────────────────────────────────────────────────

/** Fetch all recipes with their steps, ordered by newest first */
export const getRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, steps(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Sort steps by step_order within each recipe
  return (data ?? []).map((r: any) => ({
    ...r,
    steps: (r.steps ?? []).sort((a: Step, b: Step) => a.step_order - b.step_order),
  }));
};

/** Fetch a single recipe with its steps */
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, steps(*)')
    .eq('id', id)
    .single();

  if (error) return null;

  return {
    ...data,
    steps: (data.steps ?? []).sort((a: Step, b: Step) => a.step_order - b.step_order),
  };
};

/** Save a new recipe with its steps */
export const saveRecipe = async (
  name: string,
  category: string,
  steps: StepInput[]
): Promise<Recipe> => {
  // 1. Insert recipe
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({ name: name.trim(), category })
    .select()
    .single();

  if (recipeError) throw recipeError;

  // 2. Insert steps linked to the recipe
  if (steps.length > 0) {
    const stepsWithId = steps.map((s, i) => ({
      ...s,
      recipe_id: recipeData.id,
      step_order: i,
    }));

    const { error: stepsError } = await supabase.from('steps').insert(stepsWithId);
    if (stepsError) throw stepsError;
  }

  // 3. Return the full recipe
  return getRecipeById(recipeData.id) as Promise<Recipe>;
};

/** Delete a recipe (steps are deleted automatically via CASCADE) */
export const deleteRecipe = async (id: string): Promise<void> => {
  const { error } = await supabase.from('recipes').delete().eq('id', id);
  if (error) throw error;
};
