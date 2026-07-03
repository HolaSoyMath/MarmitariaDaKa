'use client'

import { useMemo, useState } from 'react'
import { useWeek } from '@/context/WeekContext'
import { useFinancialReport } from '@/hooks/useFinancialReport'
import { useFinancialTimeseries } from '@/hooks/useFinancialTimeseries'
import { useFinancialComparison } from '@/hooks/useFinancialComparison'
import { useFinancialRecordWeek } from '@/hooks/useFinancialRecordWeek'
import { useIngredientCostRanking, useIngredientPriceSeries } from '@/hooks/useIngredientCosts'
import { useDishLastSold } from '@/hooks/useDishLastSold'
import { useClientRanking, useGroupRanking } from '@/hooks/useFinancialRanking'
import { useWeeksCount } from '@/hooks/useWeeksCount'
import { PeriodToggle, type PeriodMode } from '@/components/modules/financeiro/PeriodToggle'
import { SummaryCards } from '@/components/modules/financeiro/SummaryCards'
import { CostBreakdownCard } from '@/components/modules/financeiro/CostBreakdownCard'
import { RevenueCostChart } from '@/components/modules/financeiro/RevenueCostChart'
import { PaymentMethodPieChart } from '@/components/modules/financeiro/PaymentMethodPieChart'
import { TopDishesChart } from '@/components/modules/financeiro/TopDishesChart'
import { SizeRevenueChart } from '@/components/modules/financeiro/SizeRevenueChart'
import { ProfitTrendChart } from '@/components/modules/financeiro/ProfitTrendChart'
import { PaymentMethodTrendChart } from '@/components/modules/financeiro/PaymentMethodTrendChart'
import { ComparisonCard } from '@/components/modules/financeiro/ComparisonCard'
import { RecordWeekCard } from '@/components/modules/financeiro/RecordWeekCard'
import { IngredientCostRankingTable } from '@/components/modules/financeiro/IngredientCostRankingTable'
import { IngredientPriceEvolution } from '@/components/modules/financeiro/IngredientPriceEvolution'
import { DishLastSoldTable } from '@/components/modules/financeiro/DishLastSoldTable'
import { RankingTable } from '@/components/modules/financeiro/RankingTable'
import { MonthProjectionCard } from '@/components/modules/financeiro/MonthProjectionCard'
import { SeasonalityChart } from '@/components/modules/financeiro/SeasonalityChart'
import { WeeklyInsights } from '@/components/modules/financeiro/WeeklyInsights'
import { buildWeeklyInsights } from '@/components/modules/financeiro/weeklyInsightsUtils'
import type { FinancialPeriodFilter } from '@/types/financial'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function FinanceiroView() {
  const { currentWeek } = useWeek()

  const [mode, setMode] = useState<PeriodMode>('week')
  const now = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [startDate, setStartDate] = useState(isoDate(new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())))
  const [endDate, setEndDate] = useState(isoDate(now))

  const period: FinancialPeriodFilter | null = useMemo(() => {
    if (mode === 'week') return currentWeek ? { type: 'week', weekId: currentWeek.id } : null
    if (mode === 'month') return { type: 'month', month, year }
    return { type: 'period', startDate, endDate }
  }, [mode, currentWeek, month, year, startDate, endDate])

  const { data: report, isLoading, isPlaceholderData } = useFinancialReport(period)
  const { data: series = [] } = useFinancialTimeseries(period)
  const { data: comparison } = useFinancialComparison(period)
  const { data: recordWeek } = useFinancialRecordWeek()
  const { data: ingredientRanking = [] } = useIngredientCostRanking()

  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null)
  const { data: ingredientSeries = [] } = useIngredientPriceSeries(selectedIngredientId)
  const selectedIngredientName = ingredientRanking.find((i) => i.ingredientId === selectedIngredientId)?.name ?? null

  const { data: dishLastSold = [] } = useDishLastSold()
  const { data: clientRanking = [] } = useClientRanking()
  const { data: groupRanking = [] } = useGroupRanking()
  const { data: weeksCount = 0 } = useWeeksCount()

  const insights = useMemo(
    () => (report ? buildWeeklyInsights({ comparison, toReceive: report.toReceive, dishLastSold }) : []),
    [report, comparison, dishLastSold],
  )

  const periodLabel = useMemo(() => {
    if (mode === 'week') return currentWeek ? `Semana ${currentWeek.number} · ${currentWeek.year}` : '—'
    if (mode === 'month') return `${MONTH_NAMES[month - 1]} · ${year}`
    return `${startDate} até ${endDate}`
  }, [mode, currentWeek, month, year, startDate, endDate])

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-baseline gap-3 flex-wrap justify-between">
        <h2 className="font-heading font-bold text-xl whitespace-nowrap tracking-tight">Financeiro</h2>
        <PeriodToggle
          mode={mode}
          onModeChange={setMode}
          month={month}
          year={year}
          onMonthYearChange={(m, y) => { setMonth(m); setYear(y) }}
          startDate={startDate}
          endDate={endDate}
          onRangeChange={(s, e) => { setStartDate(s); setEndDate(e) }}
          currentWeekLabel={currentWeek ? `Semana ${currentWeek.number} · ${currentWeek.year}` : null}
        />
      </div>

      {!period || (isLoading && !report) ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : !report ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center border-2 border-dashed border-border rounded-sm bg-secondary">
          <p className="text-muted-foreground">Selecione uma semana para ver o financeiro.</p>
        </div>
      ) : (
        <div className={`flex flex-col gap-4.5 ${isPlaceholderData ? 'opacity-60' : ''}`}>
          <SummaryCards report={report} />

          <WeeklyInsights insights={insights} />

          {comparison && <ComparisonCard comparison={comparison} />}

          {mode === 'month' && weeksCount >= 4 && (
            <MonthProjectionCard month={month} year={year} series={series} />
          )}

          <RevenueCostChart revenue={report.revenue} cost={report.cost} profit={report.profit} label={periodLabel} series={series} />

          {series.length > 1 && (
            <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2">
              <ProfitTrendChart series={series} />
              <PaymentMethodTrendChart series={series} />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2">
            <TopDishesChart dishes={report.dishes} />
            <PaymentMethodPieChart byMethod={report.byMethod} />
          </div>

          <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2">
            <CostBreakdownCard costBreakdown={report.costBreakdown} />
            <SizeRevenueChart bySize={report.bySize} />
          </div>

          {recordWeek && <RecordWeekCard record={recordWeek} />}

          <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2">
            <IngredientCostRankingTable
              ranking={ingredientRanking}
              selectedIngredientId={selectedIngredientId}
              onSelect={setSelectedIngredientId}
            />
            <IngredientPriceEvolution ingredientName={selectedIngredientName} series={ingredientSeries} />
          </div>

          <DishLastSoldTable dishes={dishLastSold} />

          <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2">
            <RankingTable
              title="Ranking de clientes"
              subtitle="quem mais compra e mais gasta — histórico total"
              nameLabel="Cliente"
              ranking={clientRanking}
              emptyLabel="Nenhum pedido pago ainda."
            />
            <RankingTable
              title="Ranking de grupos"
              subtitle="quem mais compra e mais gasta, por grupo — histórico total"
              nameLabel="Grupo"
              ranking={groupRanking}
              emptyLabel="Nenhum pedido pago ainda."
            />
          </div>
        </div>
      )}

      <SeasonalityChart />
    </div>
  )
}
