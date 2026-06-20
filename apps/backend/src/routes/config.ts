import { Elysia } from 'elysia'
import { ConfigRepository } from '../repositories/config.repository'
import { configInput } from '@marmitaria/schemas/config/configInput.schema'

const repository = new ConfigRepository()

export const configRoutes = new Elysia({ prefix: '/config' })
  .get('/', () => repository.getConfig())
  .patch('/', ({ body }) => repository.updateConfig(configInput.parse(body)))
