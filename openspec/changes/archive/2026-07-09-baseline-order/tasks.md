## 1. Baseline da capability `order`

- [x] 1.1 Schemas Zod (`orderBase`, `orderInput`, `markPaidInput`, `orderResponse`) já implementados em `shared/schemas/order/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/orders.*`, incluindo snapshot de preço, máquina de status e reversões
- [x] 1.3 Tela `/pedidos` (`OrdersView.tsx`, `OrdersTable.tsx`, `OrderSheet.tsx`, `OrderItemRow.tsx`) e hooks (`useOrders.ts`, `useOrderSheet.ts`) já implementados no frontend, incluindo os mesmos controles de status presentes na Home
- [x] 1.4 Spec `order` registrada em `openspec/specs/order/spec.md` refletindo o comportamento acima
- [x] 1.5 Divergências entre código e documentação existente (`CLAUDE.md`, Obsidian) sinalizadas no proposal.md

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/order/spec.md`
