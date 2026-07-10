## Why

Fechamento do baseline de OpenSpec. A Home é a tela principal do sistema — painel operacional que agrega dados de Pedidos e Cardápio da semana selecionada, sem entidade de dados própria. Precisa de spec própria para que o mapeamento do sistema fique completo.

## What Changes

- Documentar a capability `home-dashboard` como ela existe hoje: card de totais da semana (quantidade total, a produzir, valor a receber), card "por prato" com os até 4 pratos mais pedidos e sua distribuição por tamanho, e a lista de clientes da semana com ações inline de marcar produzido e marcar pago.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `home-dashboard`: Painel operacional semanal que agrega Pedidos e Cardápio da semana selecionada, com ações inline de produção e pagamento.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `apps/frontend/src/{app/page.tsx, components/view/home/HomeView.tsx, components/modules/home/*}`.
- Nenhum código será alterado por este change.

## Nota de consistência

`obsidian/Home.md` descreve um dropdown na Home para selecionar Pix ou Swile e marcar um pedido como pago, e afirma que essa ação ocorre "exclusivamente" ali. No código atual, `HomeView.tsx` e `ClientOrderRow.tsx` implementam apenas a marcação de produzido/reversão para pendente (`useMarkProduced`, `useRevertToPending`) — não existe nenhum controle de marcar como pago na Home. A ação de marcar como pago (com escolha de método e diálogo de confirmação para desmarcar) está implementada apenas em `OrdersView.tsx` (tela de Pedidos), conforme já registrado na spec `order`. A spec deste change segue o código.
