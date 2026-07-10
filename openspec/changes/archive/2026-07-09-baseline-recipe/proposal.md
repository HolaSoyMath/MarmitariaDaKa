## Why

Continuação do baseline de OpenSpec. Receitas são pré-requisito do Cardápio e dependem de Ingredientes e Tipos de Preço — precisa de spec própria antes de propor mudanças nesses módulos.

## What Changes

- Documentar a capability `recipe` como ela existe hoje: cadastro com nome único, composição de ingredientes, tamanhos (tipos de preço) obrigatórios, flag de ativa/inativa, bloqueio de edição/exclusão quando há pedidos pendentes, e estimativa de custo médio por ingrediente e por receita baseada no histórico recente de compras.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `recipe`: Cadastro de receitas com ingredientes, tamanhos disponíveis, controle de ativa/inativa, proteção contra edição/exclusão com pedidos pendentes, e estimativa de custo médio.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/recipe/*`, `apps/backend/src/{controllers,services,repositories,routes}/recipes.*`, `apps/frontend/src/{app/(private)/receitas, components/modules/receitas, components/view/receitas, hooks/useRecipes.ts}`.
- Nenhum código será alterado por este change.
