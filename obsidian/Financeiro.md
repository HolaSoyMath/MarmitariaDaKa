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

**Custo total** — ingredientes + custos gerais + gás da semana. O dashboard separa os três (`costBreakdown`): ingredientes, custos gerais manuais e gás automático.

**Faturamento** — soma dos pedidos com status `pago` apenas. Pedidos produzidos mas não pagos **não entram** no faturamento.

**Lucro** — faturamento − custo total, com margem percentual

**Ticket médio** — faturamento ÷ número de pedidos pagos do período

**Break-even** — quantas marmitas precisariam ser vendidas para cobrir o custo do período (`custo ÷ preço médio por marmita`), comparado com a quantidade realmente vendida

---

## Comparação com período anterior

Mostra a variação percentual de faturamento, custo e lucro em relação ao período imediatamente anterior:
- Modo semana → semana anterior
- Modo mês → mês anterior
- Modo período livre → um período de mesma duração, imediatamente antes do início do período atual

Se o período anterior não existir no banco (ex: semana nunca aberta pela dona) ou tiver valor zero, a variação é exibida como "—" em vez de uma porcentagem sem sentido.

---

## Semana recorde

Ranking histórico (entre **todas** as semanas já registradas, não só o período selecionado) da semana de maior faturamento e da semana de maior lucro — podem ser semanas diferentes.

---

## Projeção do mês

No modo "por mês", projeta o faturamento esperado do mês inteiro com base na média das semanas já registradas naquele mês, multiplicada pelo total de semanas ISO que o mês abrange.

**Regra de exibição:** só aparece quando o sistema já tem pelo menos 4 semanas de histórico total (contando todas as semanas já abertas, de qualquer período) — antes disso a projeção é imprecisa demais para ser útil.

---

## Gráfico Entrou × Saiu

Barras lado a lado por período:
- Barra amarela — faturamento (entrou)
- Barra vermelha — custo (saiu)
- O lucro é a diferença entre as barras

No modo semana: uma dupla de barras. No modo mês ou período: uma dupla por semana — permite ver a evolução ao longo do tempo. A mesma série por semana também alimenta o gráfico de linha de lucro/margem e o gráfico de evolução Pix × Swile.

---

## Detalhamentos

**Pratos mais pedidos** — lista por quantidade, com drill-down por tamanho mostrando quantidade vendida e faturamento de cada tamanho

**Faturamento por tamanho** — agregação global (entre todas as receitas) por tamanho de marmita, para saber se vale focar em tamanhos maiores ou menores

**Pix vs Swile** — quantidade de pedidos e valor total recebido por cada método de pagamento, incluindo ticket médio por método; também disponível como série temporal (evolução do mix de pagamento ao longo das semanas)

**Ranking de ingredientes por custo** — soma histórica total (`totalValue`) de cada ingrediente nas compras, mais a variação percentual do valor unitário entre a primeira e a última compra registrada. Clicando num ingrediente, mostra a evolução completa do preço unitário e um recorte das últimas 5 compras.

**"Há quanto tempo o prato não sai"** — para cada receita ativa, a última vez que ela apareceu em um pedido `pago` ou `produzido` (não confundir com "última vez no cardápio", que é sobre `Cardápio & Receitas`, não sobre venda de fato). Receitas nunca vendidas aparecem como "nunca vendida".

**Ranking de clientes e de grupos** — quem mais compra (quantidade) e mais gasta (R$), considerando **apenas pedidos pagos** — mesmo critério cash-based do resto do Financeiro, para não ter duas definições de "pedido válido" na mesma tela. Por padrão é histórico total, não limitado ao período selecionado.

**Sazonalidade** — compara o mesmo período (semana, mês ou ano) entre anos diferentes, com a granularidade escolhida pela dona.

**Resumo em linguagem natural** — alertas automáticos gerados a partir dos dados já calculados: variação de lucro vs período anterior, valor a receber, e prato que não sai há mais de 4 semanas.

---

## Regras

- Faturamento considera apenas pedidos `pago` — é o dinheiro efetivamente recebido
- Ranking de clientes/grupos também considera apenas pedidos `pago`, pelo mesmo motivo
- O custo da semana vem do painel consolidado de [[CustosGerais]]
- Alterações retroativas em preços ou custos não afetam relatórios já gerados — tudo é snapshot
- Toda ordenação cronológica (séries temporais, semana recorde, sazonalidade, evolução de preço de ingrediente) usa `(ano, número da semana)` da própria `Semana`, nunca a data de criação do registro — edições retroativas de compras não bagunçam a ordem

---

## Relacionamentos

- [[Pedidos]] — faturamento, rankings e "prato que não sai" vêm dos pedidos
- [[CustosGerais]] — custo total da semana vem daqui
- [[Compras]] — ranking e evolução de preço de ingredientes vêm das compras
- [[Receitas]] — "prato que não sai" cobre apenas receitas ativas
- [[Clientes]], [[Grupos]] — base do ranking de clientes e grupos