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
import { Badge } from "@/components/ui/badge";
import { ClientSheet } from "@/components/modules/clientes/ClientSheet";
import { GroupsDialog } from "@/components/modules/clientes/GroupsDialog";
import { useClients } from "@/hooks/useClients";
import { Plus, UsersRound } from "lucide-react";
import type { ClientResponse } from "@marmitaria/schemas/client/clientResponse.schema";

export function ClientsView() {
  const { data: clients = [], isLoading } = useClients();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(
    null,
  );
  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false);

  function openCreate() {
    setSelectedClient(null);
    setSheetOpen(true);
  }

  function openEdit(client: ClientResponse) {
    setSelectedClient(client);
    setSheetOpen(true);
  }

  const orderedClientes = [...clients].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setGroupsDialogOpen(true)}
            className="rounded-sm"
          >
            <UsersRound />
            Grupos
          </Button>
          <Button onClick={openCreate} className="rounded-sm">
            <Plus /> Novo cliente
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : orderedClientes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card">
          <p className="text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </p>
          <Button variant="outline" onClick={openCreate} className="rounded-sm">
            <Plus /> Cadastrar primeiro cliente
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead className="w-25" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedClientes.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.group.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(client)}
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

      <ClientSheet
        key={selectedClient?.id ?? "new"}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        client={selectedClient ?? undefined}
        onOpenGroups={() => setGroupsDialogOpen(true)}
      />

      <GroupsDialog
        open={groupsDialogOpen}
        onOpenChange={setGroupsDialogOpen}
      />
    </div>
  );
}
