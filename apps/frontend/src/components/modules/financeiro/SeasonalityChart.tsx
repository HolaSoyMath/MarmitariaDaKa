'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFinancialSeasonality, type SeasonalityGranularity } from '@/hooks/useFinancialSeasonality'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const TAB_TRIGGER_CLASS =
  'px-3.5 py-1.75 rounded-sm border border-border bg-card text-[13.5px] font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-none cursor-pointer hover:bg-accent'

const chartConfig = {
  revenue: { label: 'Faturamento', color: 'var(--color-mustard)' },
  profit: { label: 'Lucro', color: 'var(--color-pix)' },
} satisfies ChartConfig

export function SeasonalityChart() {
  const [granularity, setGranularity] = useState<SeasonalityGranularity>('month')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [weekNumber, setWeekNumber] = useState(1)

  const referenceNumber = granularity === 'month' ? month : granularity === 'week' ? weekNumber : null
  const { data: points = [] } = useFinancialSeasonality(granularity, referenceNumber)

  const data = points.map((p) => ({ year: String(p.year), revenue: p.revenue / 100, profit: p.profit / 100 }))

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Sazonalidade</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">compare o mesmo período em anos diferentes</p>

      <div className="flex items-center gap-2.5 flex-wrap mb-4">
        <Tabs value={granularity} onValueChange={(v) => setGranularity(v as SeasonalityGranularity)}>
          <TabsList className="bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="week" className={TAB_TRIGGER_CLASS}>Semana</TabsTrigger>
            <TabsTrigger value="month" className={TAB_TRIGGER_CLASS}>Mês</TabsTrigger>
            <TabsTrigger value="year" className={TAB_TRIGGER_CLASS}>Ano</TabsTrigger>
          </TabsList>
        </Tabs>

        {granularity === 'month' && (
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, i) => (
                <SelectItem key={name} value={String(i + 1)}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {granularity === 'week' && (
          <Input
            type="number"
            min={1}
            max={53}
            value={weekNumber}
            onChange={(e) => setWeekNumber(Number(e.target.value))}
            className="w-24"
          />
        )}
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Sem dados suficientes para comparar.</p>
      ) : (
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
