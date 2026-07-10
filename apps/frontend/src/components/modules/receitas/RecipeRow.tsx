import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { CostRangeLabel } from '@/components/shared/CostRangeLabel'
import { RecipeIngredientsTable } from './RecipeIngredientsTable'
import { cn } from '@/lib/utils'
import { ChevronRight, CircleCheck, CircleSlash } from 'lucide-react'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'

interface RecipeRowProps {
  recipe: RecipeResponse
  isExpanded: boolean
  onToggleExpand: (id: string) => void
  onEdit: (recipe: RecipeResponse) => void
  onSetActive: (recipe: RecipeResponse) => void
  isSettingActive: boolean
}

export function RecipeRow({
  recipe,
  isExpanded,
  onToggleExpand,
  onEdit,
  onSetActive,
  isSettingActive,
}: RecipeRowProps) {
  return (
    <Fragment>
      <TableRow className={!recipe.active ? 'opacity-50' : undefined}>
        <TableCell>
          <Button
            type="button"
            onClick={() => onToggleExpand(recipe.id)}
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
        <TableCell>
          <div className="flex items-center gap-1 flex-wrap">
            {recipe.priceTypes.map((pt) => (
              <Badge key={pt.id} variant="secondary" className="rounded-full font-semibold">
                {pt.type}
              </Badge>
            ))}
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {recipe.lastOnMenu ?? '—'}
        </TableCell>
        <TableCell>
          <CostRangeLabel
            sizes={recipe.priceTypes}
            partialMessage="Esse custo médio não é oficial — há ingredientes de algum tamanho desta receita sem histórico de compra cadastrado."
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(recipe)}
              className="bg-transparent hover:bg-accent rounded-sm"
            >
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetActive(recipe)}
              disabled={isSettingActive}
              className={cn("bg-transparent rounded-sm flex flex-1",
                recipe.active
                  ? "text-destructive"
                  : "text-green-600 hover:text-green-50"
              )}
            >
              {recipe.active ? <CircleSlash /> : <CircleCheck />}
              {recipe.active ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && <RecipeIngredientsTable priceTypes={recipe.priceTypes} />}
    </Fragment>
  )
}
