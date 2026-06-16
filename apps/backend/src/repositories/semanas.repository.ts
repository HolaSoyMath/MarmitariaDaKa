import { prisma } from '../lib/prisma'
import type { IWeeksRepository } from '../interfaces/semanas.interface'
import type { Week } from '@prisma/client'
import type { WeekInput } from '@marmitaria/schemas/semana/semanaInput.schema'

export class WeeksRepository implements IWeeksRepository {
  async findAll(): Promise<Week[]> {
    return prisma.week.findMany({
      where: { deletedAt: null },
      orderBy: [{ year: 'desc' as const }, { weekNumber: 'desc' as const }],
    })
  }

  async findById(id: string): Promise<Week | null> {
    return prisma.week.findFirst({ where: { id, deletedAt: null } })
  }

  async findByNumberAndYear(weekNumber: number, year: number): Promise<Week | null> {
    return prisma.week.findFirst({
      where: { weekNumber, year, deletedAt: null },
    })
  }

  async create(data: WeekInput): Promise<Week> {
    return prisma.week.create({
      data: { weekNumber: data.number, year: data.year },
    })
  }
}
