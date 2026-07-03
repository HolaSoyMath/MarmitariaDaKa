import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import type { FinancialTimeseriesResponse } from '@marmitaria/schemas/financial/financialTimeseriesResponse.schema'

interface ProfitTrendChartProps {
  series: FinancialTimeseriesResponse
}

const chartConfig = {
  profit: { label: 'Lucro', color: 'var(--color-pix)' },
  profitMarginPercent: { label: 'Margem %', color: 'var(--color-mustard-dark)' },
} satisfies ChartConfig

export function ProfitTrendChart({ series }: ProfitTrendChartProps) {
  const data = series.map((point) => ({
    week: `S${point.weekNumber}`,
    profit: point.profit / 100,
    profitMarginPercent: Number(point.profitMarginPercent.toFixed(1)),
  }))

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Lucro ao longo do tempo</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">uma semana por ponto no período selecionado</p>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Sem dados suficientes no período.</p>
      ) : (
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
          <LineChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" hide />
            <YAxis yAxisId="right" orientation="right" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line yAxisId="left" type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="profitMarginPercent" stroke="var(--color-profitMarginPercent)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  )
}
