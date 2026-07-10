## Why

Continuação do baseline de OpenSpec. Custos Gerais, junto com Compras, forma o custo total da semana usado pelo Financeiro — precisa de spec própria antes de propor mudanças nesses módulos.

## What Changes

- Documentar a capability `general-cost` como ela existe hoje: custos manuais (descrição livre + valor, editáveis e removíveis) e o custo automático de gás (criado e recalculado por Compras, protegido contra edição e exclusão manual).
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `general-cost`: Custos fixos da semana além de ingredientes, incluindo custos manuais e o custo automático de gás protegido contra alteração manual.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/generalCost/*`, `apps/backend/src/{controllers,services,repositories,routes}/generalCosts.*`.
- Nenhum código será alterado por este change.
