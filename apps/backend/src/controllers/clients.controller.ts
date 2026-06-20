import { ClientsService } from '../services/clients.service'
import type { ClientInput } from '@marmitaria/schemas/client/clientInput.schema'
import type { ClientResponse } from '@marmitaria/schemas/client/clientResponse.schema'
import type { ClientWithGroup } from '../interfaces/clients.interface'

export class ClientsController {
  constructor(private service: ClientsService) {}

  private format({ id, name, groupId, group }: ClientWithGroup): ClientResponse {
    return { id, name, groupId, group: { id: group.id, name: group.name } }
  }

  async listAll(): Promise<ClientResponse[]> {
    const clients = await this.service.listAll()
    return clients.map(c => this.format(c))
  }

  async getById(id: string): Promise<ClientResponse> {
    return this.format(await this.service.getById(id))
  }

  async create(data: ClientInput): Promise<ClientResponse> {
    return this.format(await this.service.create(data))
  }

  async update(id: string, data: ClientInput): Promise<ClientResponse> {
    return this.format(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
