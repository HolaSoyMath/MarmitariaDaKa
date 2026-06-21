'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AddMenuItemDialog } from '@/components/modules/cardapio/AddMenuItemDialog'
import { useMenuItems, useRemoveMenuItem } from '@/hooks/useMenuItems'
import { usePriceTypes } from '@/hooks/usePriceTypes'
import { useWeek } from '@/context/WeekContext'
import { Plus } from 'lucide-react'
import { MenuItemCard } from '@/components/modules/cardapio/MenuItemCard'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

export function MenuItemsView() {
  const { currentWeek } = useWeek()
  const { data: menuItems = [], isLoading } = useMenuItems(currentWeek?.id ?? null)
  const { data: priceTypes = [] } = usePriceTypes()
  const removeMenuItem = useRemoveMenuItem()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [toRemove, setToRemove] = useState<MenuItemResponse | null>(null)

  const existingRecipeIds = menuItems.map((item) => item.recipeId)

  async function handleRemove() {
    if (!toRemove) return
    await removeMenuItem.mutateAsync(toRemove.id)
    setToRemove(null)
  }

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Pratos no cardápio desta semana
        </p>
        <Button onClick={() => setDialogOpen(true)} disabled={!currentWeek}>
          <Plus /> Adicionar prato
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : menuItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">Nenhum prato no cardápio desta semana.</p>
          <Button variant="outline" onClick={() => setDialogOpen(true)} disabled={!currentWeek}>
            <Plus /> Adicionar primeiro prato
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} priceTypes={priceTypes} onRemove={setToRemove} />
          ))}
        </div>
      )}

      {currentWeek && (
        <AddMenuItemDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          weekId={currentWeek.id}
          existingRecipeIds={existingRecipeIds}
        />
      )}

      <ConfirmDialog
        open={!!toRemove}
        onOpenChange={(v) => { if (!v) setToRemove(null) }}
        title="Remover prato?"
        description={
          <>
            <b>{toRemove?.recipe.name}</b> será removido do cardápio desta semana.
          </>
        }
        onConfirm={handleRemove}
        isPending={removeMenuItem.isPending}
      />
    </div>
  )
}
