export interface Ingredient {
  id: string;
  name: string;
  supplier: string;
  internal_reference: string;
  base_quantity: number;
  unit: string;
  packaging_info: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export interface GoodsIn {
  id: string;
  date: string;
  ingredient_id: string;
  supplier_batch_code: string;
  internal_batch_code: string;
  quantity_delivered: number;
  expiry_date: string;
  condition: string;
  temperature: number;
  corrective_actions?: string;
  employee_id: string;
}

export interface ProductionBatch {
  id: string;
  recipe_id: string;
  production_date: string;
  batch_multiplier: number;
  finished_packs?: number;
  notes?: string;
  employee_id: string;
  packaging_batch_number: string;
}

export interface BatchIngredient {
  id: string;
  batch_id: string;
  ingredient_id: string;
  internal_batch_codes: string[];
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'production';
} 