import type { PriceType } from '@prisma/client'
import { PriceTypesService } from '../services/priceTypes.service'
import type { PriceTypeInput } from '@marmitaria/schemas/priceType/priceTypeInput.schema'
import type { PriceTypeResponse } from '@marmitaria/schemas/priceType/priceTypeResponse.schema'

export class PriceTypesController {
  constructor(private service: PriceTypesService) {}

  private format(pt: PriceType): PriceTypeResponse {
    return {
      id: pt.id,
      type: pt.type,
      size: pt.size,
      pixPrice: pt.pixPrice,
      swilePrice: pt.swilePrice,
      additionalCost: pt.additionalCost,
    }
  }

  async listAll(): Promise<PriceTypeResponse[]> {
    const pts = await this.service.listAll()
    return pts.map(pt => this.format(pt))
  }

  async getById(id: string): Promise<PriceTypeResponse> {
    return this.format(await this.service.getById(id))
  }

  async create(data: PriceTypeInput): Promise<PriceTypeResponse> {
    return this.format(await this.service.create(data))
  }

  async update(id: string, data: PriceTypeInput): Promise<PriceTypeResponse> {
    return this.format(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
