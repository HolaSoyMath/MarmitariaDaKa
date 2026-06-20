import type { Week } from '@prisma/client'
import { WeeksService } from '../services/weeks.service'
import type { WeekInput } from '@marmitaria/schemas/week/weekInput.schema'
import type { WeekResponse } from '@marmitaria/schemas/week/weekResponse.schema'

export class WeeksController {
  constructor(private service: WeeksService) {}

  private format(w: Week): WeekResponse {
    return { id: w.id, number: w.weekNumber, year: w.year }
  }

  async open(data: WeekInput): Promise<WeekResponse> {
    return this.format(await this.service.open(data))
  }

  async listAll(): Promise<WeekResponse[]> {
    const weeks = await this.service.listAll()
    return weeks.map(w => this.format(w))
  }

  async getById(id: string): Promise<WeekResponse> {
    return this.format(await this.service.getById(id))
  }
}
