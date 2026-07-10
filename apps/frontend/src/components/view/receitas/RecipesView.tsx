'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/SearchInput'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RecipeSheet } from '@/components/modules/receitas/RecipeSheet'
import { RecipeRow } from '@/components/modules/receitas/RecipeRow'
import { useRecipes, useSetRecipeActive } from '@/hooks/useRecipes'
import { useWeek } from '@/context/WeekContext'
import { Eye, EyeOff, Plus } from 'lucide-react'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'

export function RecipesView() {
  const { currentWeek } = useWeek()
  const { data: recipes = [], isLoading } = useRecipes(currentWeek?.id ?? null)
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
                <TableHead className="min-w-32">Nome</TableHead>
                <TableHead className="min-w-32">Tamanho</TableHead>
                <TableHead className="min-w-44 whitespace-normal">Última vez no cardápio</TableHead>
                <TableHead className="min-w-36">Custo médio</TableHead>
                <TableHead className="min-w-44" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map(recipe => (
                <RecipeRow
                  key={recipe.id}
                  recipe={recipe}
                  isExpanded={expandedIds.has(recipe.id)}
                  onToggleExpand={toggleExpanded}
                  onEdit={openEdit}
                  onSetActive={(r) => setRecipeActive.mutate({ id: r.id, active: !r.active })}
                  isSettingActive={setRecipeActive.isPending}
                />
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
