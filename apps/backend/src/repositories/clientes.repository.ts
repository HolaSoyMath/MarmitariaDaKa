import { prisma } from '../lib/prisma'
import type { IClientsRepository, ClientWithGroup } from '../interfaces/clientes.interface'
import type { ClientInput } from '@marmitaria/schemas/cliente/clienteInput.schema'

export class ClientsRepository implements IClientsRepository {
  async findAll(): Promise<ClientWithGroup[]> {
    return prisma.client.findMany({ where: { deletedAt: null }, include: { group: true } })
  }

  async findById(id: string): Promise<ClientWithGroup | null> {
    return prisma.client.findFirst({ where: { id, deletedAt: null }, include: { group: true } })
  }

  async create(data: ClientInput): Promise<ClientWithGroup> {
    return prisma.client.create({
      data: { name: data.name, groupId: data.groupId },
      include: { group: true },
    })
  }

  async update(id: string, data: ClientInput): Promise<ClientWithGroup> {
    return prisma.client.update({
      where: { id },
      data: { name: data.name, groupId: data.groupId },
      include: { group: true },
    })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.client.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
