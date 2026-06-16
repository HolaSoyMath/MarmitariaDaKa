import type { Week } from '@prisma/client'
import type { WeekInput } from '@marmitaria/schemas/semana/semanaInput.schema'

export interface IWeeksRepository {
  findAll(): Promise<Week[]>
  findById(id: string): Promise<Week | null>
  findByNumberAndYear(weekNumber: number, year: number): Promise<Week | null>
  create(data: WeekInput): Promise<Week>
}
