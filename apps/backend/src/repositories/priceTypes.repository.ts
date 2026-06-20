import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import type { IPriceTypesRepository } from '../interfaces/priceTypes.interface'
import type { PriceType } from '@prisma/client'
import type { PriceTypeInput } from '@marmitaria/schemas/priceType/priceTypeInput.schema'
import { ConflictError } from '../lib/errors'

export class PriceTypesRepository implements IPriceTypesRepository {
  async findAll(): Promise<PriceType[]> {
    return prisma.priceType.findMany({ where: { deletedAt: null } })
  }

  async findById(id: string): Promise<PriceType | null> {
    return prisma.priceType.findFirst({ where: { id, deletedAt: null } })
  }

  async create(data: PriceTypeInput): Promise<PriceType> {
    try {
      return await prisma.priceType.create({ data })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictError('Tipo e tamanho já cadastrados')
      }
      throw e
    }
  }

  async update(id: string, data: PriceTypeInput): Promise<PriceType> {
    try {
      return await prisma.priceType.update({ where: { id }, data })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictError('Tipo e tamanho já cadastrados')
      }
      throw e
    }
  }

  async softDelete(id: string): Promise<void> {
    await prisma.priceType.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
