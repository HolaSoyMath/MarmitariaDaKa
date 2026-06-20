import { GroupsService } from '../services/groups.service'
import type { GroupInput } from '@marmitaria/schemas/group/groupInput.schema'
import type { GroupResponse } from '@marmitaria/schemas/group/groupResponse.schema'

export class GroupsController {
  constructor(private service: GroupsService) {}

  private format({ id, name }: { id: string; name: string }): GroupResponse {
    return { id, name }
  }

  async listAll(): Promise<GroupResponse[]> {
    const groups = await this.service.listAll()
    return groups.map(g => this.format(g))
  }

  async getById(id: string): Promise<GroupResponse> {
    return this.format(await this.service.getById(id))
  }

  async create(data: GroupInput): Promise<GroupResponse> {
    return this.format(await this.service.create(data))
  }

  async update(id: string, data: GroupInput): Promise<GroupResponse> {
    return this.format(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
