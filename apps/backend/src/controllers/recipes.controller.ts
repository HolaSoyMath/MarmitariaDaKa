import { RecipesService } from '../services/recipes.service'
import type { RecipeWithCosts } from '../interfaces/recipes.interface'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'

export class RecipesController {
  constructor(private service: RecipesService) {}

  private format(recipe: RecipeWithCosts): RecipeResponse {
    const lastWeek = recipe.menuItems[0]?.week

    const priceTypes = recipe.priceTypes.map(rpt => {
      const ingredients = rpt.ingredients.map(ri => {
        const averageCost = ri.averageUnitCost !== null
          ? Math.round(ri.averageUnitCost * ri.quantity)
          : null
        return {
          ingredientId: ri.ingredientId,
          quantity: ri.quantity,
          ingredient: {
            id: ri.ingredient.id,
            name: ri.ingredient.name,
            unit: ri.ingredient.unit as IngredientResponse['unit'],
          },
          averageUnitCost: ri.averageUnitCost,
          averageCost,
        }
      })

      const knownCosts = ingredients
        .map(i => i.averageCost)
        .filter((c): c is number => c !== null)
      const totalAverageCost = knownCosts.length > 0
        ? knownCosts.reduce((sum, c) => sum + c, 0)
        : null
      const hasMissingCost = ingredients.some(i => i.averageCost === null)

      return {
        id: rpt.priceType.id,
        type: rpt.priceType.type,
        size: rpt.priceType.size,
        pixPrice: rpt.priceType.pixPrice,
        swilePrice: rpt.priceType.swilePrice,
        ingredients,
        totalAverageCost,
        isPartialAverageCost: totalAverageCost !== null && hasMissingCost,
      }
    })

    return {
      id: recipe.id,
      name: recipe.name,
      active: recipe.active,
      priceTypes,
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

  async setActive(id: string, active: boolean): Promise<RecipeResponse> {
    return this.format(await this.service.setActive(id, active))
  }
}
