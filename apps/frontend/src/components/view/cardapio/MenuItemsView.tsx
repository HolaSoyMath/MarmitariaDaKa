'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/SearchInput'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AddMenuItemDialog } from '@/components/modules/cardapio/AddMenuItemDialog'
import { useMenuItems, useRemoveMenuItem } from '@/hooks/useMenuItems'
import { useWeek } from '@/context/WeekContext'
import { Plus } from 'lucide-react'
import { MenuItemCard } from '@/components/modules/cardapio/MenuItemCard'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

export function MenuItemsView() {
  const { currentWeek } = useWeek()
  const { data: menuItems = [], isLoading } = useMenuItems(currentWeek?.id ?? null)
  const removeMenuItem = useRemoveMenuItem()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [toRemove, setToRemove] = useState<MenuItemResponse | null>(null)
  const [search, setSearch] = useState('')

  const existingRecipeIds = menuItems.map((item) => item.recipeId)

  const filteredMenuItems = menuItems.filter((item) =>
    item.recipe.name.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleRemove() {
    if (!toRemove) return
    await removeMenuItem.mutateAsync(toRemove.id)
    setToRemove(null)
  }

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          placeholder="Buscar prato..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setDialogOpen(true)} disabled={!currentWeek} className="rounded-sm">
          <Plus /> Adicionar prato
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filteredMenuItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card">
          <p className="text-muted-foreground">
            {search ? 'Nenhum prato encontrado.' : 'Nenhum prato no cardápio desta semana.'}
          </p>
          {!search && (
            <Button
              variant="outline"
              onClick={() => setDialogOpen(true)}
              disabled={!currentWeek}
              className="rounded-sm"
            >
              <Plus /> Adicionar primeiro prato
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onRemove={setToRemove} />
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
