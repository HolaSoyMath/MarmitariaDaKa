import { useState } from 'react'
import { useCreateOrder, useUpdateOrder, useDeleteOrder } from '@/hooks/useOrders'
import { useClients } from '@/hooks/useClients'
import { useMenuItems } from '@/hooks/useMenuItems'
import { usePriceTypes } from '@/hooks/usePriceTypes'
import { useWeek } from '@/context/WeekContext'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'
import type { PriceTypeResponse } from '@marmitaria/schemas/priceType/priceTypeResponse.schema'

export interface ItemRow {
  menuItemId: string
  priceTypeId: string
  quantity: string
}

function calculateRowTotals(rows: ItemRow[], priceTypes: PriceTypeResponse[]) {
  const pixTotal = rows.reduce((sum, r) => {
    const pt = priceTypes.find((p) => p.id === r.priceTypeId)
    const qty = Number(r.quantity)
    return sum + (pt && qty > 0 ? pt.pixPrice * qty : 0)
  }, 0)
  const swileTotal = rows.reduce((sum, r) => {
    const pt = priceTypes.find((p) => p.id === r.priceTypeId)
    const qty = Number(r.quantity)
    return sum + (pt && qty > 0 ? pt.swilePrice * qty : 0)
  }, 0)
  return { pixTotal, swileTotal }
}

export function useOrderSheet(
  order: OrderResponse | undefined,
  onOpenChange: (open: boolean) => void,
) {
  const isEditing = !!order
  const { currentWeek } = useWeek()

  const [clientId, setClientId] = useState(order?.clientId ?? '')
  const [rows, setRows] = useState<ItemRow[]>(
    order?.items.map((i) => ({
      menuItemId: i.menuItemId,
      priceTypeId: i.priceTypeId,
      quantity: String(i.quantity),
    })) ?? [{ menuItemId: '', priceTypeId: '', quantity: '' }],
  )
  const { data: clients = [] } = useClients()
  const { data: menuItems = [] } = useMenuItems(currentWeek?.id ?? null)
  const { data: priceTypes = [] } = usePriceTypes()

  const createOrder = useCreateOrder()
  const updateOrder = useUpdateOrder()
  const deleteOrder = useDeleteOrder()

  const isSaving = createOrder.isPending || updateOrder.isPending

  function addRow() {
    setRows((r) => [...r, { menuItemId: '', priceTypeId: '', quantity: '' }])
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index))
  }

  function updateRow(index: number, patch: Partial<ItemRow>) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function buildItems() {
    return rows
      .filter((r) => r.menuItemId && r.priceTypeId && Number(r.quantity) > 0)
      .map((r) => ({
        menuItemId: r.menuItemId,
        priceTypeId: r.priceTypeId,
        quantity: Number(r.quantity),
      }))
  }

  function isValid() {
    return !!clientId && buildItems().length > 0
  }

  async function handleSave() {
    if (!isValid() || !currentWeek) return
    const weekId = order?.weekId ?? currentWeek.id
    const payload = { weekId, clientId, items: buildItems() }
    if (isEditing) {
      await updateOrder.mutateAsync({ id: order.id, data: payload })
    } else {
      await createOrder.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  async function handleDelete() {
    if (!order) return
    await deleteOrder.mutateAsync(order.id)
    onOpenChange(false)
  }

  const clientsByGroup = clients.reduce<Record<string, typeof clients>>(
    (acc, client) => {
      const group = client.group.name
      if (!acc[group]) acc[group] = []
      acc[group].push(client)
      return acc
    },
    {},
  )

  const { pixTotal, swileTotal } = calculateRowTotals(rows, priceTypes)

  return {
    isEditing,
    clientId,
    setClientId,
    rows,
    addRow,
    removeRow,
    updateRow,
    isValid,
    isSaving,
    pixTotal,
    swileTotal,
    handleSave,
    handleDelete,
    clients,
    clientsByGroup,
    menuItems,
    priceTypes,
    deleteOrder,
  }
}
