"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriceTypeSheet } from "@/components/modules/precos/PriceTypeSheet";
import { usePriceTypes } from "@/hooks/usePriceTypes";
import type { PriceTypeResponse } from "@marmitaria/schemas/priceType/priceTypeResponse.schema";
import { Plus } from "lucide-react";

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function PriceTypesView() {
  const { data: priceTypes = [], isLoading } = usePriceTypes();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<PriceTypeResponse | null>(null);

  function openCreate() {
    setSelected(null);
    setSheetOpen(true);
  }

  function openEdit(priceType: PriceTypeResponse) {
    setSelected(priceType);
    setSheetOpen(true);
  }

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="rounded-sm">
          <Plus /> Novo tipo
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : priceTypes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card">
          <p className="text-muted-foreground">
            Nenhum tipo de preço cadastrado ainda.
          </p>
          <Button variant="outline" onClick={openCreate} className="rounded-sm">
            <Plus /> Cadastrar primeiro tipo
          </Button>
        </div>
      ) : (
        <div className="rounded-sm border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Pix</TableHead>
                <TableHead>Swile</TableHead>
                <TableHead className="w-25" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceTypes.map((pt) => (
                <TableRow key={pt.id}>
                  <TableCell className="font-medium">{pt.type}</TableCell>
                  <TableCell>{pt.size}</TableCell>
                  <TableCell>{formatBRL(pt.pixPrice)}</TableCell>
                  <TableCell>{formatBRL(pt.swilePrice)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(pt)}
                      className="bg-transparent hover:bg-accent rounded-sm"
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PriceTypeSheet
        key={selected?.id ?? "new"}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        priceType={selected ?? undefined}
      />
    </div>
  );
}
