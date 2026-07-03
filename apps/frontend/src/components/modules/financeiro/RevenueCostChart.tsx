import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { formatCurrency } from '@/formatters/currency'
import type { FinancialTimeseriesResponse } from '@marmitaria/schemas/financial/financialTimeseriesResponse.schema'

interface RevenueCostChartProps {
  revenue: number
  cost: number
  profit: number
  label: string
  series?: FinancialTimeseriesResponse
}

const chartConfig = {
  revenue: { label: 'Entrou (faturamento)', color: 'var(--color-mustard)' },
  cost: { label: 'Saiu (custo)', color: 'var(--color-terra)' },
} satisfies ChartConfig

export function RevenueCostChart({ revenue, cost, profit, label, series }: RevenueCostChartProps) {
  const data = series && series.length > 0
    ? series.map((point) => ({ period: `S${point.weekNumber}`, revenue: point.revenue / 100, cost: point.cost / 100 }))
    : [{ period: label, revenue: revenue / 100, cost: cost / 100 }]

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
        <b className="text-lg">Entrou × Saiu — {label}</b>
      </div>
      <p className="text-[13.5px] text-muted-foreground mb-3">
        o lucro é a diferença entre as barras — {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
        {data.length > 1 ? ' · uma barra por semana' : ''}
      </p>
      <ChartContainer config={chartConfig} className="max-h-64 w-full">
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="period" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
