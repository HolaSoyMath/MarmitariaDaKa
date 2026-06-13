import type { Group } from '@prisma/client'
import type { IGroupsRepository } from '../interfaces/grupos.interface'
import type { GroupInput } from '@marmitaria/schemas/grupo/grupoInput.schema'
import { NotFoundError } from '../lib/errors'

export class GroupsService {
  constructor(private repository: IGroupsRepository) {}

  async listAll(): Promise<Group[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Group> {
    const group = await this.repository.findById(id)
    if (!group) throw new NotFoundError('Group not found')
    return group
  }

  async create(data: GroupInput): Promise<Group> {
    return this.repository.create(data)
  }

  async update(id: string, data: GroupInput): Promise<Group> {
    await this.getById(id)
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    return this.repository.softDelete(id)
  }
}
