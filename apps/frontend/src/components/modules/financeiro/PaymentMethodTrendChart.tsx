import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import type { FinancialTimeseriesResponse } from '@marmitaria/schemas/financial/financialTimeseriesResponse.schema'

interface PaymentMethodTrendChartProps {
  series: FinancialTimeseriesResponse
}

const chartConfig = {
  Pix: { label: 'Pix', color: 'var(--color-pix)' },
  Swile: { label: 'Swile', color: 'var(--color-swile)' },
} satisfies ChartConfig

export function PaymentMethodTrendChart({ series }: PaymentMethodTrendChartProps) {
  const data = series.map((point) => ({
    week: `S${point.weekNumber}`,
    Pix: point.byMethod.Pix.value / 100,
    Swile: point.byMethod.Swile.value / 100,
  }))

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Evolução Pix × Swile</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">como o mix de pagamento mudou no período</p>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Sem dados suficientes no período.</p>
      ) : (
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
          <AreaChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area type="monotone" dataKey="Pix" stroke="var(--color-Pix)" fill="var(--color-Pix)" fillOpacity={0.18} strokeWidth={2} />
            <Area type="monotone" dataKey="Swile" stroke="var(--color-Swile)" fill="var(--color-Swile)" fillOpacity={0.18} strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}
