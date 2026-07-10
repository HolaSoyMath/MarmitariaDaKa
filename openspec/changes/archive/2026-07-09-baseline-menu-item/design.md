## Context

Baseline de documentação — nenhuma mudança de comportamento. `menuItem` é a junção entre `week` e `recipe`, com um subconjunto próprio de `priceType` por semana via tabela `menuItemPriceType`.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `menu-item` refletindo fielmente o código em produção.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não documenta aqui como os itens do cardápio são consumidos em Pedidos — isso pertence à spec `order`.

## Decisions

- **Validação de tamanhos em duas etapas**: `assertValidPriceTypeIds` busca os `priceTypeId` cadastrados na receita (`getRecipePriceTypeIds`) e rejeita qualquer id fora dessa lista — tanto na criação quanto na atualização de tamanhos.
- **Uma receita por semana**: verificado via `findByWeekAndRecipe` antes de criar, retornando `ConflictError` se já existir.
- **Substituição de tamanhos em transação**: `updatePriceTypes` remove todos os `menuItemPriceType` e recria a partir da nova lista, dentro de `prisma.$transaction`.
- **Bloqueio por pedidos pendentes**: mesma lógica de `recipe`, mas escopada por `menuItemId` em vez de `recipeId` — pedidos `produced`/`paid` não bloqueiam porque o preço já está em snapshot.

## Risks / Trade-offs

- Nenhum risco relevante identificado além dos já cobertos pela spec `recipe` (bloqueio de remoção).
