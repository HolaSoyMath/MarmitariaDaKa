## Why

Continuação e fechamento do baseline de OpenSpec. Financeiro é o relatório consolidado que consome todos os demais módulos (Pedidos, Custos Gerais, Compras, Receitas, Clientes, Grupos) — precisa de spec própria para fechar o mapeamento do sistema.

## What Changes

- Documentar a capability `financial` como ela existe hoje: relatório por semana, mês ou período livre, com métricas principais (custo, faturamento, lucro, ticket médio, break-even), comparação com período anterior, semana recorde histórica, projeção do mês, gráficos de série temporal, e detalhamentos (pratos mais pedidos, faturamento por tamanho, Pix vs Swile, ranking de ingredientes por custo, "prato que não sai", ranking de clientes/grupos, sazonalidade, resumo em linguagem natural).
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `financial`: Relatório financeiro consolidado (faturamento, custo, lucro e detalhamentos analíticos) por semana, mês ou período livre, sempre com critério cash-based (apenas pedidos pagos contam como faturamento).

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/financial/*`, `apps/backend/src/{routes/financial.ts, services/financial.service.ts}`, `apps/frontend/src/{app/(private)/financeiro, components/modules/financeiro}`.
- Nenhum código será alterado por este change.
