'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/SearchInput'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RecipeSheet } from '@/components/modules/receitas/RecipeSheet'
import { useRecipes } from '@/hooks/useRecipes'
import { Plus } from 'lucide-react'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'

export function RecipesView() {
  const { data: recipes = [], isLoading } = useRecipes()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState<RecipeResponse | null>(null)
  const [search, setSearch] = useState('')

  function openCreate() {
    setSelected(null)
    setSheetOpen(true)
  }

  function openEdit(recipe: RecipeResponse) {
    setSelected(recipe)
    setSheetOpen(true)
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          placeholder="Buscar receita..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button onClick={openCreate} className="rounded-sm">
          <Plus /> Nova receita
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card">
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
                <TableHead className="w-25" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map(recipe => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {recipe.ingredients.length}{' '}
                    {recipe.ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {recipe.lastOnMenu ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(recipe)}
                      className="bg-transparent hover:bg-accent rounded-sm"
                    >
                      Editar
                    </Button>
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
