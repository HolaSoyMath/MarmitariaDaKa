import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'

interface SizeRevenueChartProps {
  bySize: FinancialReportResponse['bySize']
}

const chartConfig = {
  revenue: { label: 'Faturamento', color: 'var(--color-mustard)' },
} satisfies ChartConfig

export function SizeRevenueChart({ bySize }: SizeRevenueChartProps) {
  const data = [...bySize]
    .sort((a, b) => b.revenue - a.revenue)
    .map((s) => ({ size: s.size, revenue: s.revenue / 100, quantity: s.quantity }))

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Faturamento por tamanho</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">entre todas as receitas do período</p>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Sem vendas no período.</p>
      ) : (
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
          <BarChart data={data} layout="vertical" accessibilityLayer>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="size" type="category" tickLine={false} axisLine={false} width={60} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
