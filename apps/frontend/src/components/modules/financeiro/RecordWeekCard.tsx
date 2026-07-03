import { Trophy } from 'lucide-react'
import { formatCurrency } from '@/formatters/currency'
import type { FinancialRecordWeekResponse } from '@marmitaria/schemas/financial/financialRecordWeekResponse.schema'

interface RecordWeekCardProps {
  record: FinancialRecordWeekResponse
}

export function RecordWeekCard({ record }: RecordWeekCardProps) {
  const { bestRevenueWeek, bestProfitWeek } = record

  return (
    <div className="bg-mustard-faint rounded-sm p-5.5 border border-transparent">
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-mustard-dark" />
        <b className="text-lg">Recordes históricos</b>
      </div>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">entre todas as semanas já registradas</p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Maior faturamento</div>
          {bestRevenueWeek ? (
            <>
              <div className="font-heading font-extrabold text-2xl text-mustard-dark">{formatCurrency(bestRevenueWeek.revenue)}</div>
              <div className="text-[12.5px] text-ink-faint">Semana {bestRevenueWeek.weekNumber} · {bestRevenueWeek.year}</div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Sem dados ainda</div>
          )}
        </div>
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Maior lucro</div>
          {bestProfitWeek ? (
            <>
              <div className="font-heading font-extrabold text-2xl text-pix">{formatCurrency(bestProfitWeek.profit)}</div>
              <div className="text-[12.5px] text-ink-faint">Semana {bestProfitWeek.weekNumber} · {bestProfitWeek.year}</div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Sem dados ainda</div>
          )}
        </div>
      </div>
    </div>
  )
}
