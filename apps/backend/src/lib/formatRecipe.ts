import type { RecipeWithCosts } from '../interfaces/recipes.interface'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'

export function formatRecipeWithCosts(recipe: RecipeWithCosts): RecipeResponse {
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
    const ingredientsCost = knownCosts.reduce((sum, c) => sum + c, 0)
    const hasMissingCost = ingredients.some(i => i.averageCost === null)
    const totalAverageCost = knownCosts.length > 0 || rpt.priceType.additionalCost > 0
      ? ingredientsCost + rpt.priceType.additionalCost
      : null

    return {
      id: rpt.priceType.id,
      type: rpt.priceType.type,
      size: rpt.priceType.size,
      pixPrice: rpt.priceType.pixPrice,
      swilePrice: rpt.priceType.swilePrice,
      additionalCost: rpt.priceType.additionalCost,
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
