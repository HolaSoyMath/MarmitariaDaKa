"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreatePriceType,
  useUpdatePriceType,
  useDeletePriceType,
} from "@/hooks/usePriceTypes";
import type { PriceTypeResponse } from "@marmitaria/schemas/priceType/priceTypeResponse.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceType?: PriceTypeResponse;
}

function centsToReais(cents: number) {
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
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const createPriceType = useCreatePriceType();
  const updatePriceType = useUpdatePriceType();
  const deletePriceType = useDeletePriceType();

  const isSaving = createPriceType.isPending || updatePriceType.isPending;

  const pixCents = reaisToCents(form.pixPrice || "0");
  const swileCents = reaisToCents(form.swilePrice || "0");
  const isValid =
    form.type.trim().length > 0 &&
    form.size.trim().length > 0 &&
    !isNaN(pixCents) &&
    pixCents >= 0 &&
    !isNaN(swileCents) &&
    swileCents >= 0;

  async function handleSave() {
    if (!isValid) return;
    const payload = {
      type: form.type.trim(),
      size: form.size.trim(),
      pixPrice: pixCents,
      swilePrice: swileCents,
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
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle>
              {isEditing ? "Editar tipo de preço" : "Novo tipo de preço"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-6 py-6 flex-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pt-type">Tipo</Label>
              <Input
                id="pt-type"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                placeholder="ex: Marmita"
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
                />
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-row gap-2">
            {isEditing && (
              <Button
                variant="destructive"
                className="mr-auto"
                onClick={() => setConfirmOpen(true)}
                disabled={deletePriceType.isPending}
              >
                Remover
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              Salvar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

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
