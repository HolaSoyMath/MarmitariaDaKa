'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RecipeSheet } from '@/components/modules/receitas/RecipeSheet'
import { useRecipes, useSetRecipeActive } from '@/hooks/useRecipes'
import { Eye, EyeOff, Plus } from 'lucide-react'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'

export function RecipesView() {
  const { data: recipes = [], isLoading } = useRecipes()
  const setRecipeActive = useSetRecipeActive()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState<RecipeResponse | null>(null)
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  function openCreate() {
    setSelected(null)
    setSheetOpen(true)
  }

  function openEdit(recipe: RecipeResponse) {
    setSelected(recipe)
    setSheetOpen(true)
  }

  const filteredRecipes = [...recipes]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(recipe => showInactive || recipe.active)
    .filter(recipe => recipe.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          placeholder="Buscar receita..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            data-selected={showInactive}
            onClick={() => setShowInactive(v => !v)}
            className="bg-card hover:bg-accent rounded-sm data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
          >
            {showInactive ? <Eye /> : <EyeOff />} Inativas
          </Button>
          <Button onClick={openCreate} className="rounded-sm">
            <Plus /> Nova receita
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card rounded-sm">
          <p className="text-muted-foreground">
            {search
              ? 'Nenhuma receita encontrada.'
              : 'Nenhuma receita cadastrada ainda.'}
          </p>
          {!search && (
            <Button variant="outline" onClick={openCreate} className="rounded-sm">
              <Plus /> Cadastrar primeira receita
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-sm border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ingredientes</TableHead>
                <TableHead>Última vez no cardápio</TableHead>
                <TableHead className="w-44" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map(recipe => (
                <TableRow key={recipe.id} className={!recipe.active ? 'opacity-50' : undefined}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {recipe.name}
                      {!recipe.active && (
                        <Badge variant="outline" className="rounded-full text-muted-foreground">
                          Inativa
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {recipe.ingredients.length}{' '}
                    {recipe.ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {recipe.lastOnMenu ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(recipe)}
                        className="bg-transparent hover:bg-accent rounded-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setRecipeActive.mutate({ id: recipe.id, active: !recipe.active })
                        }
                        disabled={setRecipeActive.isPending}
                        className="bg-transparent hover:bg-accent rounded-sm"
                      >
                        {recipe.active ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <RecipeSheet
        key={selected?.id ?? 'new'}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        recipe={selected ?? undefined}
      />
    </div>
  )
}
