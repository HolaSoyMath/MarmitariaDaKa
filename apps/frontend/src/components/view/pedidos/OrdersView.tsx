'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { OrderSheet } from '@/components/modules/pedidos/OrderSheet'
import {
  useOrders,
  useMarkProduced,
  useMarkPaid,
  useRevertToPending,
} from '@/hooks/useOrders'
import { useWeek } from '@/context/WeekContext'
import { formatCurrency } from '@/formatters/currency'
import { formatOrderItems } from '@/formatters/order'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'

const GRID = { gridTemplateColumns: '34px 1.25fr 2fr auto 64px', gap: '14px' }

function OrderCheck({
  checked,
  onChange,
  disabled = false,
  variant,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  variant: 'feito' | 'pago'
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'w-6 h-6 flex-none border-2 rounded-[7px] grid place-items-center transition-all cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'feito'
          ? checked
            ? 'bg-pix border-pix text-white'
            : 'bg-card border-border-strong hover:border-pix'
          : checked
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-card border-border-strong hover:border-primary',
      )}
    >
      {checked && <span className="text-[15px] font-extrabold leading-none">✓</span>}
    </button>
  )
}

function OrderValue({ order }: { order: OrderResponse }) {
  const pixTotal = order.items.reduce((s, i) => s + i.snapshotPixPrice * i.quantity, 0)
  const swileTotal = order.items.reduce((s, i) => s + i.snapshotSwilePrice * i.quantity, 0)

  if (order.status === 'paid' && order.paymentMethod) {
    const isPix = order.paymentMethod === 'Pix'
    const total = isPix ? pixTotal : swileTotal
    return (
      <span className={cn('font-semibold', isPix ? 'text-pix' : 'text-swile')}>
        {order.paymentMethod}{' '}
        <b className="font-heading font-extrabold text-[17px]">{formatCurrency(total)}</b>
      </span>
    )
  }

  return (
    <b className="font-heading font-extrabold text-[17px]">{formatCurrency(pixTotal)}</b>
  )
}

export function OrdersView() {
  const { currentWeek } = useWeek()
  const { data: orders = [], isLoading } = useOrders(currentWeek?.id ?? null)

  const markProduced = useMarkProduced()
  const markPaid = useMarkPaid()
  const revertToPending = useRevertToPending()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null)
  const [payDialogId, setPayDialogId] = useState<string | null>(null)
  const [unmarkDialogId, setUnmarkDialogId] = useState<string | null>(null)

  function openCreate() {
    setSelectedOrder(null)
    setSheetOpen(true)
  }

  function openEdit(order: OrderResponse) {
    setSelectedOrder(order)
    setSheetOpen(true)
  }

  function handleFeitoToggle(order: OrderResponse) {
    if (order.status === 'paid') return
    if (order.status === 'produced') {
      revertToPending.mutate(order.id)
    } else {
      markProduced.mutate(order.id)
    }
  }

  function handlePagoToggle(order: OrderResponse) {
    if (order.status === 'produced') {
      setPayDialogId(order.id)
    } else if (order.status === 'paid') {
      setUnmarkDialogId(order.id)
    }
  }

  function confirmPayment(paymentMethod: 'Pix' | 'Swile') {
    if (!payDialogId) return
    markPaid.mutate({ id: payDialogId, data: { paymentMethod } })
    setPayDialogId(null)
  }

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const unpaidCount = orders.filter((o) => o.status !== 'paid').length

  return (
    <div className="p-7.5 flex flex-col gap-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="font-heading font-bold text-xl whitespace-nowrap">Pedidos da semana</h2>
        {orders.length > 0 && (
          <span className="text-muted-foreground text-[13.5px]">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} · {pendingCount} a produzir ·{' '}
            {unpaidCount} a receber
          </span>
        )}
        <span className="flex-1" />
        <Button onClick={openCreate} disabled={!currentWeek}>
          <Plus /> Novo pedido
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Nenhum pedido nessa semana ainda.</p>
          <Button variant="outline" onClick={openCreate} disabled={!currentWeek}>
            <Plus /> Registrar primeiro pedido
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden" style={{ padding: '6px' }}>
          {/* Header */}
          <div className="grid px-4.5 py-3" style={GRID}>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint text-center whitespace-nowrap">
              ✓ feito
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
              Cliente
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
              Itens
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
              Valor
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint text-center">
              Pago
            </span>
          </div>

          {/* Linhas */}
          {orders.map((order) => {
            const isDone = order.status === 'produced' || order.status === 'paid'
            return (
              <div
                key={order.id}
                className={cn(
                  'grid items-center px-4.5 py-3.5 border-t border-border transition-colors',
                  isDone ? 'bg-pix-faint' : 'hover:bg-secondary',
                )}
                style={GRID}
              >
                {/* Feito */}
                <div className="flex justify-center">
                  <OrderCheck
                    checked={isDone}
                    onChange={() => handleFeitoToggle(order)}
                    disabled={order.status === 'paid'}
                    variant="feito"
                  />
                </div>

                {/* Cliente */}
                <button
                  type="button"
                  onClick={() => openEdit(order)}
                  disabled={order.status !== 'pending'}
                  className="text-left disabled:cursor-default cursor-pointer"
                >
                  <span className="text-[15px] font-bold block">{order.client.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mt-0.5 block">
                    {order.client.group.name}
                  </span>
                </button>

                {/* Itens */}
                <span
                  className={cn(
                    'text-[13.5px] text-muted-foreground',
                    isDone && 'line-through decoration-[1.5px] text-ink-faint',
                  )}
                >
                  {formatOrderItems(order)}
                </span>

                {/* Valor */}
                <OrderValue order={order} />

                {/* Pago */}
                <div className="flex justify-center">
                  <OrderCheck
                    checked={order.status === 'paid'}
                    onChange={() => handlePagoToggle(order)}
                    disabled={order.status === 'pending'}
                    variant="pago"
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dialog de método de pagamento */}
      <Dialog open={!!payDialogId} onOpenChange={(open) => !open && setPayDialogId(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Como foi pago?</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1 bg-pix hover:bg-pix/90 text-white cursor-pointer"
              onClick={() => confirmPayment('Pix')}
            >
              Pix
            </Button>
            <Button
              className="flex-1 bg-swile hover:bg-swile/90 text-white cursor-pointer"
              onClick={() => confirmPayment('Swile')}
            >
              Swile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!unmarkDialogId}
        onOpenChange={(open) => !open && setUnmarkDialogId(null)}
        title="Desmarcar pagamento?"
        description="O pedido voltará para pendente e o método de pagamento será removido."
        onConfirm={() => {
          if (unmarkDialogId) revertToPending.mutate(unmarkDialogId)
          setUnmarkDialogId(null)
        }}
        isPending={revertToPending.isPending}
      />

      <OrderSheet
        key={selectedOrder?.id ?? 'new'}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        order={selectedOrder ?? undefined}
      />
    </div>
  )
}
