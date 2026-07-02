'use client'

import { Fragment, useState } from 'react'
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
import { ChevronRight, Eye, EyeOff, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatUnit } from '@/formatters/unit'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'

export function RecipesView() {
  const { data: recipes = [], isLoading } = useRecipes()
  const setRecipeActive = useSetRecipeActive()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState<RecipeResponse | null>(null)
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function openCreate() {
    setSelected(null)
    setSheetOpen(true)
  }

  function openEdit(recipe: RecipeResponse) {
    setSelected(recipe)
    setSheetOpen(true)
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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
                <TableHead className="w-10" />
                <TableHead>Nome</TableHead>
                <TableHead>Ingredientes</TableHead>
                <TableHead>Última vez no cardápio</TableHead>
                <TableHead className="w-44" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map(recipe => {
                const isExpanded = expandedIds.has(recipe.id)
                return (
                  <Fragment key={recipe.id}>
                    <TableRow className={!recipe.active ? 'opacity-50' : undefined}>
                      <TableCell>
                        <Button
                          type="button"
                          onClick={() => toggleExpanded(recipe.id)}
                          variant="ghost"
                          className="flex items-center justify-center size-7 rounded-sm p-0 hover:bg-transparent"
                        >
                          <span
                            className={cn(
                              'text-[13px] text-ink-faint transition-transform duration-200 inline-block',
                              isExpanded && 'rotate-90',
                            )}
                          >
                            <ChevronRight />
                          </span>
                        </Button>
                      </TableCell>
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
                    {isExpanded && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={5} className="px-4.5 pt-0 pb-3.5 bg-secondary/40">
                          <div
                            className="flex flex-col animate-in fade-in slide-in-from-top-1 duration-200"
                            style={{ paddingLeft: '58px' }}
                          >
                            {recipe.ingredients.length === 0 ? (
                              <span className="text-sm text-muted-foreground py-1.5">
                                Nenhum ingrediente cadastrado.
                              </span>
                            ) : (
                              recipe.ingredients.map((item) => (
                                <div
                                  key={item.ingredientId}
                                  className="flex items-center gap-2 py-1.5 text-sm"
                                >
                                  <span className="font-medium">{item.ingredient.name}</span>
                                  <span className="text-muted-foreground">
                                    {formatUnit(item.quantity, item.ingredient.unit)}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
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
