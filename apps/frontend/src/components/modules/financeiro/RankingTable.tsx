import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatCurrency } from '@/formatters/currency'
import type { FinancialRankingResponse } from '@marmitaria/schemas/financial/financialRankingResponse.schema'

interface RankingTableProps {
  title: string
  subtitle: string
  nameLabel: string
  ranking: FinancialRankingResponse
  emptyLabel: string
}

export function RankingTable({ title, subtitle, nameLabel, ranking, emptyLabel }: RankingTableProps) {
  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">{title}</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">{subtitle}</p>

      {ranking.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">{emptyLabel}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{nameLabel}</TableHead>
              <TableHead className="text-right">Marmitas</TableHead>
              <TableHead className="text-right">Total gasto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell className="text-right">{entry.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(entry.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
