'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X, Plus, Minus } from 'lucide-react'
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
    <div className="border border-border rounded-md p-3.5 flex flex-col gap-3 bg-card">
      <div className="flex gap-2 items-center">
        <Select
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
        >
          <SelectTrigger className="flex-1 min-w-0 cursor-pointer">
            <SelectValue placeholder="Prato" />
          </SelectTrigger>
          <SelectContent>
            {menuItems.map((item) => (
              <SelectItem key={item.id} value={item.id} className="cursor-pointer">
                {item.recipe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRemove}
          disabled={isOnly}
          className="w-7.5 h-7.5 flex-none rounded-lg text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
        >
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex border border-border rounded-lg overflow-hidden">
          {rowPriceTypes.map((pt) => (
            <Button
              key={pt.id}
              type="button"
              variant={row.priceTypeId === pt.id ? 'default' : 'ghost'}
              onClick={() => onUpdate({ priceTypeId: pt.id })}
              className="rounded-none border-r border-border last:border-r-0 h-auto py-1.5 text-md font-semibold cursor-pointer hover:bg-accent"
            >
              {pt.size}
            </Button>
          ))}
        </div>

        <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onUpdate({ quantity: String(Math.max(0, Number(row.quantity) - 1)) })}
            className="w-8 h-8.5 rounded-none p-0 cursor-pointer hover:bg-accent"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-9 text-center font-heading font-extrabold text-lg border-l border-r border-border h-8.5 grid place-items-center">
            {row.quantity === '' ? '0' : row.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onUpdate({ quantity: String(Number(row.quantity) + 1) })}
            className="w-8 h-8.5 rounded-none p-0 cursor-pointer hover:bg-accent"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
