import { RecipesService } from '../services/recipes.service'
import { formatRecipeWithCosts } from '../lib/formatRecipe'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'

export class RecipesController {
  constructor(private service: RecipesService) {}

  async listAll(weekId?: string): Promise<RecipeResponse[]> {
    const recipes = await this.service.listAll(weekId)
    return recipes.map(r => formatRecipeWithCosts(r))
  }

  async getById(id: string, weekId?: string): Promise<RecipeResponse> {
    return formatRecipeWithCosts(await this.service.getById(id, weekId))
  }

  async create(data: RecipeInput): Promise<RecipeResponse> {
    return formatRecipeWithCosts(await this.service.create(data))
  }

  async update(id: string, data: RecipeInput): Promise<RecipeResponse> {
    return formatRecipeWithCosts(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }

  async setActive(id: string, active: boolean): Promise<RecipeResponse> {
    return formatRecipeWithCosts(await this.service.setActive(id, active))
  }
}
