import type { Recipe, RecipeIngredient, Ingredient, MenuItem, Week, RecipePriceType, PriceType } from '@prisma/client'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'

export type RecipeWithIngredients = Recipe & {
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
  priceTypes: (RecipePriceType & { priceType: PriceType })[]
  menuItems: (MenuItem & { week: Week })[]
}

export interface IRecipesRepository {
  findAll(): Promise<RecipeWithIngredients[]>
  findById(id: string): Promise<RecipeWithIngredients | null>
  findByName(name: string): Promise<RecipeWithIngredients | null>
  create(data: RecipeInput): Promise<RecipeWithIngredients>
  update(id: string, data: RecipeInput): Promise<RecipeWithIngredients>
  softDelete(id: string): Promise<void>
  hasPendingOrders(id: string): Promise<boolean>
}
