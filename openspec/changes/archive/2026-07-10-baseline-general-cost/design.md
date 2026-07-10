## Context

Baseline de documentação — nenhuma mudança de comportamento. `general-cost` tem dois "tipos" de registro tratados de forma assimétrica: custos manuais livres e um custo automático único de gás por semana.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `general-cost` refletindo fielmente o código em produção.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não documenta aqui a criação/recálculo do gás em si — isso pertence à spec `purchase`, que é quem dispara a operação.

## Decisions

- **`type` no Prisma vs. `automatic` no schema compartilhado**: o modelo Prisma guarda um campo `type` (`'fixo' | 'gas_percentage'`), mas o schema `generalCostResponse` expõe um booleano `automatic`, derivado no controller (`cost.type === 'gas_percentage'`). O frontend nunca vê o valor `type` diretamente.
- **Proteção no service, não no banco**: o bloqueio de editar/excluir custo de gás é feito em `GeneralCostsService`, checando `cost.type === 'gas_percentage'` antes de delegar ao repositório — não há constraint de banco impedindo a alteração direta via SQL.
- **Criação manual sempre com `type: 'fixo'`**: `GeneralCostsRepository#create` fixa `type: 'fixo'` — não existe uma rota pela qual a dona possa criar um custo do tipo `gas_percentage` diretamente.

## Risks / Trade-offs

- Nenhum risco relevante identificado — a proteção contra edição do gás está centralizada em uma única camada (service) e é coberta por spec.
