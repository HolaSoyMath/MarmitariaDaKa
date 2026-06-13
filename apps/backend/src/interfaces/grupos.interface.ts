import type { Group } from '@prisma/client'
import type { GroupInput } from '@marmitaria/schemas/grupo/grupoInput.schema'

export interface IGroupsRepository {
  findAll(): Promise<Group[]>
  findById(id: string): Promise<Group | null>
  create(data: GroupInput): Promise<Group>
  update(id: string, data: GroupInput): Promise<Group>
  softDelete(id: string): Promise<void>
}
