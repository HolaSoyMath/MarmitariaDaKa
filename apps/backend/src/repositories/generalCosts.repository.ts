import { prisma } from '../lib/prisma'
import type { IGeneralCostsRepository } from '../interfaces/generalCosts.interface'
import type { GeneralCost } from '@prisma/client'
import type { GeneralCostInput } from '@marmitaria/schemas/generalCost/generalCostInput.schema'

export class GeneralCostsRepository implements IGeneralCostsRepository {
  async findByWeek(weekId: string): Promise<GeneralCost[]> {
    return prisma.generalCost.findMany({
      where: { weekId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<GeneralCost | null> {
    return prisma.generalCost.findFirst({ where: { id, deletedAt: null } })
  }

  async create(data: GeneralCostInput): Promise<GeneralCost> {
    return prisma.generalCost.create({
      data: {
        weekId: data.weekId,
        description: data.description,
        value: data.value,
        type: 'fixo',
      },
    })
  }

  async update(id: string, data: Partial<GeneralCostInput>): Promise<GeneralCost> {
    return prisma.generalCost.update({
      where: { id },
      data: {
        ...(data.description !== undefined && { description: data.description }),
        ...(data.value !== undefined && { value: data.value }),
      },
    })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.generalCost.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
