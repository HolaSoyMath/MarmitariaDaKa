'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { MenuItemSizesDialog } from '@/components/modules/cardapio/MenuItemSizesDialog'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

interface MenuItemCardProps {
  item: MenuItemResponse
  onRemove: (item: MenuItemResponse) => void
}

export function MenuItemCard({ item, onRemove }: MenuItemCardProps) {
  const { recipe } = item
  const [sizesDialogOpen, setSizesDialogOpen] = useState(false)

  const ingredientPreview = recipe.ingredients
    .slice(0, 3)
    .map(({ quantity, ingredient }) => `${ingredient.name} ${quantity}${ingredient.unit}`)
    .join(' · ')

  const hasMore = recipe.ingredients.length > 3

  return (
    <div className="rounded-sm border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-bold text-lg leading-tight">{recipe.name}</span>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-muted-foreground rounded-sm"
          onClick={() => onRemove(item)}
        >
          Remover
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {item.priceTypes.map((pt) => (
          <Badge key={pt.id} variant="secondary" className="rounded-full font-semibold">
            {pt.size}
          </Badge>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setSizesDialogOpen(true)}
          className="rounded-sm text-muted-foreground"
        >
          <Pencil className="size-3.5" />
        </Button>
      </div>

      <div className="border-t border-dashed pt-2.5 text-sm text-muted-foreground">
        {ingredientPreview}
        {hasMore && ' …'}
      </div>

      <MenuItemSizesDialog open={sizesDialogOpen} onOpenChange={setSizesDialogOpen} item={item} />
    </div>
  )
}
