import type { Week } from '@prisma/client'
import type { IWeeksRepository } from '../interfaces/semanas.interface'
import type { WeekInput } from '@marmitaria/schemas/semana/semanaInput.schema'
import { NotFoundError } from '../lib/errors'

export class WeeksService {
  constructor(private repository: IWeeksRepository) {}

  async open(data: WeekInput): Promise<Week> {
    const existing = await this.repository.findByNumberAndYear(data.number, data.year)
    if (existing) return existing
    return this.repository.create(data)
  }

  async listAll(): Promise<Week[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Week> {
    const week = await this.repository.findById(id)
    if (!week) throw new NotFoundError('Semana não encontrada')
    return week
  }
}
