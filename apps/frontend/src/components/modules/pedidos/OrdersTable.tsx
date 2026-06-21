'use client'

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

interface OrdersTableProps {
  orders: OrderResponse[]
  onFeitoToggle: (order: OrderResponse) => void
  onPagoToggle: (order: OrderResponse) => void
  onEdit: (order: OrderResponse) => void
}

export function OrdersTable({ orders, onFeitoToggle, onPagoToggle, onEdit }: OrdersTableProps) {
  'use no memo'
  const columns = getOrderColumns({ onFeitoToggle, onPagoToggle, onEdit })

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
            const isDone = row.original.status === 'produced' || row.original.status === 'paid'
            return (
              <TableRow
                key={row.id}
                className={cn(
                  'transition-colors',
                  isDone ? 'bg-pix-faint hover:bg-pix-faint' : 'hover:bg-secondary',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4.5 py-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
