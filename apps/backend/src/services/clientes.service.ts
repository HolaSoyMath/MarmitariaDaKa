import type { IClientsRepository, ClientWithGroup } from '../interfaces/clientes.interface'
import type { ClientInput } from '@marmitaria/schemas/cliente/clienteInput.schema'
import { NotFoundError } from '../lib/errors'

export class ClientsService {
  constructor(private repository: IClientsRepository) {}

  async listAll(): Promise<ClientWithGroup[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<ClientWithGroup> {
    const client = await this.repository.findById(id)
    if (!client) throw new NotFoundError('Client not found')
    return client
  }

  async create(data: ClientInput): Promise<ClientWithGroup> {
    return this.repository.create(data)
  }

  async update(id: string, data: ClientInput): Promise<ClientWithGroup> {
    await this.getById(id)
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    return this.repository.softDelete(id)
  }
}
