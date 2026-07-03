import { formatCurrency } from '@/formatters/currency'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'

interface SummaryCardsProps {
  report: FinancialReportResponse
}

export function SummaryCards({ report }: SummaryCardsProps) {
  const { revenue, cost, profit, profitMarginPercent, toReceive, averageTicket, breakEven } = report

  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
        <div className="bg-card rounded-sm p-5.5 border border-border">
          <div className="font-mono uppercase tracking-widest text-[11px] text-muted-foreground">Custo total</div>
          <div className="font-heading font-extrabold text-4xl leading-none my-1.5 tracking-tight">
            {formatCurrency(cost)}
          </div>
          <div className="text-[12.5px] text-ink-faint">ingredientes + gerais + gás</div>
        </div>

        <div className="bg-card rounded-sm p-5.5 border border-border">
          <div className="font-mono uppercase tracking-widest text-[11px] text-muted-foreground">Faturamento</div>
          <div className="font-heading font-extrabold text-4xl leading-none my-1.5 tracking-tight text-mustard-dark">
            {formatCurrency(revenue)}
          </div>
          <div className="text-[12.5px] text-ink-faint">{report.breakEven.soldQuantity} marmita{report.breakEven.soldQuantity !== 1 ? 's' : ''} vendidas</div>
        </div>

        <div className="bg-pix-faint rounded-sm p-5.5 border border-transparent">
          <div className="font-mono uppercase tracking-widest text-[11px] text-muted-foreground">Lucro</div>
          <div className="font-heading font-extrabold text-4xl leading-none my-1.5 tracking-tight text-pix">
            {profit >= 0 ? '+' : ''}
            {formatCurrency(profit)}
          </div>
          <div className="text-[12.5px] text-ink-faint">margem ~{profitMarginPercent.toFixed(0)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
        <div className="bg-card rounded-sm p-5.5 border border-border">
          <div className="font-mono uppercase tracking-widest text-[11px] text-muted-foreground">A receber</div>
          <div className="font-heading font-extrabold text-2xl leading-none my-1.5 tracking-tight">
            {formatCurrency(toReceive)}
          </div>
          <div className="text-[12.5px] text-ink-faint">pedidos produzidos ainda não pagos</div>
        </div>

        <div className="bg-card rounded-sm p-5.5 border border-border">
          <div className="font-mono uppercase tracking-widest text-[11px] text-muted-foreground">Ticket médio</div>
          <div className="font-heading font-extrabold text-2xl leading-none my-1.5 tracking-tight">
            {formatCurrency(averageTicket)}
          </div>
          <div className="text-[12.5px] text-ink-faint">por pedido pago</div>
        </div>

        <div className="bg-card rounded-sm p-5.5 border border-border">
          <div className="font-mono uppercase tracking-widest text-[11px] text-muted-foreground">Break-even</div>
          <div className="font-heading font-extrabold text-2xl leading-none my-1.5 tracking-tight">
            {breakEven.requiredQuantity ?? '—'}
            <span className="text-sm font-semibold text-muted-foreground"> / {breakEven.soldQuantity} vendidas</span>
          </div>
          <div className="text-[12.5px] text-ink-faint">marmitas necessárias para cobrir o custo</div>
        </div>
      </div>
    </div>
  )
}
