import type { PriceType } from '@prisma/client'
import type { IPriceTypesRepository } from '../interfaces/priceTypes.interface'
import type { PriceTypeInput } from '@marmitaria/schemas/priceType/priceTypeInput.schema'
import { NotFoundError } from '../lib/errors'

export class PriceTypesService {
  constructor(private repository: IPriceTypesRepository) {}

  async listAll(): Promise<PriceType[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<PriceType> {
    const pt = await this.repository.findById(id)
    if (!pt) throw new NotFoundError('Tipo de preço não encontrado')
    return pt
  }

  async create(data: PriceTypeInput): Promise<PriceType> {
    return this.repository.create(data)
  }

  async update(id: string, data: PriceTypeInput): Promise<PriceType> {
    await this.getById(id)
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    await this.repository.softDelete(id)
  }
}
