import type { GeneralCost } from '@prisma/client'
import type { GeneralCostInput } from '@marmitaria/schemas/generalCost/generalCostInput.schema'

export type { GeneralCost }

export interface IGeneralCostsRepository {
  findByWeek(weekId: string): Promise<GeneralCost[]>
  findById(id: string): Promise<GeneralCost | null>
  create(data: GeneralCostInput): Promise<GeneralCost>
  update(id: string, data: Partial<GeneralCostInput>): Promise<GeneralCost>
  softDelete(id: string): Promise<void>
}
