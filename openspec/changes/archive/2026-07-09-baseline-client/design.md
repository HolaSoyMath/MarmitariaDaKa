## Context

Este change não implementa nada novo — apenas registra, em formato de spec, o comportamento já existente do módulo de Clientes. A arquitetura usada já é o padrão do projeto (ver `docs/ARCHITECTURE.md` e `CLAUDE.md` de cada app): Route (Elysia) → Service → Repository (Prisma), com schemas Zod compartilhados em `shared/schemas/client/`.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `client` refletindo fielmente o código em produção, para servir de baseline a futuras propostas de mudança.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não avalia ou propõe melhorias ao módulo — isso fica para changes futuros.

## Decisions

- **Camadas**: `clients.controller.ts` formata a resposta (`ClientResponse`), `clients.service.ts` aplica regra de negócio (validar existência antes de update/remove), `clients.repository.ts` executa queries Prisma sempre filtrando `deletedAt: null`. Padrão idêntico ao usado pelos demais módulos do backend.
- **Exclusão em cascata**: implementada em `groups.repository.ts` (`softDelete`), usando `prisma.$transaction` para desativar clientes do grupo e o grupo na mesma operação atômica — segue a regra obrigatória de transações do `apps/backend/CLAUDE.md`.
- **Sem exclusão individual na UI**: a rota `DELETE /clients/:id` existe no backend, mas a tela `ClientsView.tsx` não expõe essa ação — reflete a decisão de negócio de que clientes só saem de circulação junto com o grupo.

## Risks / Trade-offs

- [Risco] A rota `DELETE /clients/:id` existir sem uso na UI pode confundir futuros desenvolvedores sobre se exclusão individual é suportada → Mitigação: a spec deixa explícito que a exclusão individual não é exposta na interface, mesmo que o endpoint exista.
