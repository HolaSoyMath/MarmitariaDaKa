## Context

Baseline de documentação — nenhuma mudança de comportamento. `purchase` é o único módulo, junto de `week`, que usa upsert (criar-ou-atualizar) em vez de create/update separados, refletindo a regra de "uma compra por semana".

## Goals / Non-Goals

**Goals:**
- Registrar a spec `purchase` refletindo fielmente o código em produção, incluindo a origem do percentual de gás (não documentada no Obsidian).

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não propõe uma tela de configuração para o percentual de gás — apenas documenta que ele existe hoje como API sem UI.

## Decisions

- **Upsert transacional**: `PurchasesRepository#upsert` busca a compra da semana; se não existir, cria; em seguida marca todos os itens ativos como excluídos e recria a lista inteira a partir do payload — mesmo padrão de substituição integral usado em `recipe` e `order`.
- **Percentual de gás configurável, não hardcoded**: `PurchasesService#upsert` lê `gasPercentage` de uma tabela `Config` singleton (via `ConfigRepository`), não um valor fixo de 5% no código. O valor de 5% citado no Obsidian e no `CLAUDE.md` é o valor padrão semeado no banco, mas é editável via `PATCH /config`.
- **Sem UI para `/config`**: não existe nenhuma tela no frontend que consuma `GET/PATCH /config` — o endpoint existe apenas para uso administrativo direto (ex: via API) ou para uma futura tela de configurações.

## Risks / Trade-offs

- [Risco] Como não há UI para `/config`, alterar o percentual de gás hoje exige acesso direto à API ou ao banco → Mitigação: fora do escopo deste baseline; registrado aqui para referência futura caso se decida expor essa configuração na interface.
