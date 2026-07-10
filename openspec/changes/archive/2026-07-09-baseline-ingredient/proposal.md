## Why

Continuação do baseline de OpenSpec. Ingredientes são a base de Receitas e Compras — precisa de spec própria antes de propor mudanças nesses módulos dependentes.

## What Changes

- Documentar a capability `ingredient` como ela existe hoje: cadastro com nome único e unidade de medida, disponível via tela própria e via modal inline em Receitas/Compras, soft delete para preservar histórico.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `ingredient`: Cadastro base de ingredientes com nome único e unidade de medida, usado por Receitas e Compras.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/ingredient/*`, `apps/backend/src/{controllers,services,repositories,routes}/ingredients.*`, `apps/frontend/src/{app/(private)/ingredientes, components/modules/ingredients, components/view/ingredients, hooks/useIngredients.ts}`.
- Nenhum código será alterado por este change.
