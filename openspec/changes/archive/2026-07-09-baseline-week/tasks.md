## 1. Baseline da capability `week`

- [x] 1.1 Schemas Zod (`weekBase`, `weekInput`, `weekResponse`) já implementados em `shared/schemas/week/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/weeks.*`, incluindo criação idempotente
- [x] 1.3 Estado global `WeekContext.tsx`, componente `WeekPicker.tsx` e formatters já implementados no frontend
- [x] 1.4 Spec `week` registrada em `openspec/specs/week/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/week/spec.md`
