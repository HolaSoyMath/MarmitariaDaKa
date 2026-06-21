import { prisma } from '../lib/prisma'
import type { Group } from '@prisma/client'
import type { IGroupsRepository } from '../interfaces/groups.interface'
import type { GroupInput } from '@marmitaria/schemas/group/groupInput.schema'

export class GroupsRepository implements IGroupsRepository {
  async findAll(): Promise<Group[]> {
    return prisma.group.findMany({ where: { deletedAt: null } })
  }

  async findById(id: string): Promise<Group | null> {
    return prisma.group.findFirst({ where: { id, deletedAt: null } })
  }

  async findByName(name: string): Promise<Group | null> {
    return prisma.group.findFirst({ where: { name, deletedAt: null } })
  }

  async create(data: GroupInput): Promise<Group> {
    return prisma.group.create({ data: { name: data.name } })
  }

  async update(id: string, data: GroupInput): Promise<Group> {
    return prisma.group.update({ where: { id }, data: { name: data.name } })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.client.updateMany({ where: { groupId: id, deletedAt: null }, data: { deletedAt: new Date() } }),
      prisma.group.update({ where: { id }, data: { deletedAt: new Date() } }),
    ])
  }
}
