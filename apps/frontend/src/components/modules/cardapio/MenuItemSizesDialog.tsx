'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUpdateMenuItemPriceTypes } from '@/hooks/useMenuItems'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItemResponse
}

export function MenuItemSizesDialog({ open, onOpenChange, item }: Props) {
  const [selected, setSelected] = useState<string[]>(item.priceTypes.map((pt) => pt.id))
  const updatePriceTypes = useUpdateMenuItemPriceTypes()

  function toggle(id: string) {
    setSelected((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]))
  }

  async function handleSave() {
    if (selected.length === 0) return
    await updatePriceTypes.mutateAsync({ id: item.id, priceTypeIds: selected })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setSelected(item.priceTypes.map((pt) => pt.id))
        onOpenChange(v)
      }}
    >
      <DialogContent className="flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle>Tamanhos — {item.recipe.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-6">
          <div className="flex gap-2 flex-wrap">
            {item.recipe.priceTypes.map((pt) => (
              <Button
                key={pt.id}
                type="button"
                variant="outline"
                size="sm"
                data-selected={selected.includes(pt.id)}
                onClick={() => toggle(pt.id)}
                className="bg-card hover:bg-accent rounded-sm data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
              >
                {pt.type} {pt.size}
              </Button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-sm">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={selected.length === 0 || updatePriceTypes.isPending}
            className="rounded-sm"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
