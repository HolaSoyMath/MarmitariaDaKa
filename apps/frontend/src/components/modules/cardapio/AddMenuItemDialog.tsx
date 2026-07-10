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
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const { data: recipes = [], isLoading } = useRecipes()
  const addMenuItem = useAddMenuItem()

  const filtered = recipes
    .filter((r) => r.active)
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))

  function startAdd(recipeId: string, priceTypeIds: string[]) {
    setExpandedRecipeId(recipeId)
    setSelectedSizes(priceTypeIds)
  }

  function toggleSize(id: string) {
    setSelectedSizes((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    )
  }

  async function confirmAdd(recipeId: string) {
    if (selectedSizes.length === 0) return
    await addMenuItem.mutateAsync({ weekId, recipeId, priceTypeIds: selectedSizes })
    setExpandedRecipeId(null)
    setSelectedSizes([])
  }

  function close(v: boolean) {
    if (!v) {
      setSearch('')
      setExpandedRecipeId(null)
      setSelectedSizes([])
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={close}>
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
            className="bg-card rounded-sm"
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
              const isExpanded = expandedRecipeId === recipe.id
              const ingredientCount = recipe.priceTypes[0]?.ingredients.length ?? 0
              return (
                <div key={recipe.id} className="flex flex-col px-6 py-3 border-b last:border-b-0 gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{recipe.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {ingredientCount}{' '}
                        {ingredientCount === 1 ? 'ingrediente' : 'ingredientes'}
                      </span>
                    </div>
                    {alreadyAdded ? (
                      <span className="text-xs text-muted-foreground">Adicionado</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          isExpanded
                            ? setExpandedRecipeId(null)
                            : startAdd(recipe.id, recipe.priceTypes.map((pt) => pt.id))
                        }
                        disabled={addMenuItem.isPending}
                        className="rounded-sm"
                      >
                        Adicionar
                      </Button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">
                        Tamanhos disponíveis nesta semana
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {recipe.priceTypes.map((pt) => (
                          <Button
                            key={pt.id}
                            type="button"
                            variant="outline"
                            size="sm"
                            data-selected={selectedSizes.includes(pt.id)}
                            onClick={() => toggleSize(pt.id)}
                            className="bg-card hover:bg-accent rounded-sm data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
                          >
                            {pt.type} {pt.size}
                          </Button>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => confirmAdd(recipe.id)}
                        disabled={selectedSizes.length === 0 || addMenuItem.isPending}
                        className="w-fit rounded-sm"
                      >
                        Confirmar
                      </Button>
                    </div>
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
