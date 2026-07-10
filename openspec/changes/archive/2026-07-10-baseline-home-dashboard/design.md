## Context

Baseline de documentação — nenhuma mudança de comportamento. `home-dashboard` não é uma entidade de dados: é uma agregação, em memória no frontend, de `orders` e `menuItems` da semana selecionada.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `home-dashboard` refletindo fielmente o código em produção, incluindo a divergência encontrada em relação ao Obsidian (ver proposal.md).

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não decide se a ação de marcar como pago deveria ser adicionada à Home para alinhar com o Obsidian — isso é uma decisão de produto do dono do projeto, fora do escopo de um baseline.

## Decisions

- **Sem endpoint próprio**: a Home consome os mesmos hooks `useOrders(weekId)` e `useMenuItems(weekId)` já usados pela tela de Pedidos e Cardápio — não há rota de backend dedicada a "totais da Home".
- **Top 4 pratos por quantidade, não os 4 primeiros do cardápio**: `HomeView.tsx#dishSlots` agrega a quantidade pedida por `menuItemId` a partir dos itens de pedido, ordena por quantidade total decrescente e pega os 4 primeiros — pratos do cardápio sem nenhum pedido não aparecem, mesmo que estejam entre os primeiros cadastrados.
- **"A receber" inclui pendente e produzido**: `toReceiveCents` soma o valor Pix de todos os pedidos com `status !== 'paid'`, ou seja, tanto `pending` quanto `produced` — não é limitado a "produzido mas não pago" como uma leitura mais estrita do Obsidian sugeriria.

## Risks / Trade-offs

- [Risco] Divergência de escopo entre Obsidian e código (ação de pagamento ausente na Home) pode causar confusão sobre onde a dona deve marcar pagamentos → Mitigação: sinalizado explicitamente no proposal.md; a spec `order` já documenta que a ação existe na tela de Pedidos.
