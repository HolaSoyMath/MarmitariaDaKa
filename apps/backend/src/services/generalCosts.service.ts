import type { IGeneralCostsRepository, GeneralCost } from '../interfaces/generalCosts.interface'
import type { GeneralCostInput } from '@marmitaria/schemas/generalCost/generalCostInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

export class GeneralCostsService {
  constructor(private repository: IGeneralCostsRepository) {}

  async getByWeek(weekId: string): Promise<GeneralCost[]> {
    return this.repository.findByWeek(weekId)
  }

  async create(data: GeneralCostInput): Promise<GeneralCost> {
    return this.repository.create(data)
  }

  async update(id: string, data: Partial<GeneralCostInput>): Promise<GeneralCost> {
    const cost = await this.repository.findById(id)
    if (!cost) throw new NotFoundError('Custo não encontrado')
    if (cost.type === 'gas_percentage') {
      throw new ConflictError('O custo de gás é calculado automaticamente e não pode ser editado')
    }
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<void> {
    const cost = await this.repository.findById(id)
    if (!cost) throw new NotFoundError('Custo não encontrado')
    if (cost.type === 'gas_percentage') {
      throw new ConflictError('O custo de gás é calculado automaticamente e não pode ser excluído')
    }
    await this.repository.softDelete(id)
  }
}
