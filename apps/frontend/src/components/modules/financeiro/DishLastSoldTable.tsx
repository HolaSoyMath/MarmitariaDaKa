import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import type { FinancialDishLastSoldResponse } from '@marmitaria/schemas/financial/financialDishLastSoldResponse.schema'

interface DishLastSoldTableProps {
  dishes: FinancialDishLastSoldResponse
}

function weeksLabel(weeks: number | null): string {
  if (weeks == null) return 'nunca vendida'
  if (weeks === 0) return 'essa semana'
  return `${weeks} semana${weeks !== 1 ? 's' : ''} atrás`
}

export function DishLastSoldTable({ dishes }: DishLastSoldTableProps) {
  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Há quanto tempo o prato não sai</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">receitas ativas, da que mais tempo sem vender para a mais recente</p>

      {dishes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Nenhuma receita ativa cadastrada.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receita</TableHead>
              <TableHead className="text-right">Última venda</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dishes.map((dish) => (
              <TableRow key={dish.recipeId}>
                <TableCell className="font-medium">{dish.recipeName}</TableCell>
                <TableCell className="text-right">
                  <span className={dish.weeksSinceLastSold == null || dish.weeksSinceLastSold > 4 ? 'text-terra font-semibold' : 'text-muted-foreground'}>
                    {weeksLabel(dish.weeksSinceLastSold)}
                  </span>
                  {dish.lastSoldWeekNumber != null && (
                    <span className="block text-[11px] text-ink-faint">Semana {dish.lastSoldWeekNumber} · {dish.lastSoldYear}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
