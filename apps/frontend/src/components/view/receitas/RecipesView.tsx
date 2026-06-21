'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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

  function openCreate() {
    setSelected(null)
    setSheetOpen(true)
  }

  function openEdit(recipe: RecipeResponse) {
    setSelected(recipe)
    setSheetOpen(true)
  }

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Receitas utilizadas no cardápio semanal
        </p>
        <Button onClick={openCreate}>
          <Plus /> Nova receita
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">Nenhuma receita cadastrada ainda.</p>
          <Button variant="outline" onClick={openCreate}>
            <Plus /> Cadastrar primeira receita
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
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
              {recipes.map(recipe => (
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
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(recipe)}
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
