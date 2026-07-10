## Why

Continuação do baseline de OpenSpec. Compras alimenta o custo de gás automático e o cálculo de custo médio de receitas — precisa de spec própria antes de propor mudanças nesses módulos dependentes.

## What Changes

- Documentar a capability `purchase` como ela existe hoje: uma única compra editável por semana, itens com valor unitário calculado e congelado como snapshot, local opcional, e recálculo automático do custo de gás (percentual configurável) toda vez que a lista de compras é salva.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `purchase`: Registro único por semana das compras de ingredientes, com snapshot de valor unitário e recálculo automático do custo de gás.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/purchase/*`, `apps/backend/src/{controllers,services,repositories,routes}/purchases.*`, `apps/backend/src/repositories/config.repository.ts` (percentual de gás), `apps/frontend/src/{app/(private)/compras, components/modules/compras}`.
- Nenhum código será alterado por este change.
