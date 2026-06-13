import { z } from 'zod'

export const StatusPedidoEnum = z.enum(['pendente', 'produzido', 'pago'])
export type StatusPedido = z.infer<typeof StatusPedidoEnum>

export const MetodoPagamentoEnum = z.enum(['Pix', 'Swile'])
export type MetodoPagamento = z.infer<typeof MetodoPagamentoEnum>

export const UnidadeIngredienteEnum = z.enum(['g', 'kg', 'ml', 'L', 'un'])
export type UnidadeIngrediente = z.infer<typeof UnidadeIngredienteEnum>
