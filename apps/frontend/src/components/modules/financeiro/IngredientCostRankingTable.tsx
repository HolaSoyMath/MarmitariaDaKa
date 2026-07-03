import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatCurrency } from '@/formatters/currency'
import type { FinancialIngredientRankingResponse } from '@marmitaria/schemas/financial/financialIngredientCostResponse.schema'

interface IngredientCostRankingTableProps {
  ranking: FinancialIngredientRankingResponse
  selectedIngredientId: string | null
  onSelect: (ingredientId: string) => void
}

export function IngredientCostRankingTable({ ranking, selectedIngredientId, onSelect }: IngredientCostRankingTableProps) {
  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Ingredientes que mais pesam no custo</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">histórico total de compras · clique para ver a evolução de preço</p>

      {ranking.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Nenhuma compra registrada ainda.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingrediente</TableHead>
              <TableHead className="text-right">Total gasto</TableHead>
              <TableHead className="text-right">Variação de preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((item) => (
              <TableRow
                key={item.ingredientId}
                onClick={() => onSelect(item.ingredientId)}
                className={`cursor-pointer ${selectedIngredientId === item.ingredientId ? 'bg-mustard-faint' : ''}`}
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.totalValue)}</TableCell>
                <TableCell className="text-right">
                  {item.changePercent == null ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <span className={item.changePercent > 0 ? 'text-terra' : item.changePercent < 0 ? 'text-pix' : 'text-muted-foreground'}>
                      {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(0)}%
                    </span>
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
