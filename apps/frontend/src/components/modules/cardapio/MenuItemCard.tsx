'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'
import type { PriceTypeResponse } from '@marmitaria/schemas/priceType/priceTypeResponse.schema'

interface MenuItemCardProps {
  item: MenuItemResponse
  priceTypes: PriceTypeResponse[]
  onRemove: (item: MenuItemResponse) => void
}

export function MenuItemCard({ item, priceTypes, onRemove }: MenuItemCardProps) {
  const { recipe } = item

  const ingredientPreview = recipe.ingredients
    .slice(0, 3)
    .map(({ quantity, ingredient }) => `${ingredient.name} ${quantity}${ingredient.unit}`)
    .join(' · ')

  const hasMore = recipe.ingredients.length > 3

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="font-bold text-lg leading-tight">{recipe.name}</span>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-muted-foreground"
          onClick={() => onRemove(item)}
        >
          Remover
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="border-dashed text-muted-foreground gap-1.5 rounded-full">
          <span className="size-2 rounded-full bg-muted-foreground/50 shrink-0" />
          Receita vinculada
        </Badge>
        {priceTypes.map((pt) => (
          <Badge key={pt.id} variant="secondary" className="rounded-full font-semibold">
            {pt.size}
          </Badge>
        ))}
      </div>

      <div className="border-t border-dashed pt-2.5 text-sm text-muted-foreground">
        {ingredientPreview}
        {hasMore && ' …'}
      </div>
    </div>
  )
}
