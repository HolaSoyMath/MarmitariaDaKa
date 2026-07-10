## Context

Baseline de documentação — nenhuma mudança de comportamento. Ingrediente segue o mesmo padrão de camadas do restante do backend (Route → Service → Repository), com unicidade de nome validada em `ingredients.service.ts`.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `ingredient` refletindo fielmente o código em produção.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não avalia se deveria haver bloqueio de exclusão quando o ingrediente está em uso (não existe hoje — diferente da proteção que existe para Receita/MenuItem).

## Decisions

- **Unicidade de nome em nível de aplicação**: mesma abordagem de `group`, validada via `findByName` no service, não constraint de banco.
- **Soft delete sem bloqueio de uso**: ao contrário de Receita (que bloqueia edição/exclusão se há pedido pendente referenciando), Ingrediente pode ser excluído mesmo estando em uso em receitas ou compras — o soft delete apenas o remove das listagens futuras, preservando os registros históricos que o referenciam por `id`.
- **Unidade como enum compartilhado**: `IngredientUnitEnum` vem de `shared/schemas/enums.ts`, reaproveitado onde a unidade influencia formatação (Compras).

## Risks / Trade-offs

- [Risco] Excluir um ingrediente em uso não bloqueia a ação, podendo causar confusão se a dona não perceber que ele ainda aparece em receitas antigas → Mitigação: aceito como comportamento atual; não é escopo deste baseline propor mudança.
