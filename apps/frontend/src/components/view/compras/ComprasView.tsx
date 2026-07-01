'use client'

import { useMemo } from 'react'
import { useWeek } from '@/context/WeekContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { usePurchase, useUpsertPurchase } from '@/hooks/usePurchases'
import { useGeneralCosts, useCreateGeneralCost, useUpdateGeneralCost, useDeleteGeneralCost } from '@/hooks/useGeneralCosts'
import { useIngredients } from '@/hooks/useIngredients'
import { PurchaseItemsTab } from '@/components/modules/compras/PurchaseItemsTab'
import { GeneralCostsTab } from '@/components/modules/compras/GeneralCostsTab'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'

export function ComprasView() {
  const { currentWeek } = useWeek()
  const weekId = currentWeek?.id ?? null

  const { data: purchase, isLoading: purchaseLoading } = usePurchase(weekId)
  const { data: costs = [], isLoading: costsLoading } = useGeneralCosts(weekId)
  const { data: ingredients = [] } = useIngredients()

  const upsertPurchase = useUpsertPurchase()
  const createCost = useCreateGeneralCost()
  const updateCost = useUpdateGeneralCost()
  const deleteCost = useDeleteGeneralCost()

  const ingredientTotalCents = useMemo(
    () => purchase?.items?.reduce((sum, item) => sum + item.totalValue, 0) ?? 0,
    [purchase],
  )

  function handleSavePurchase(input: PurchaseInput) {
    upsertPurchase.mutate(input)
  }

  function handleCreateCost(description: string, valueCents: number) {
    if (!weekId) return
    createCost.mutate({ weekId, description, value: valueCents })
  }

  function handleUpdateCost(id: string, description: string, valueCents: number) {
    updateCost.mutate({ id, data: { description, value: valueCents } })
  }

  function handleDeleteCost(id: string) {
    deleteCost.mutate(id)
  }

  const isLoading = purchaseLoading || costsLoading

  return (
    <div className="p-7.5 flex flex-col gap-6">

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : !weekId ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center border-2 border-dashed border-border rounded-lg bg-secondary">
          <p className="text-muted-foreground">Selecione uma semana para ver as compras.</p>
        </div>
      ) : (
        <Tabs defaultValue="ingredients">
          <TabsList className="mb-4.5 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger
              value="ingredients"
              className="px-4.5 py-2.25 rounded-sm border border-border bg-card text-[14.5px] font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-none cursor-pointer hover:bg-accent"
            >
              Ingredientes
            </TabsTrigger>
            <TabsTrigger
              value="costs"
              className="px-4.5 py-2.25 rounded-sm border border-border bg-card text-[14.5px] font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-none cursor-pointer hover:bg-accent"
            >
              Custos gerais
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients">
            <PurchaseItemsTab
              purchase={purchase}
              ingredients={ingredients}
              costs={costs}
              weekId={weekId}
              onSave={handleSavePurchase}
              isSaving={upsertPurchase.isPending}
            />
          </TabsContent>
          <TabsContent value="costs">
            <GeneralCostsTab
              costs={costs}
              ingredientTotalCents={ingredientTotalCents}
              weekId={weekId}
              onCreate={handleCreateCost}
              onUpdate={handleUpdateCost}
              onDelete={handleDeleteCost}
              isCreating={createCost.isPending}
              isUpdating={updateCost.isPending}
              isDeleting={deleteCost.isPending}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
