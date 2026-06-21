'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRecipes } from '@/hooks/useRecipes'
import { useAddMenuItem } from '@/hooks/useMenuItems'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  weekId: string
  existingRecipeIds: string[]
}

export function AddMenuItemDialog({ open, onOpenChange, weekId, existingRecipeIds }: Props) {
  const [search, setSearch] = useState('')
  const { data: recipes = [], isLoading } = useRecipes()
  const addMenuItem = useAddMenuItem()

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleAdd(recipeId: string) {
    await addMenuItem.mutateAsync({ weekId, recipeId })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setSearch(''); onOpenChange(v) }}>
      <DialogContent className="flex flex-col gap-0 p-0 max-h-[80vh]">
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle>Adicionar prato ao cardápio</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 border-b">
          <Input
            placeholder="Buscar receita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex flex-col overflow-y-auto flex-1">
          {isLoading ? (
            <p className="text-sm text-muted-foreground px-6 py-4">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-4">Nenhuma receita encontrada.</p>
          ) : (
            filtered.map((recipe) => {
              const alreadyAdded = existingRecipeIds.includes(recipe.id)
              return (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between px-6 py-3 border-b last:border-b-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{recipe.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {recipe.ingredients.length}{' '}
                      {recipe.ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}
                    </span>
                  </div>
                  {alreadyAdded ? (
                    <span className="text-xs text-muted-foreground">Adicionado</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdd(recipe.id)}
                      disabled={addMenuItem.isPending}
                    >
                      Adicionar
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
