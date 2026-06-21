import { prisma } from '../lib/prisma'
import type { IPriceTypesRepository } from '../interfaces/priceTypes.interface'
import type { PriceType } from '@prisma/client'
import type { PriceTypeInput } from '@marmitaria/schemas/priceType/priceTypeInput.schema'

export class PriceTypesRepository implements IPriceTypesRepository {
  async findAll(): Promise<PriceType[]> {
    return prisma.priceType.findMany({ where: { deletedAt: null } })
  }

  async findById(id: string): Promise<PriceType | null> {
    return prisma.priceType.findFirst({ where: { id, deletedAt: null } })
  }

  async findByTypeAndSize(type: string, size: string): Promise<PriceType | null> {
    return prisma.priceType.findFirst({ where: { type, size, deletedAt: null } })
  }

  async create(data: PriceTypeInput): Promise<PriceType> {
    return prisma.priceType.create({ data })
  }

  async update(id: string, data: PriceTypeInput): Promise<PriceType> {
    return prisma.priceType.update({ where: { id }, data })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.priceType.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
