import { formatCurrency } from '@/formatters/currency'

interface WeekTotalsCardProps {
  totalQuantity: number
  pendingQuantity: number
  toReceiveCents: number
}

export function WeekTotalsCard({ totalQuantity, pendingQuantity, toReceiveCents }: WeekTotalsCardProps) {
  return (
    <div className="bg-primary text-primary-foreground rounded-sm p-6 flex flex-col justify-between min-h-72.5">
      <span className="font-mono uppercase tracking-widest text-xl text-primary-foreground">
        Total da semana
      </span>
      <div className="my-4">
        <div className="font-heading font-extrabold text-[84px] leading-[0.82] tracking-[-0.04em] mb-1">
          {totalQuantity}
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="bg-white/30 rounded-sm px-3.25 py-2.25 font-extrabold text-sm flex-1">
          <span className="block font-mono text-[9.5px] font-normal uppercase tracking-widest opacity-80 mb-0.5">
            A produzir
          </span>
          {pendingQuantity} marmita{pendingQuantity !== 1 ? 's' : ''}
        </div>
        <div className="bg-white/30 rounded-sm px-3.25 py-2.25 font-extrabold text-sm flex-1">
          <span className="block font-mono text-[9.5px] font-normal uppercase tracking-widest opacity-80 mb-0.5">
            A receber
          </span>
          {formatCurrency(toReceiveCents)}
        </div>
      </div>
    </div>
  )
}
