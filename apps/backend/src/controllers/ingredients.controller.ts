import { IngredientsService } from '../services/ingredients.service'
import type { IngredientInput } from '@marmitaria/schemas/ingredient/ingredientInput.schema'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'

export class IngredientsController {
  constructor(private service: IngredientsService) {}

  private format({ id, name, unit }: { id: string; name: string; unit: string }): IngredientResponse {
    return { id, name, unit: unit as IngredientResponse['unit'] }
  }

  async listAll(): Promise<IngredientResponse[]> {
    const ingredients = await this.service.listAll()
    return ingredients.map(i => this.format(i))
  }

  async getById(id: string): Promise<IngredientResponse> {
    return this.format(await this.service.getById(id))
  }

  async search(query: string): Promise<IngredientResponse[]> {
    const ingredients = await this.service.search(query)
    return ingredients.map(i => this.format(i))
  }

  async create(data: IngredientInput): Promise<IngredientResponse> {
    return this.format(await this.service.create(data))
  }

  async update(id: string, data: IngredientInput): Promise<IngredientResponse> {
    return this.format(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
