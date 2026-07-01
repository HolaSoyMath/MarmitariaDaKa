"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSave: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  saveButtonDisabled?: boolean;
  resetKey?: string | number;
  children?: React.ReactNode;
}

export function SheetBase({
  open,
  onOpenChange,
  children,
  title,
  onSave,
  onCancel,
  saveButtonDisabled = false,
  resetKey,
}: Props) {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0 bg-background">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>

          {children && (
            <div key={resetKey} className="flex flex-col gap-5 px-6 py-6 flex-1">
              {children}
            </div>
          )}

          <SheetFooter className="px-6 py-4 border-t flex-row gap-2 justify-end">
            {onCancel && (
              <Button
                variant="ghost"
                onClick={() => {
                  onOpenChange(false);
                  onCancel?.();
                }}
                className="rounded-sm"
              >
                Cancelar
              </Button>
            )}
            {onSave && (
              <Button
                onClick={onSave}
                disabled={saveButtonDisabled}
                className="rounded-sm"
              >
                Salvar
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
