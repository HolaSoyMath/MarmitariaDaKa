import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RecipeIngredientsTable } from './RecipeIngredientsTable'
import { formatCurrency } from '@/formatters/currency'
import { cn } from '@/lib/utils'
import { ChevronRight, CircleCheck, CircleSlash, Info } from 'lucide-react'
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
        <TableCell className="text-muted-foreground">
          {recipe.ingredients.length}{' '}
          {recipe.ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {recipe.lastOnMenu ?? '—'}
        </TableCell>
        <TableCell>
          {recipe.totalAverageCost == null ? (
            <span className="text-muted-foreground">—</span>
          ) : recipe.isPartialAverageCost ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 text-yellow-600 cursor-help">
                    {formatCurrency(recipe.totalAverageCost)}
                    <Info className="size-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Esse custo médio não é oficial — há ingredientes desta receita sem histórico de
                  compra cadastrado.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span>{formatCurrency(recipe.totalAverageCost)}</span>
          )}
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
      {isExpanded && <RecipeIngredientsTable ingredients={recipe.ingredients} />}
    </Fragment>
  )
}
