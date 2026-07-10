## 1. Baseline da capability `purchase`

- [x] 1.1 Schemas Zod (`purchaseBase`, `purchaseInput`, `purchaseResponse`) já implementados em `shared/schemas/purchase/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/purchases.*`, incluindo upsert por semana e recálculo automático de gás via `Config`
- [x] 1.3 Tela `/compras` (`ComprasView.tsx` e módulos relacionados) já implementada no frontend
- [x] 1.4 Spec `purchase` registrada em `openspec/specs/purchase/spec.md` refletindo o comportamento acima, incluindo a origem configurável do percentual de gás

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/purchase/spec.md`
