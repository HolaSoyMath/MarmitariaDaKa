'use client'

import { useState, useMemo } from 'react'
import { useWeek } from '@/context/WeekContext'
import { useOrders, useMarkProduced, useRevertToPending } from '@/hooks/useOrders'
import { useMenuItems } from '@/hooks/useMenuItems'
import { WeekTotalsCard } from '@/components/modules/home/WeekTotalsCard'
import { DishesCard } from '@/components/modules/home/DishesCard'
import { ClientOrdersAccordion } from '@/components/modules/home/ClientOrdersAccordion'
import { orderPixTotal, type DishSummary } from '@/components/modules/home/homeUtils'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'

export function HomeView() {
  const { currentWeek, isLoading: weekLoading } = useWeek()
  const weekId = currentWeek?.id ?? null

  const { data: orders = [], isLoading: ordersLoading } = useOrders(weekId)
  const { data: menuItems = [] } = useMenuItems(weekId)

  const markProduced = useMarkProduced()
  const revertToPending = useRevertToPending()

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleProducedToggle(order: OrderResponse) {
    if (order.status === 'paid') return
    if (order.status === 'produced') {
      revertToPending.mutate(order.id)
    } else {
      markProduced.mutate(order.id)
    }
  }

  const menuItemById = useMemo(
    () => new Map(menuItems.map((m) => [m.id, m])),
    [menuItems],
  )

  const totalQuantity = useMemo(
    () => orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0),
    [orders],
  )

  const pendingQuantity = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'pending')
        .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0),
    [orders],
  )

  const toReceiveCents = useMemo(
    () =>
      orders
        .filter((o) => o.status !== 'paid')
        .reduce((sum, o) => sum + orderPixTotal(o), 0),
    [orders],
  )

  const dishSlots = useMemo<(DishSummary | null)[]>(() => {
    const map = new Map<string, DishSummary>()
    for (const order of orders) {
      for (const item of order.items) {
        const menuItem = menuItemById.get(item.menuItemId)
        if (!menuItem) continue
        const existing = map.get(item.menuItemId)
        if (!existing) {
          map.set(item.menuItemId, {
            menuItemId: item.menuItemId,
            recipeName: menuItem.recipe.name,
            totalQty: item.quantity,
            sizes: [{ size: item.priceType.size, qty: item.quantity }],
          })
        } else {
          existing.totalQty += item.quantity
          const sizeEntry = existing.sizes.find((s) => s.size === item.priceType.size)
          if (sizeEntry) sizeEntry.qty += item.quantity
          else existing.sizes.push({ size: item.priceType.size, qty: item.quantity })
        }
      }
    }
    const sorted = Array.from(map.values()).sort((a, b) => b.totalQty - a.totalQty)
    const slots: (DishSummary | null)[] = sorted.slice(0, 4)
    while (slots.length < 4) slots.push(null)
    return slots
  }, [orders, menuItemById])

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4.5 items-stretch md:grid-cols-[310px_1fr]">
        <WeekTotalsCard
          totalQuantity={totalQuantity}
          pendingQuantity={pendingQuantity}
          toReceiveCents={toReceiveCents}
        />
        <DishesCard dishSlots={dishSlots} />
      </div>

      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="font-heading font-bold text-xl whitespace-nowrap tracking-tight">
          Clientes da semana
        </h2>
      </div>

      {weekLoading || ordersLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card rounded-sm">
          <p className="text-muted-foreground">Nenhum pedido nessa semana ainda.</p>
        </div>
      ) : (
        <ClientOrdersAccordion
          orders={orders}
          menuItemById={menuItemById}
          expandedIds={expandedIds}
          onToggleExpand={toggleExpanded}
          onProducedToggle={handleProducedToggle}
        />
      )}
    </div>
  )
}
