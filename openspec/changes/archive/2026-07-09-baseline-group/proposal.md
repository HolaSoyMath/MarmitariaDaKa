## Why

Continuação do baseline de OpenSpec para o sistema já implementado. O módulo de Grupos é a contraparte de [[client]] e precisa de spec própria para futuras mudanças serem propostas como deltas.

## What Changes

- Documentar a capability `group` como ela existe hoje: nome único, gerenciamento via modal na tela de Clientes (criar, renomear, excluir), e exclusão em cascata sobre os clientes associados com confirmação explícita na UI.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `group`: Agrupamento de clientes por categoria, com nome único, gerenciado via modal, e exclusão em cascata sobre clientes associados.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/group/*`, `apps/backend/src/{controllers,services,repositories,routes}/groups.*`, `apps/frontend/src/{components/modules/clientes/GroupsDialog.tsx, hooks/useGroups.ts}`.
- Nenhum código será alterado por este change.
