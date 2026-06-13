import { z } from 'zod'
import { clientBase } from './clienteBase.schema'

export const clientInput = clientBase.pick({ nome: true, grupoId: true })
export type ClientInput = z.infer<typeof clientInput>
