import type { Recipe, RecipeIngredient, Ingredient, MenuItem, Week } from '@prisma/client'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'

export type RecipeWithIngredients = Recipe & {
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
  menuItems: (MenuItem & { week: Week })[]
}

export interface IRecipesRepository {
  findAll(): Promise<RecipeWithIngredients[]>
  findById(id: string): Promise<RecipeWithIngredients | null>
  create(data: RecipeInput): Promise<RecipeWithIngredients>
  update(id: string, data: RecipeInput): Promise<RecipeWithIngredients>
  softDelete(id: string): Promise<void>
  hasActiveOrders(id: string): Promise<boolean>
}
