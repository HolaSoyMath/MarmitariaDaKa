## Context

Baseline de documentação — nenhuma mudança de comportamento. `priceType` segue o mesmo padrão de camadas do restante do backend, com unicidade de tipo+tamanho validada em `priceTypes.service.ts`.

## Goals / Non-Goals

**Goals:**
- Registrar a spec `price-type` refletindo fielmente o código em produção.

**Non-Goals:**
- Não introduz nenhuma mudança de comportamento, endpoint, schema ou UI.
- Não documenta aqui a mecânica de snapshot em si (isso pertence à spec `order`, que é quem copia os valores).

## Decisions

- **Unicidade tipo+tamanho em nível de aplicação**: validada via `findByTypeAndSize` no service, mesmo padrão de `group` e `ingredient`.
- **Preços em inteiro (centavos)**: `pixPrice`/`swilePrice` são `z.number().int().nonnegative()`, evitando problemas de ponto flutuante em valores monetários.

## Risks / Trade-offs

- Nenhum risco relevante identificado — módulo simples e estável.
