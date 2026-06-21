import { addDays, setISOWeek, setISOWeekYear, startOfISOWeek } from 'date-fns'

function thursdayOfIsoWeek(week: number, year: number): Date {
  const monday = startOfISOWeek(setISOWeek(setISOWeekYear(new Date(), year), week))
  return addDays(monday, 3)
}

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

export function formatWeek(number: number, year: number): string {
  const thursday = thursdayOfIsoWeek(number, year)
  const month = monthFormatter.format(thursday)
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1)
  return `Semana ${number} · ${monthCapitalized} ${thursday.getFullYear()}`
}
