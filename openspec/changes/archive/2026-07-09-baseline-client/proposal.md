## Why

O projeto adotou OpenSpec para desenvolvimento orientado a specs, mas o módulo de Clientes já está implementado em produção. É preciso registrar um baseline que descreva o comportamento atual do sistema, para que futuras mudanças possam ser propostas como deltas sobre uma spec real em vez de partir do zero.

## What Changes

- Documentar a capability `client` como ela existe hoje: cadastro de clientes recorrentes, vínculo obrigatório a um grupo, edição via modal compartilhado com a tela de Pedidos, e soft delete em cascata ao excluir o grupo.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `client`: Cadastro e gestão de clientes recorrentes, vinculados a um grupo, com listagem, criação, edição e exclusão em cascata via grupo.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/client/*`, `apps/backend/src/{controllers,services,repositories,routes}/clients.*`, `apps/frontend/src/{app/(private)/clientes, components/modules/clientes, components/view/clientes, hooks/useClients.ts}`.
- Nenhum código será alterado por este change.
