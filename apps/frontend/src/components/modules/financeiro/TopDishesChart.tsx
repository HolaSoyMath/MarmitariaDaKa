import { formatCurrency } from '@/formatters/currency'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'

interface TopDishesChartProps {
  dishes: FinancialReportResponse['dishes']
}

export function TopDishesChart({ dishes }: TopDishesChartProps) {
  const sorted = [...dishes].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  const max = sorted[0]?.quantity ?? 0

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Pratos mais pedidos</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">quantidade vendida no período</p>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Nenhum pedido pago nesse período.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((dish) => {
            const percent = max > 0 ? (dish.quantity / max) * 100 : 0
            return (
              <div key={dish.name} className="flex flex-col gap-1">
                <div className="grid grid-cols-[1fr_120px] items-center gap-3">
                  <span className="text-sm">{dish.name}</span>
                  <div className="grid grid-cols-[1fr_32px] items-center gap-2">
                    <span className="h-3 rounded-full bg-muted overflow-hidden">
                      <span className="block h-full rounded-full bg-mustard" style={{ width: `${percent}%` }} />
                    </span>
                    <span className="font-heading font-extrabold text-right text-lg">{dish.quantity}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap pl-0.5">
                  {dish.bySize.map((s) => (
                    <span key={s.size} className="text-[12px] font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
                      {s.size} · {s.quantity} · {formatCurrency(s.revenue)}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
