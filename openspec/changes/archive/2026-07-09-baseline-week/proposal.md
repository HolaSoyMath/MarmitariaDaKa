## Why

Continuação do baseline de OpenSpec. Semana é a unidade central do sistema — cardápio, pedidos, compras e custos gerais pertencem a uma semana. Precisa de spec própria antes de propor mudanças nesses módulos dependentes.

## What Changes

- Documentar a capability `week` como ela existe hoje: identificação por número ISO + ano, criação automática (idempotente) ao ser selecionada pela primeira vez via week picker, persistência global da semana selecionada entre páginas, sem restrição de semana futura ou passada.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `week`: Unidade central de tempo do sistema (semana ISO + ano), criada sob demanda via week picker, com estado global persistido entre páginas no frontend.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/week/*`, `apps/backend/src/{controllers,services,repositories,routes}/weeks.*`, `apps/frontend/src/{context/WeekContext.tsx, components/ui/WeekPicker.tsx, formatters/week.ts, hooks/useWeeksCount.ts}`.
- Nenhum código será alterado por este change.
