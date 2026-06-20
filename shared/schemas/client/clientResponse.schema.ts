import { z } from 'zod'
import { clientBase } from './clientBase.schema'
import { groupResponse } from '../group/groupResponse.schema'

export const clientResponse = clientBase
  .pick({ id: true, name: true, groupId: true })
  .extend({ group: groupResponse })

export type ClientResponse = z.infer<typeof clientResponse>
