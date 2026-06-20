import type { Week } from '@prisma/client'
import type { WeekInput } from '@marmitaria/schemas/week/weekInput.schema'

export interface IWeeksRepository {
  findAll(): Promise<Week[]>
  findById(id: string): Promise<Week | null>
  findByNumberAndYear(weekNumber: number, year: number): Promise<Week | null>
  create(data: WeekInput): Promise<Week>
}
