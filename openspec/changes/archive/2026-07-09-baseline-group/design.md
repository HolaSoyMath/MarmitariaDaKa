## Context

Baseline de documentação — nenhuma mudança de comportamento. Grupo segue o mesmo padrão de camadas do restante do backend (Route → Service → Repository) e é consumido apenas pelo `GroupsDialog.tsx`, sem página própria.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `group` refletindo fielmente o código em produção.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.

## Decisions

- **Unicidade de nome**: validada em `groups.service.ts` via `findByName` antes de criar/atualizar, retornando `ConflictError` — não é uma constraint de banco, é regra de aplicação.
- **Cascata em transação**: `groups.repository.ts#softDelete` usa `prisma.$transaction` para desativar `Client` e `Group` atomicamente, seguindo a regra obrigatória do `apps/backend/CLAUDE.md`.
- **Sem rota própria no frontend**: grupos só existem dentro do modal `GroupsDialog`, aberto a partir de `ClientsView` — reflete que grupos são um conceito auxiliar de Clientes, não uma entidade de primeira classe na navegação.

## Risks / Trade-offs

- [Risco] Unicidade de nome verificada apenas em memória de aplicação (não há constraint `@unique` confirmada no banco) pode permitir corrida em concorrência simultânea → Mitigação: não é um risco real neste sistema, que tem usuária única sem concorrência.
