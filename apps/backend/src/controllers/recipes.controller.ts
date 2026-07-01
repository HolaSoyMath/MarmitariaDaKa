import { RecipesService } from '../services/recipes.service'
import type { RecipeWithIngredients } from '../interfaces/recipes.interface'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'

export class RecipesController {
  constructor(private service: RecipesService) {}

  private format(recipe: RecipeWithIngredients): RecipeResponse {
    const lastWeek = recipe.menuItems[0]?.week
    return {
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients.map(ri => ({
        ingredientId: ri.ingredientId,
        quantity: ri.quantity,
        ingredient: {
          id: ri.ingredient.id,
          name: ri.ingredient.name,
          unit: ri.ingredient.unit as IngredientResponse['unit'],
        },
      })),
      priceTypes: recipe.priceTypes.map(rpt => ({
        id: rpt.priceType.id,
        type: rpt.priceType.type,
        size: rpt.priceType.size,
        pixPrice: rpt.priceType.pixPrice,
        swilePrice: rpt.priceType.swilePrice,
      })),
      lastOnMenu: lastWeek
        ? `Semana ${lastWeek.weekNumber}/${lastWeek.year}`
        : null,
    }
  }

  async listAll(): Promise<RecipeResponse[]> {
    const recipes = await this.service.listAll()
    return recipes.map(r => this.format(r))
  }

  async getById(id: string): Promise<RecipeResponse> {
    return this.format(await this.service.getById(id))
  }

  async create(data: RecipeInput): Promise<RecipeResponse> {
    return this.format(await this.service.create(data))
  }

  async update(id: string, data: RecipeInput): Promise<RecipeResponse> {
    return this.format(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
