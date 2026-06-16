import { RecipesService } from '../services/receitas.service'
import type { RecipeWithIngredients } from '../interfaces/receitas.interface'
import type { RecipeInput } from '@marmitaria/schemas/receita/receitaInput.schema'
import type { RecipeResponse } from '@marmitaria/schemas/receita/receitaResponse.schema'
import type { IngredientResponse } from '@marmitaria/schemas/ingrediente/ingredienteResponse.schema'

export class RecipesController {
  constructor(private service: RecipesService) {}

  private format(recipe: RecipeWithIngredients): RecipeResponse {
    const lastWeek = recipe.menuItems[0]?.week
    return {
      id: recipe.id,
      nome: recipe.nome,
      ingredientes: recipe.ingredients.map(ri => ({
        ingredienteId: ri.ingredienteId,
        quantidade: ri.quantidade,
        ingrediente: {
          id: ri.ingredient.id,
          nome: ri.ingredient.nome,
          unidade: ri.ingredient.unidade as IngredientResponse['unidade'],
        },
      })),
      ultimaVezNoCardapio: lastWeek
        ? `Semana ${lastWeek.numeroSemana}/${lastWeek.ano}`
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
