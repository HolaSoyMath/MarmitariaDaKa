import type { Config } from '@prisma/client'
import type { ConfigInput } from '@marmitaria/schemas/config/configInput.schema'

export type { Config }

export interface IConfigRepository {
  getConfig(): Promise<Config>
  updateConfig(data: ConfigInput): Promise<Config>
}
