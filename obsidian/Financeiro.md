# Financeiro

## O que é

Relatório financeiro da marmitaria. Mostra quanto entrou, quanto saiu e qual foi o lucro — por semana, por mês ou por período livre.

---

## Modos de visualização

- **Por semana** — usa a semana selecionada no week picker
- **Por mês** — a dona escolhe o mês; o sistema agrupa todas as semanas dele
- **Período livre** — date range picker com data início e data fim

---

## Métricas principais

**Custo total** — ingredientes + custos gerais + gás da semana

**Faturamento** — soma dos pedidos com status `pago` apenas. Pedidos produzidos mas não pagos **não entram** no faturamento.

**Lucro** — faturamento − custo total, com margem percentual

---

## Gráfico Entrou × Saiu

Barras lado a lado por período:
- Barra amarela — faturamento (entrou)
- Barra vermelha — custo (saiu)
- O lucro é a diferença entre as barras

No modo semana: uma dupla de barras. No modo mês ou período: uma dupla por semana — permite ver a evolução ao longo do tempo.

---

## Detalhamentos

**Pratos mais pedidos** — lista por quantidade, com drill-down por tamanho mostrando quantidade vendida e faturamento de cada tamanho

**Pix vs Swile** — quantidade de pedidos e valor total recebido por cada método de pagamento

---

## Regras

- Faturamento considera apenas pedidos `pago` — é o dinheiro efetivamente recebido
- O custo da semana vem do painel consolidado de [[CustosGerais]]
- Alterações retroativas em preços ou custos não afetam relatórios já gerados — tudo é snapshot

---

## Relacionamentos

- [[Pedidos]] — faturamento vem dos pedidos pagos
- [[CustosGerais]] — custo total da semana vem daqui