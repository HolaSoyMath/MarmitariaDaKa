import { ClientOrderRow } from './ClientOrderRow'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

interface ClientOrdersAccordionProps {
  orders: OrderResponse[]
  menuItemById: Map<string, MenuItemResponse>
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onProducedToggle: (order: OrderResponse) => void
}

export function ClientOrdersAccordion({
  orders,
  menuItemById,
  expandedIds,
  onToggleExpand,
  onProducedToggle,
}: ClientOrdersAccordionProps) {
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden shadow-sm">
      {/* Header row */}
      <div
        className="hidden md:grid gap-3 px-5.5 py-3 border-b border-border"
        style={{ gridTemplateColumns: '30px 26px 1fr 130px 130px' }}
      >
        <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-faint text-center">
          ✓
        </span>
        <span />
        <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-faint">
          Cliente
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-faint text-right">
          a pagar (Pix)
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-faint text-right">
          a pagar (Swile)
        </span>
      </div>

      {/* Order rows */}
      {orders.map((order, idx) => (
        <ClientOrderRow
          key={order.id}
          order={order}
          isExpanded={expandedIds.has(order.id)}
          isLast={idx === orders.length - 1}
          menuItemById={menuItemById}
          onToggleExpand={onToggleExpand}
          onProducedToggle={onProducedToggle}
        />
      ))}
    </div>
  )
}
