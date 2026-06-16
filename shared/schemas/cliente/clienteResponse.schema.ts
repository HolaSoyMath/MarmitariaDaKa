import { z } from 'zod'
import { clientBase } from './clienteBase.schema'
import { groupResponse } from '../grupo/grupoResponse.schema'

export const clientResponse = clientBase
  .pick({ id: true, name: true, groupId: true })
  .extend({ group: groupResponse })

export type ClientResponse = z.infer<typeof clientResponse>
