## 1. Baseline da capability `general-cost`

- [x] 1.1 Schemas Zod (`generalCostBase`, `generalCostInput`, `generalCostResponse`) já implementados em `shared/schemas/generalCost/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/generalCosts.*`, incluindo proteção do custo de gás
- [x] 1.3 Spec `general-cost` registrada em `openspec/specs/general-cost/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/general-cost/spec.md`
