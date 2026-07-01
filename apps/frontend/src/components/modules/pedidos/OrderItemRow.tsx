'use client'

import { SearchSelect } from '@/components/shared/SearchSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Minus, Trash } from 'lucide-react'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'
import type { PriceTypeResponse } from '@marmitaria/schemas/priceType/priceTypeResponse.schema'

export interface OrderRow {
  menuItemId: string
  priceTypeId: string
  quantity: string
}

interface OrderItemRowProps {
  row: OrderRow
  isOnly: boolean
  menuItems: MenuItemResponse[]
  priceTypes: PriceTypeResponse[]
  onRemove: () => void
  onUpdate: (patch: Partial<OrderRow>) => void
}

export function OrderItemRow({
  row,
  isOnly,
  menuItems,
  priceTypes,
  onRemove,
  onUpdate,
}: OrderItemRowProps) {
  const selectedMenuItem = menuItems.find((m) => m.id === row.menuItemId)
  const availablePriceTypes = selectedMenuItem?.priceTypes ?? []

  const rowPriceTypes =
    row.priceTypeId && !availablePriceTypes.some((pt) => pt.id === row.priceTypeId)
      ? [
          ...availablePriceTypes,
          ...priceTypes.filter((pt) => pt.id === row.priceTypeId),
        ]
      : availablePriceTypes

  return (
    <div className="border border-border rounded-sm p-3.5 flex flex-col gap-3 bg-card">
      <div className="flex gap-2 items-center">
        <SearchSelect
          value={row.menuItemId}
          onValueChange={(v) => {
            const validIds = menuItems.find((m) => m.id === v)?.priceTypes.map((pt) => pt.id) ?? []
            const nextPriceTypeId = validIds.includes(row.priceTypeId)
              ? row.priceTypeId
              : validIds.length === 1
                ? validIds[0]
                : ''
            onUpdate({ menuItemId: v, priceTypeId: nextPriceTypeId })
          }}
          options={menuItems.map((item) => ({ value: item.id, label: item.recipe.name }))}
          placeholder="Prato"
          searchPlaceholder="Buscar prato..."
          className="flex-1 rounded-sm"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isOnly}
          className="w-7.5 h-7.5 flex-none rounded-sm text-muted-foreground hover:text-destructive cursor-pointer"
        >
          <Trash className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex border border-border rounded-sm overflow-hidden">
          {rowPriceTypes.map((pt) => (
            <Button
              key={pt.id}
              type="button"
              variant={row.priceTypeId === pt.id ? 'default' : 'ghost'}
              onClick={() => onUpdate({ priceTypeId: pt.id })}
              className="rounded-none h-full py-1.5 text-md font-semibold cursor-pointer border-none hover:bg-accent"
            >
              {pt.size}
            </Button>
          ))}
        </div>

        <div className="inline-flex items-center border border-border rounded-sm overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onUpdate({ quantity: String(Math.max(0, Number(row.quantity) - 1)) })}
            className="w-8 h-8.5 rounded-none p-0 cursor-pointer hover:bg-primary border-none"
          >
            <Minus className="size-3.5" />
          </Button>
          <Input
            type="number"
            min="0"
            value={row.quantity}
            onChange={(e) => onUpdate({ quantity: e.target.value })}
            className="w-9 text-center font-heading font-extrabold text-lg border-none rounded-none h-8.5 shadow-none focus-visible:ring-0 px-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => onUpdate({ quantity: String(Number(row.quantity) + 1) })}
            className="w-8 h-8.5 rounded-none p-0 cursor-pointer hover:bg-primary border-none"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
