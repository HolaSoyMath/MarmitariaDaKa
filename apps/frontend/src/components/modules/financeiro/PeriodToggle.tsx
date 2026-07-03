import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export type PeriodMode = 'week' | 'month' | 'period'

interface PeriodToggleProps {
  mode: PeriodMode
  onModeChange: (mode: PeriodMode) => void
  month: number
  year: number
  onMonthYearChange: (month: number, year: number) => void
  startDate: string
  endDate: string
  onRangeChange: (startDate: string, endDate: string) => void
  currentWeekLabel: string | null
}

const TAB_TRIGGER_CLASS =
  'px-4.5 py-2.25 rounded-sm border border-border bg-card text-[14.5px] font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-none cursor-pointer hover:bg-accent'

export function PeriodToggle({
  mode,
  onModeChange,
  month,
  year,
  onMonthYearChange,
  startDate,
  endDate,
  onRangeChange,
  currentWeekLabel,
}: PeriodToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as PeriodMode)}>
        <TabsList className="bg-transparent p-0 h-auto gap-2">
          <TabsTrigger value="week" className={TAB_TRIGGER_CLASS}>Por semana</TabsTrigger>
          <TabsTrigger value="month" className={TAB_TRIGGER_CLASS}>Por mês</TabsTrigger>
          <TabsTrigger value="period" className={TAB_TRIGGER_CLASS}>Período</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === 'month' && (
        <div className="flex items-center gap-2.5">
          <Select value={String(month)} onValueChange={(v) => onMonthYearChange(Number(v), year)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, i) => (
                <SelectItem key={name} value={String(i + 1)}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={year}
            onChange={(e) => onMonthYearChange(month, Number(e.target.value))}
            className="w-24"
          />
        </div>
      )}

      {mode === 'period' && (
        <div className="flex items-center gap-2.5">
          <Input type="date" value={startDate} onChange={(e) => onRangeChange(e.target.value, endDate)} className="w-44" />
          <span className="text-muted-foreground">até</span>
          <Input type="date" value={endDate} onChange={(e) => onRangeChange(startDate, e.target.value)} className="w-44" />
        </div>
      )}
    </div>
  )
}
