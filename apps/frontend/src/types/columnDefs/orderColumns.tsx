import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/formatters/currency";
import { formatOrderItems } from "@/formatters/order";
import type { OrderResponse } from "@marmitaria/schemas/order/orderResponse.schema";
import { ChevronRight } from "lucide-react";

function OrderCheck({
  checked,
  onChange,
  disabled = false,
  variant,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  variant: "feito" | "pago";
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "size-6 rounded-[7px] border-2 transition-all disabled:opacity-40",
        variant === "feito"
          ? checked
            ? "bg-pix border-pix text-white hover:bg-pix/90 hover:text-white"
            : "bg-card border-border-strong hover:border-pix hover:bg-card"
          : checked
            ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            : "bg-card border-border-strong hover:border-primary hover:bg-card",
      )}
    >
      {checked && (
        <span className="text-[15px] font-extrabold leading-none">✓</span>
      )}
    </Button>
  );
}

function OrderValue({ order }: { order: OrderResponse }) {
  const pixTotal = order.items.reduce(
    (s, i) => s + i.snapshotPixPrice * i.quantity,
    0,
  );
  const swileTotal = order.items.reduce(
    (s, i) => s + i.snapshotSwilePrice * i.quantity,
    0,
  );

  if (order.status === "paid" && order.paymentMethod) {
    const isPix = order.paymentMethod === "Pix";
    const total = isPix ? pixTotal : swileTotal;
    return (
      <span className={cn("font-semibold", isPix ? "text-pix" : "text-swile")}>
        {order.paymentMethod}{" "}
        <b className="font-heading font-extrabold text-[17px]">
          {formatCurrency(total)}
        </b>
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-pix font-semibold">
        Pix{" "}
        <b className="font-heading font-extrabold">
          {formatCurrency(pixTotal)}
        </b>
      </span>
      <span className="text-swile font-semibold">
        Swile{" "}
        <b className="font-heading font-extrabold">
          {formatCurrency(swileTotal)}
        </b>
      </span>
    </div>
  );
}

interface OrderColumnCallbacks {
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onFeitoToggle: (order: OrderResponse) => void;
  onPagoToggle: (order: OrderResponse) => void;
  onEdit: (order: OrderResponse) => void;
}

export function getOrderColumns({
  expandedIds,
  onToggleExpand,
  onFeitoToggle,
  onPagoToggle,
  onEdit,
}: OrderColumnCallbacks): ColumnDef<OrderResponse>[] {
  return [
    {
      id: "feito",
      header: () => <span className="flex justify-center">Feito</span>,
      cell: ({ row }) => {
        const order = row.original;
        const isDone = order.status === "produced" || order.status === "paid";
        return (
          <div className="flex justify-center">
            <OrderCheck
              checked={isDone}
              onChange={() => onFeitoToggle(order)}
              disabled={order.status === "paid"}
              variant="feito"
            />
          </div>
        );
      },
      size: 34,
    },
    {
      id: "expand",
      header: "",
      cell: ({ row }) => {
        const order = row.original;
        const isExpanded = expandedIds.has(order.id);
        return (
          <Button
            type="button"
            onClick={() => onToggleExpand(order.id)}
            variant="ghost"
            className="flex items-center justify-center size-7 rounded-sm p-0 hover:bg-transparent"
          >
            <span
              className={cn(
                "text-[13px] text-ink-faint transition-transform duration-200 justify-self-center inline-block",
                isExpanded && "rotate-90",
              )}
            >
              <ChevronRight />
            </span>
          </Button>
        );
      },
    },
    {
      id: "cliente",
      header: "Cliente",
      cell: ({ row }) => {
        const { client } = row.original;
        return (
          <div>
            <span className="text-[15px] font-bold block">{client.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mt-0.5 block">
              {client.group.name}
            </span>
          </div>
        );
      },
    },
    {
      id: "itens",
      header: "Itens",
      cell: ({ row }) => {
        const order = row.original;
        const isDone = order.status === "produced" || order.status === "paid";
        return (
          <span
            className={cn(
              "text-[13.5px] text-muted-foreground line-clamp-2",
              isDone && "line-through decoration-[1.5px] text-ink-faint",
            )}
          >
            {formatOrderItems(order)}
          </span>
        );
      },
    },
    {
      id: "valor",
      header: "Valor",
      cell: ({ row }) => <OrderValue order={row.original} />,
    },
    {
      id: "pago",
      header: () => <span className="flex justify-center">Pago</span>,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex justify-center">
            <OrderCheck
              checked={order.status === "paid"}
              onChange={() => onPagoToggle(order)}
              disabled={order.status === "pending"}
              variant="pago"
            />
          </div>
        );
      },
      size: 64,
    },
    {
      id: "editar",
      header: "Editar",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(order)}
            disabled={order.status !== "pending"}
          >
            Editar
          </Button>
        );
      },
    },
  ];
}
