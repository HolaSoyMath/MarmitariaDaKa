import type { Recipe, RecipeIngredient, Ingredient, MenuItem, Week, RecipePriceType, PriceType } from '@prisma/client'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'

export type RecipeSizeWithIngredients = RecipePriceType & {
  priceType: PriceType
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
}

export type RecipeWithIngredients = Recipe & {
  priceTypes: RecipeSizeWithIngredients[]
  menuItems: (MenuItem & { week: Week })[]
}

export type RecipeIngredientWithCost = RecipeIngredient & {
  ingredient: Ingredient
  averageUnitCost: number | null
}

export type RecipeSizeWithCost = RecipePriceType & {
  priceType: PriceType
  ingredients: RecipeIngredientWithCost[]
}

export type RecipeWithCosts = Recipe & {
  priceTypes: RecipeSizeWithCost[]
  menuItems: (MenuItem & { week: Week })[]
}

export interface IRecipesRepository {
  findAll(): Promise<RecipeWithIngredients[]>
  findById(id: string): Promise<RecipeWithIngredients | null>
  findByName(name: string): Promise<RecipeWithIngredients | null>
  create(data: RecipeInput): Promise<RecipeWithIngredients>
  update(id: string, data: RecipeInput): Promise<RecipeWithIngredients>
  softDelete(id: string): Promise<void>
  setActive(id: string, active: boolean): Promise<RecipeWithIngredients>
  hasPendingOrders(id: string): Promise<boolean>
}
