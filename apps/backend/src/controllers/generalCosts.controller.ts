import type { GeneralCostsService } from '../services/generalCosts.service'
import type { GeneralCostInput } from '@marmitaria/schemas/generalCost/generalCostInput.schema'
import type { GeneralCostResponse } from '@marmitaria/schemas/generalCost/generalCostResponse.schema'
import type { GeneralCost } from '@prisma/client'

export class GeneralCostsController {
  constructor(private service: GeneralCostsService) {}

  private format(cost: GeneralCost): GeneralCostResponse {
    return {
      id: cost.id,
      weekId: cost.weekId,
      description: cost.description,
      value: cost.value,
      automatic: cost.type === 'gas_percentage',
    }
  }

  async getByWeek(weekId: string): Promise<GeneralCostResponse[]> {
    const costs = await this.service.getByWeek(weekId)
    return costs.map(c => this.format(c))
  }

  async create(data: GeneralCostInput): Promise<GeneralCostResponse> {
    const cost = await this.service.create(data)
    return this.format(cost)
  }

  async update(id: string, data: Partial<GeneralCostInput>): Promise<GeneralCostResponse> {
    const cost = await this.service.update(id, data)
    return this.format(cost)
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
