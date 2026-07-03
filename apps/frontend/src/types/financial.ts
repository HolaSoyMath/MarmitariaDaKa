export type FinancialPeriodFilter =
  | { type: 'week'; weekId: string }
  | { type: 'month'; month: number; year: number }
  | { type: 'period'; startDate: string; endDate: string }
