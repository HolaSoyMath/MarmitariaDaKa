'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AddMenuItemDialog } from '@/components/modules/cardapio/AddMenuItemDialog'
import { useMenuItems, useRemoveMenuItem } from '@/hooks/useMenuItems'
import { useWeek } from '@/context/WeekContext'
import { Plus, X } from 'lucide-react'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

export function MenuItemsView() {
  const { currentWeek } = useWeek()
  const { data: menuItems = [], isLoading } = useMenuItems(currentWeek?.id ?? null)
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="relative rounded-lg border p-4 flex flex-col gap-1"
            >
              <button
                className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setToRemove(item)}
                aria-label="Remover prato"
              >
                <X className="size-4" />
              </button>
              <span className="font-medium text-sm pr-6">{item.recipe.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.recipe.ingredients.length}{' '}
                {item.recipe.ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}
              </span>
            </div>
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
