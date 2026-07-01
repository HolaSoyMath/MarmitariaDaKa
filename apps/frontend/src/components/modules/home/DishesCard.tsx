import { cn } from '@/lib/utils'
import type { DishSummary } from './homeUtils'

interface DishesCardProps {
  dishSlots: (DishSummary | null)[]
}

export function DishesCard({ dishSlots }: DishesCardProps) {
  return (
    <div className="border border-border rounded-sm bg-card p-5.5 flex flex-col">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-heading font-bold text-[18px]">Por prato</span>
      </div>
      <div className="grid grid-cols-2 gap-x-5.5 mt-1.5 flex-1">
        {dishSlots.map((dish, idx) => (
          <div
            key={dish?.menuItemId ?? `empty-${idx}`}
            className={cn(
              'flex items-start gap-3.5 py-3.25',
              idx < 2 && 'border-b border-border',
              !dish && 'opacity-40',
            )}
          >
            <span
              className={cn(
                'font-heading font-extrabold text-[32px] min-w-9 leading-none',
                dish ? 'text-mustard-dark' : 'text-ink-faint',
              )}
            >
              {dish ? dish.totalQty : '—'}
            </span>
            <div className="flex-1">
              <b className="font-bold text-[15.5px]">
                {dish ? dish.recipeName : `${idx + 1}º prato`}
              </b>
              <div className="flex gap-1.5 mt-1.75 flex-wrap">
                {dish ? (
                  dish.sizes.map((s) => (
                    <span
                      key={s.size}
                      className="inline-flex items-center border border-border-strong rounded-full px-2.75 py-0.5 text-xs font-semibold text-muted-foreground whitespace-nowrap bg-muted"
                    >
                      {s.size} · {s.qty}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center border border-border-strong border-dashed rounded-full px-2.75 py-0.5 text-xs font-semibold text-muted-foreground whitespace-nowrap bg-transparent">
                    livre
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
