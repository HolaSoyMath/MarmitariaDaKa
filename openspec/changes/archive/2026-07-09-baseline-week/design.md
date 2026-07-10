## Context

Baseline de documentação — nenhuma mudança de comportamento. `week` é a única entidade sem tela de CRUD própria — ela só existe através do week picker global.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `week` refletindo fielmente o código em produção.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não documenta aqui o comportamento de Cardápio/Pedidos/Compras/CustosGerais dentro da semana — cada um tem sua própria spec.

## Decisions

- **Idempotência via `open()`**: `WeeksService#open` busca por `number`+`year` antes de criar; se existir, retorna o registro existente em vez de lançar erro ou duplicar — reflete que abrir uma semana é uma operação segura de repetir (upsert lógico).
- **Estado global no frontend via Context**: `WeekContext.tsx` inicializa com a semana ISO atual (`date-fns getISOWeek/getISOWeekYear`) e chama `POST /weeks` ao montar, guardando o resultado em estado React compartilhado — não usa TanStack Query para o estado da semana atual em si (embora a API por trás use REST comum).
- **Navegação com virada de ano**: `offsetWeek()` calcula a semana anterior/seguinte considerando o número de semanas ISO do ano (52 ou 53), rolando corretamente para o ano anterior/seguinte nas bordas.

## Risks / Trade-offs

- Nenhum risco relevante identificado — módulo simples e estável, sem regra de negócio financeira.
