## Context

Baseline de documentação — nenhuma mudança de comportamento. `order` é o módulo mais crítico do sistema: concentra a máquina de status operacional (produção/pagamento) e o congelamento de preço via snapshot.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `order` refletindo fielmente o código em produção, corrigindo duas divergências encontradas na documentação existente (ver proposal.md).

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não decide se a documentação divergente (`CLAUDE.md`, `obsidian/Pedidos.md`) deve ser corrigida agora — isso fica para o dono do projeto decidir separadamente.

## Decisions

- **Snapshot em duas operações**: tanto `create` quanto `update` no repositório buscam o `PriceType` vigente e gravam `snapshotPixPrice`/`snapshotSwilePrice` no `OrderItem` — a edição de um pedido pendente gera novos snapshots, não reaproveita os antigos.
- **Substituição de itens na edição**: `update()` marca todos os itens antigos como `deletedAt` e recria a partir da lista enviada, dentro de `prisma.$transaction` — mesmo padrão de substituição integral usado em `recipe` e `menuItem`.
- **Duas rotas de reversão**: `revert-to-pending` (de qualquer status não-pendente direto para `pending`) e `revert-to-produced` (somente de `paid` para `produced`) são endpoints distintos, permitindo à dona escolher entre desfazer tudo ou só desmarcar o pagamento.
- **Controles de status duplicados na UI**: tanto `OrdersView.tsx` (tela de Pedidos) quanto o painel da Home implementam os mesmos hooks (`useMarkProduced`, `useMarkPaid`, `useRevertToPending`, `useRevertToProduced`) — não há distinção de permissão entre as duas telas.

## Risks / Trade-offs

- [Risco] Documentação (`CLAUDE.md` e Obsidian) desatualizada pode levar a decisões futuras erradas se não for corrigida → Mitigação: divergências sinalizadas explicitamente no proposal.md deste change.
