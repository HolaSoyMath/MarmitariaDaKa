## Context

Baseline de documentação — nenhuma mudança de comportamento. Financeiro é o módulo mais amplo do sistema, consumindo dados de Pedidos, Custos Gerais, Compras, Receitas, Clientes e Grupos. O Obsidian (`obsidian/Financeiro.md`) foi atualizado na própria sessão de implementação (2026-07-02) e é a fonte mais confiável entre os módulos documentados.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `financial` refletindo fielmente o comportamento já implementado e validado manualmente contra dados reais.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não reabre decisões de escopo já cortadas pela dona (metas mensais, heatmap por dia da semana, clientes em risco de churn, penetração semanal, lucro por prato, rentabilidade por cliente, histórico de alteração de preço de venda) — essas ficam fora da spec por não existirem no sistema.

## Decisions

- **Endpoints por responsabilidade**: cada agregação vive em seu próprio endpoint (`/financial`, `/financial/timeseries`, `/financial/comparison`, `/financial/record-week`, `/financial/ingredient-costs`, `/financial/dish-last-sold`, `/financial/client-ranking`, `/financial/group-ranking`, `/financial/seasonality`) em vez de um payload único gigante — permite que o frontend carregue cada seção do dashboard de forma independente.
- **Critério cash-based único**: faturamento, ranking de clientes e ranking de grupos usam a mesma definição de "pedido válido" (status `paid`) para evitar duas noções concorrentes de receita na mesma tela.
- **Ordenação por semana ISO, não por `createdAt`**: decisão explícita para que edições retroativas (ex: compra de uma semana passada editada depois de semanas futuras já existirem) não bagunçem gráficos de série temporal.
- **"Prato parado" distinto de "última vez no cardápio"**: o primeiro mede venda de fato (`produced`/`paid`), o segundo (que vive na spec `recipe`) mede presença no cardápio — podem divergir (prato no cardápio da semana mas sem nenhum pedido ainda).

## Risks / Trade-offs

- [Risco] Módulo com muitas agregações independentes pode divergir sutilmente entre si se alguma métrica for alterada isoladamente no futuro (ex: mudar o critério de "pedido válido" em um endpoint e esquecer outro) → Mitigação: a spec deixa explícito, requirement por requirement, que o critério cash-based é compartilhado entre faturamento e rankings.
