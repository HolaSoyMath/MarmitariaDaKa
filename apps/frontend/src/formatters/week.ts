function mondayOfISOWeek(week: number, year: number): Date {
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7 // Mon=1 … Sun=7
  const mondayOfWeek1 = new Date(jan4)
  mondayOfWeek1.setDate(jan4.getDate() - dayOfWeek + 1)
  const monday = new Date(mondayOfWeek1)
  monday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7)
  return monday
}

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

export function formatWeek(number: number, year: number): string {
  const monday = mondayOfISOWeek(number, year)
  const month = monthFormatter.format(monday)
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1)
  return `Semana ${number} · ${monthCapitalized} ${year}`
}
