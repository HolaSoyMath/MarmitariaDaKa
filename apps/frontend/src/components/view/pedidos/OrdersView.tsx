'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { OrderSheet } from '@/components/modules/pedidos/OrderSheet'
import { OrdersTable } from '@/components/modules/pedidos/OrdersTable'
import {
  useOrders,
  useMarkProduced,
  useMarkPaid,
  useRevertToPending,
  useRevertToProduced,
} from '@/hooks/useOrders'
import { useWeek } from '@/context/WeekContext'
import { Plus } from 'lucide-react'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'

export function OrdersView() {
  const { currentWeek } = useWeek()
  const { data: orders = [], isLoading } = useOrders(currentWeek?.id ?? null)

  const markProduced = useMarkProduced()
  const markPaid = useMarkPaid()
  const revertToPending = useRevertToPending()
  const revertToProduced = useRevertToProduced()

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
        {orders.length > 0 && (
          <span className="text-muted-foreground text-[13.5px]">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} · {pendingCount} a produzir ·{' '}
            {unpaidCount} a receber
          </span>
        )}
        <span className="flex-1" />
        <Button onClick={openCreate} disabled={!currentWeek} className="rounded-sm">
          <Plus /> Novo pedido
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card rounded-sm">
          <p className="text-muted-foreground">Nenhum pedido nessa semana ainda.</p>
          <Button variant="outline" onClick={openCreate} disabled={!currentWeek} className="rounded-sm">
            <Plus /> Registrar primeiro pedido
          </Button>
        </div>
      ) : (
        <OrdersTable
          orders={orders}
          onFeitoToggle={handleFeitoToggle}
          onPagoToggle={handlePagoToggle}
          onEdit={openEdit}
        />
      )}

      {/* Dialog de método de pagamento */}
      <Dialog open={!!payDialogId} onOpenChange={(open) => !open && setPayDialogId(null)}>
        <DialogContent className="max-w-xs rounded-sm">
          <DialogHeader>
            <DialogTitle>Como foi pago?</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1 rounded-sm bg-pix hover:bg-pix/90 text-white cursor-pointer"
              onClick={() => confirmPayment('Pix')}
            >
              Pix
            </Button>
            <Button
              className="flex-1 rounded-sm bg-swile hover:bg-swile/90 text-white cursor-pointer"
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
        description="O pedido voltará para produzido e o método de pagamento será removido."
        onConfirm={() => {
          if (unmarkDialogId) revertToProduced.mutate(unmarkDialogId)
          setUnmarkDialogId(null)
        }}
        isPending={revertToProduced.isPending}
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
