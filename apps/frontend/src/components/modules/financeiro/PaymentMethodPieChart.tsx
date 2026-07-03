import { Pie, PieChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatCurrency } from '@/formatters/currency'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'

interface PaymentMethodPieChartProps {
  byMethod: FinancialReportResponse['byMethod']
}

const chartConfig = {
  value: { label: 'Valor' },
  Pix: { label: 'Pix', color: 'var(--color-pix)' },
  Swile: { label: 'Swile', color: 'var(--color-swile)' },
} satisfies ChartConfig

export function PaymentMethodPieChart({ byMethod }: PaymentMethodPieChartProps) {
  const data = [
    { method: 'Pix', value: byMethod.Pix.value / 100, fill: 'var(--color-Pix)' },
    { method: 'Swile', value: byMethod.Swile.value / 100, fill: 'var(--color-Swile)' },
  ]

  const pixTicket = byMethod.Pix.quantity > 0 ? byMethod.Pix.value / byMethod.Pix.quantity : 0
  const swileTicket = byMethod.Swile.quantity > 0 ? byMethod.Swile.value / byMethod.Swile.quantity : 0

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Pix vs Swile</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">como entrou o dinheiro</p>

      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-56">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="value" nameKey="method" innerRadius={45} />
        </PieChart>
      </ChartContainer>

      <div className="flex gap-3.5 mt-3">
        <div className="flex-1 text-center rounded-sm p-4 bg-pix-faint">
          <div className="font-heading font-extrabold text-3xl leading-none text-pix">{byMethod.Pix.quantity}</div>
          <div className="text-[12.5px] text-muted-foreground mt-1">pedidos Pix</div>
          <div className="text-sm font-semibold text-pix mt-1.5">{formatCurrency(byMethod.Pix.value)}</div>
          <div className="text-[11px] text-ink-faint">ticket médio {formatCurrency(pixTicket)}</div>
        </div>
        <div className="flex-1 text-center rounded-sm p-4 bg-swile-faint">
          <div className="font-heading font-extrabold text-3xl leading-none text-swile">{byMethod.Swile.quantity}</div>
          <div className="text-[12.5px] text-muted-foreground mt-1">pedidos Swile</div>
          <div className="text-sm font-semibold text-swile mt-1.5">{formatCurrency(byMethod.Swile.value)}</div>
          <div className="text-[11px] text-ink-faint">ticket médio {formatCurrency(swileTicket)}</div>
        </div>
      </div>
    </div>
  )
}
