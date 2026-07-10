## Why

Continuação do baseline de OpenSpec. Pedidos é o coração da operação semanal — depende de Clientes, Cardápio e Tipos de Preço, e alimenta o Financeiro. Precisa de spec própria antes de propor mudanças neste módulo central.

## What Changes

- Documentar a capability `order` como ela existe hoje: registro de pedido com um ou mais itens, snapshot imutável de preço no momento da criação, máquina de status `pending → produced → paid` com reversões permitidas, edição/exclusão restritas a pedidos pendentes, e itens de quantidade zero ignorados ao salvar.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `order`: Registro de pedidos de clientes por semana, com itens do cardápio, snapshot de preço e controle de status de produção/pagamento.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/order/*`, `apps/backend/src/{controllers,services,repositories,routes}/orders.*`, `apps/frontend/src/{app/(private)/pedidos, components/modules/pedidos, components/view/pedidos, hooks/useOrders.ts, hooks/useOrderSheet.ts}`.
- Nenhum código será alterado por este change.

## Nota de consistência

Foram identificadas duas divergências entre a documentação existente e o comportamento real do código. A spec segue o código, que é a fonte da verdade — vale atualizar a documentação separadamente:

1. `apps/backend/CLAUDE.md` descreve o status `paid` como irreversível, mas `OrdersService#revertToProduced` e `#revertToPending` permitem reverter um pedido pago.
2. `obsidian/Pedidos.md` afirma que a tela de Pedidos é somente leitura para status e que as ações de produção/pagamento ocorrem exclusivamente na Home, mas `OrdersView.tsx` implementa os mesmos controles de mudança de status (marcar produzido, marcar pago, desmarcar pagamento) diretamente na tela de Pedidos.
