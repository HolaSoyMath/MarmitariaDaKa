import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { FinancialIngredientSeriesResponse } from '@marmitaria/schemas/financial/financialIngredientCostResponse.schema'

interface IngredientPriceEvolutionProps {
  ingredientName: string | null
  series: FinancialIngredientSeriesResponse
}

const chartConfig = {
  unitValue: { label: 'Valor unitário', color: 'var(--color-mustard-dark)' },
} satisfies ChartConfig

function toChartData(series: FinancialIngredientSeriesResponse) {
  return series.map((point) => ({
    week: `S${point.weekNumber}`,
    unitValue: point.unitValue / 100,
  }))
}

export function IngredientPriceEvolution({ ingredientName, series }: IngredientPriceEvolutionProps) {
  if (!ingredientName) {
    return (
      <div className="bg-card rounded-sm p-5.5 border border-border flex items-center justify-center min-h-40">
        <p className="text-sm text-muted-foreground">Selecione um ingrediente na tabela ao lado para ver a evolução de preço.</p>
      </div>
    )
  }

  const fullData = toChartData(series)
  const recentData = toChartData(series.slice(-5))

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Evolução de preço — {ingredientName}</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">valor unitário pago em cada compra</p>

      {fullData.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Sem histórico de compra para esse ingrediente.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Histórico completo</div>
            <ChartContainer config={chartConfig} className="max-h-48 w-full">
              <LineChart data={fullData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="unitValue" stroke="var(--color-unitValue)" strokeWidth={2} dot />
              </LineChart>
            </ChartContainer>
          </div>

          {recentData.length > 1 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Últimas {recentData.length} compras</div>
              <ChartContainer config={chartConfig} className="max-h-48 w-full">
                <LineChart data={recentData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="unitValue" stroke="var(--color-unitValue)" strokeWidth={2} dot />
                </LineChart>
              </ChartContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
