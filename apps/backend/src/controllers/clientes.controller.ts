import { ClientsService } from '../services/clientes.service'
import type { ClientInput } from '@marmitaria/schemas/cliente/clienteInput.schema'
import type { ClientResponse } from '@marmitaria/schemas/cliente/clienteResponse.schema'
import type { ClientWithGroup } from '../interfaces/clientes.interface'

export class ClientsController {
  constructor(private service: ClientsService) {}

  private format({ id, nome, grupoId, group }: ClientWithGroup): ClientResponse {
    return { id, nome, grupoId, group: { id: group.id, nome: group.nome } }
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
