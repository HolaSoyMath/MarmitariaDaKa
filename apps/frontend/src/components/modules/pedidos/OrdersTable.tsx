'use client'

import { Fragment } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { getOrderColumns } from '@/types/columnDefs/orderColumns'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

interface OrdersTableProps {
  orders: OrderResponse[]
  menuItemById: Map<string, MenuItemResponse>
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onFeitoToggle: (order: OrderResponse) => void
  onPagoToggle: (order: OrderResponse) => void
  onEdit: (order: OrderResponse) => void
}

export function OrdersTable({
  orders,
  menuItemById,
  expandedIds,
  onToggleExpand,
  onFeitoToggle,
  onPagoToggle,
  onEdit,
}: OrdersTableProps) {
  'use no memo'
  const columns = getOrderColumns({ expandedIds, onToggleExpand, onFeitoToggle, onPagoToggle, onEdit })

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint px-4.5"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            const order = row.original
            const isDone = order.status === 'produced' || order.status === 'paid'
            const isExpanded = expandedIds.has(order.id)
            return (
              <Fragment key={row.id}>
                <TableRow
                  className={cn(
                    'transition-colors',
                    isDone ? 'bg-pix-faint hover:bg-pix-faint' : 'hover:bg-secondary',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {isExpanded && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={row.getVisibleCells().length} className="px-4.5 pt-0 pb-3.5 bg-secondary/40">
                      <div
                        className="flex flex-col animate-in fade-in slide-in-from-top-1 duration-200"
                        style={{ paddingLeft: '58px' }}
                      >
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
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
