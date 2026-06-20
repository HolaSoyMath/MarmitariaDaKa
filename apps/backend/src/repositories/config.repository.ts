import { prisma } from '../lib/prisma'
import type { IConfigRepository, Config } from '../interfaces/config.interface'
import type { ConfigInput } from '@marmitaria/schemas/config/configInput.schema'

export class ConfigRepository implements IConfigRepository {
  async getConfig(): Promise<Config> {
    const config = await prisma.config.findFirst()
    if (!config) throw new Error('Config not found. Seed the database with an initial Config record.')
    return config
  }

  async updateConfig(data: ConfigInput): Promise<Config> {
    const config = await this.getConfig()
    return prisma.config.update({ where: { id: config.id }, data })
  }
}
