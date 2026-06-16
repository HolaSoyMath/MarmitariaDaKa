import type { PriceType } from '@prisma/client'
import type { PriceTypeInput } from '@marmitaria/schemas/tipoPreco/tipoPrecoInput.schema'

export interface IPriceTypesRepository {
  findAll(): Promise<PriceType[]>
  findById(id: string): Promise<PriceType | null>
  create(data: PriceTypeInput): Promise<PriceType>
  update(id: string, data: PriceTypeInput): Promise<PriceType>
  softDelete(id: string): Promise<void>
}
