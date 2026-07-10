export type Step = {
  id: string;
  recipe_id: string;
  title: string;
  ingredients: string;
  scale: string;
  quantity: number;
  start_time: string | null;
  end_time: string | null;
  duration: number; // in minutes
  step_order: number;
};

export type Recipe = {
  id: string;
  name: string;
  category: string;
  created_at: string;
  steps: Step[];
};

export type StepInput = Omit<Step, 'id' | 'recipe_id'>;