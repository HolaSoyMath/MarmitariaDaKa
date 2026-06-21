"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGroups,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
} from "@/hooks/useGroups";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupsDialog({ open, onOpenChange }: Props) {
  const { data: groups = [] } = useGroups();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();

  function startRename(id: string, currentName: string) {
    setRenamingId(id);
    setRenameValue(currentName);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameValue("");
  }

  async function handleRename(id: string) {
    const name = renameValue.trim();
    if (!name) return;
    try {
      await updateGroup.mutateAsync({ id, data: { name } });
      cancelRename();
    } catch {}
  }

  async function handleCreate() {
    const name = newGroupName.trim();
    if (!name) return;
    try {
      await createGroup.mutateAsync({ name });
      setNewGroupName("");
    } catch {}
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    try {
      await deleteGroup.mutateAsync(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch {}
  }

  const confirmDeleteGroup = groups.find((g) => g.id === confirmDeleteId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Grupos</DialogTitle>
            <DialogDescription>
              Organize os clientes por categoria.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1">
            {groups.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">
                Nenhum grupo cadastrado.
              </p>
            )}
            {groups.map((group) => (
              <div key={group.id} className="flex items-center gap-2 py-1.5">
                {renamingId === group.id ? (
                  <>
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(group.id);
                        if (e.key === "Escape") cancelRename();
                      }}
                      className="h-8 flex-1"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={cancelRename}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRename(group.id)}
                      disabled={!renameValue.trim() || updateGroup.isPending}
                    >
                      Salvar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {group.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startRename(group.id, group.name)}
                    >
                      Renomear
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setConfirmDeleteId(group.id)}
                    >
                      Excluir
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Input
              placeholder="Novo grupo"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8"
            />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!newGroupName.trim() || createGroup.isPending}
            >
              Adicionar
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title="Excluir grupo?"
        description={
          <>
            Todos os clientes do grupo <b>{confirmDeleteGroup?.name}</b> serão
            desativados junto. Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Sim, excluir"
        onConfirm={handleDelete}
        isPending={deleteGroup.isPending}
      />
    </>
  );
}
