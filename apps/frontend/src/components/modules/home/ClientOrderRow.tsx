import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { orderPixTotal, orderSwileTotal, shortAmount } from './homeUtils'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'
import { ChevronRight } from 'lucide-react'

interface ClientOrderRowProps {
  order: OrderResponse
  isExpanded: boolean
  isLast: boolean
  menuItemById: Map<string, MenuItemResponse>
  onToggleExpand: (id: string) => void
  onProducedToggle: (order: OrderResponse) => void
}

export function ClientOrderRow({
  order,
  isExpanded,
  isLast,
  menuItemById,
  onToggleExpand,
  onProducedToggle,
}: ClientOrderRowProps) {
  const isProduced = order.status === 'produced' || order.status === 'paid'
  const pixTotal = orderPixTotal(order)
  const swileTotal = orderSwileTotal(order)

  return (
    <div className={cn(!isLast && 'border-b border-border')}>
      {/* Desktop row */}
      <div
        className="hidden md:grid gap-3 items-center px-5.5 hover:bg-secondary transition-colors"
        style={{ gridTemplateColumns: '30px 26px 1fr 130px 130px' }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onProducedToggle(order)}
          disabled={order.status === 'paid'}
          className={cn(
            'size-6 rounded-sm border-2 transition-all justify-self-center',
            isProduced
              ? 'bg-pix border-pix text-white hover:bg-pix/90 hover:text-white'
              : 'bg-card border-border-strong hover:border-pix hover:bg-card',
          )}
        >
          {isProduced && (
            <span className="text-[15px] font-extrabold leading-none">✓</span>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onToggleExpand(order.id)}
          className="grid h-auto w-full gap-3 items-center py-3.5 px-0 rounded-none text-left justify-start font-normal hover:bg-transparent"
          style={{ gridColumn: '2 / -1', gridTemplateColumns: '26px 1fr 130px 130px' }}
        >
          <span
            className={cn(
              'text-[13px] text-ink-faint transition-transform duration-200 justify-self-center inline-block',
              isExpanded && 'rotate-90',
            )}
          >
            <ChevronRight />
          </span>
          <span className="font-bold text-[15px]">
            {order.client.name}
            <small className="ml-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint font-medium">
              {order.client.group.name}
            </small>
          </span>
          <span className="text-right text-pix font-bold text-sm whitespace-nowrap">
            <small className="font-mono text-[9px] uppercase tracking-widest opacity-80">Pix</small>{' '}
            R${' '}
            <b className="font-heading font-extrabold text-[18px] ml-1">{shortAmount(pixTotal)}</b>
          </span>
          <span className="text-right text-swile font-bold text-sm whitespace-nowrap">
            <small className="font-mono text-[9px] uppercase tracking-widest opacity-80">Swile</small>{' '}
            R${' '}
            <b className="font-heading font-extrabold text-[18px] ml-1">{shortAmount(swileTotal)}</b>
          </span>
        </Button>
      </div>

      {/* Mobile row */}
      <div className="flex md:hidden items-center gap-3 px-4 py-3.5 hover:bg-secondary transition-colors">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onProducedToggle(order)}
          disabled={order.status === 'paid'}
          className={cn(
            'size-6 flex-none rounded-sm border-2 transition-all',
            isProduced
              ? 'bg-pix border-pix text-white hover:bg-pix/90 hover:text-white'
              : 'bg-card border-border-strong hover:border-pix hover:bg-card',
          )}
        >
          {isProduced && (
            <span className="text-[15px] font-extrabold leading-none">✓</span>
          )}
        </Button>
        <button
          onClick={() => onToggleExpand(order.id)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span
            className={cn(
              'text-[13px] text-ink-faint transition-transform duration-200 inline-block',
              isExpanded && 'rotate-90',
            )}
          >
            ›
          </span>
          <span className="flex-1 font-bold text-[15px]">
            {order.client.name}
            <small className="ml-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint font-medium">
              {order.client.group.name}
            </small>
          </span>
          <span className="text-pix font-bold text-sm whitespace-nowrap">
            R$ <b className="font-heading font-extrabold text-[16px]">{shortAmount(pixTotal)}</b>
          </span>
        </button>
      </div>

      {/* Expanded body */}
      {isExpanded && (
        <div className="pb-4 pr-5.5" style={{ paddingLeft: '88px' }}>
          {order.items.map((item) => {
            const menuItem = menuItemById.get(item.menuItemId)
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 py-1.5 text-muted-foreground text-sm"
              >
                <span className="font-heading font-extrabold text-xl min-w-6 text-foreground">
                  {item.quantity}
                </span>
                <span>
                  Marmita{item.quantity !== 1 ? 's' : ''} de{' '}
                  <b>{menuItem?.recipe.name ?? 'prato'}</b>
                  {' · '}
                  {item.priceType.size}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
