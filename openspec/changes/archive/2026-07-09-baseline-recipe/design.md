## Context

Baseline de documentação — nenhuma mudança de comportamento. Receita é o módulo com mais regra de negócio entre os cadastros base, incluindo proteção contra edição/exclusão indevida e estimativa de custo.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `recipe` refletindo fielmente o código em produção, incluindo a estimativa de custo médio que não estava documentada no Obsidian.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.

## Decisions

- **Proteção por pedidos pendentes**: `recipes.repository.ts#hasPendingOrders` conta `OrderItem` cujo `MenuItem.recipeId` bate com a receita e cujo `Order.status = 'pending'`. Pedidos `produced`/`paid` não contam porque o preço já está em snapshot.
- **Substituição integral na edição**: `update()` roda `deleteMany` de `recipeIngredient` e `recipePriceType` seguido de `create`, dentro de `prisma.$transaction` — não há diff parcial nem histórico de versões anteriores da composição.
- **Custo médio em duas camadas**:
  - Backend (`RecipesService#attachCosts`): calcula `averageUnitCost` por ingrediente a partir das últimas 5 `PurchaseItem` daquele ingrediente (`findRecentItemsByIngredientIds`), e o controller deriva `averageCost` (unitário × quantidade), `totalAverageCost` e `isPartialAverageCost` para a listagem/detalhe da receita.
  - Frontend (`RecipeIngredientRow.tsx`): recalcula uma estimativa ao vivo durante a edição usando `useIngredientPriceSeries`, antes mesmo de salvar — não depende do valor já persistido na receita.
- **Última vez no cardápio**: `includeMenuItems` no repositório busca o `MenuItem` ativo mais recente (orderBy `createdAt desc`, take 1) e o controller formata como `Semana X/AAAA`.

## Risks / Trade-offs

- [Risco] A estimativa de custo é baseada em média simples das últimas compras, não em FIFO/custo real de estoque → Mitigação: é uma estimativa auxiliar declarada como tal na UI ("≈"), não um valor contábil oficial.
