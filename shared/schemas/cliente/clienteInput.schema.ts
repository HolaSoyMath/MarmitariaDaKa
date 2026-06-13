import { z } from 'zod'
import { clienteBase } from './clienteBase.schema'

export const clienteInput = clienteBase.pick({ nome: true, grupoId: true })
export type ClienteInput = z.infer<typeof clienteInput>
