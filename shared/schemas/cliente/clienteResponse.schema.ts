import { z } from 'zod'
import { clienteBase } from './clienteBase.schema'
import { grupoResponse } from '../grupo/grupoResponse.schema'

export const clienteResponse = clienteBase
  .pick({ id: true, nome: true, grupoId: true })
  .extend({ grupo: grupoResponse })

export type ClienteResponse = z.infer<typeof clienteResponse>
