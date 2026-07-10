"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreatePriceType,
  useUpdatePriceType,
  useDeletePriceType,
} from "@/hooks/usePriceTypes";
import { maskCentsInput } from "@/formatters/currency";
import type { PriceTypeResponse } from "@marmitaria/schemas/priceType/priceTypeResponse.schema";
import { SheetBase } from "@/components/ui/SheetBase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceType?: PriceTypeResponse;
}

function centsToReais(cents: number) {
  return (cents / 100).toFixed(2);
}

function centsToReaisComma(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function reaisToCents(value: string) {
  return Math.round(parseFloat(value.replace(",", ".")) * 100);
}

export function PriceTypeSheet({ open, onOpenChange, priceType }: Props) {
  const isEditing = !!priceType;

  const [form, setForm] = useState({
    type: priceType?.type ?? "",
    size: priceType?.size ?? "",
    pixPrice: priceType ? centsToReais(priceType.pixPrice) : "",
    swilePrice: priceType ? centsToReais(priceType.swilePrice) : "",
    additionalCost: priceType ? centsToReaisComma(priceType.additionalCost) : "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const createPriceType = useCreatePriceType();
  const updatePriceType = useUpdatePriceType();
  const deletePriceType = useDeletePriceType();

  const isSaving = createPriceType.isPending || updatePriceType.isPending;

  const pixCents = reaisToCents(form.pixPrice || "0");
  const swileCents = reaisToCents(form.swilePrice || "0");
  const additionalCents = reaisToCents(form.additionalCost || "0");
  const isValid =
    form.type.trim().length > 0 &&
    form.size.trim().length > 0 &&
    !isNaN(pixCents) &&
    pixCents >= 0 &&
    !isNaN(swileCents) &&
    swileCents >= 0 &&
    !isNaN(additionalCents) &&
    additionalCents >= 0;

  async function handleSave() {
    if (!isValid) return;
    const payload = {
      type: form.type.trim(),
      size: form.size.trim(),
      pixPrice: pixCents,
      swilePrice: swileCents,
      additionalCost: additionalCents,
    };
    if (isEditing) {
      await updatePriceType.mutateAsync({ id: priceType.id, data: payload });
    } else {
      await createPriceType.mutateAsync(payload);
    }
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!priceType) return;
    await deletePriceType.mutateAsync(priceType.id);
    setConfirmOpen(false);
    onOpenChange(false);
  }

  return (
    <>
      <SheetBase
        resetKey={priceType?.id ?? "new"}
        open={open}
        onOpenChange={onOpenChange}
        title={isEditing ? "Editar tipo de preço" : "Novo tipo de preço"}
        onSave={handleSave}
        onCancel={() => {}}
        onDelete={isEditing ? () => setConfirmOpen(true) : undefined}
        deleteButtonDisabled={deletePriceType.isPending}
        saveButtonDisabled={!isValid || isSaving}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="pt-type">Tipo</Label>
          <Input
            id="pt-type"
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value }))
            }
            placeholder="ex: Marmita"
            className="bg-card rounded-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pt-size">Tamanho</Label>
          <Input
            id="pt-size"
            value={form.size}
            onChange={(e) =>
              setForm((f) => ({ ...f, size: e.target.value }))
            }
            placeholder="ex: G"
            className="bg-card rounded-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="pt-pix">Preço Pix (R$)</Label>
            <Input
              id="pt-pix"
              type="number"
              min="0"
              step="0.01"
              value={form.pixPrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, pixPrice: e.target.value }))
              }
              placeholder="0,00"
              className="bg-card rounded-sm"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="pt-swile">Preço Swile (R$)</Label>
            <Input
              id="pt-swile"
              type="number"
              min="0"
              step="0.01"
              value={form.swilePrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, swilePrice: e.target.value }))
              }
              placeholder="0,00"
              className="bg-card rounded-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pt-additional">Custo adicional (R$)</Label>
          <span className="inline-flex items-center border border-input rounded-sm bg-card">
            <span className="text-muted-foreground text-[13px] pl-3">R$</span>
            <Input
              id="pt-additional"
              type="text"
              inputMode="decimal"
              value={form.additionalCost}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  additionalCost: maskCentsInput(e.target.value),
                }))
              }
              placeholder="0,00"
              className="border-0 shadow-none bg-transparent pl-1.5 focus-visible:ring-0"
            />
          </span>
          <p className="text-xs text-muted-foreground">
            Pote, fita, adesivo e outros custos fixos desse tamanho — soma no custo médio da receita.
          </p>
        </div>
      </SheetBase>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover tipo de preço?"
        description={
          <>
            <b>
              {priceType?.type} {priceType?.size}
            </b>{" "}
            será removido do cadastro. Essa ação não pode ser desfeita.
          </>
        }
        onConfirm={handleDelete}
        isPending={deletePriceType.isPending}
      />
    </>
  );
}
