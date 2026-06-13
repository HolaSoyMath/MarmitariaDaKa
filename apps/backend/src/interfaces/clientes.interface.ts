import type { Client, Group } from '@prisma/client'
import type { ClientInput } from '@marmitaria/schemas/cliente/clienteInput.schema'

export type ClientWithGroup = Client & { group: Group }

export interface IClientsRepository {
  findAll(): Promise<ClientWithGroup[]>
  findById(id: string): Promise<ClientWithGroup | null>
  create(data: ClientInput): Promise<ClientWithGroup>
  update(id: string, data: ClientInput): Promise<ClientWithGroup>
  softDelete(id: string): Promise<void>
}
