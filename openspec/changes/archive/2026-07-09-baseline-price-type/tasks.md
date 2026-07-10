## 1. Baseline da capability `price-type`

- [x] 1.1 Schemas Zod (`priceTypeBase`, `priceTypeInput`, `priceTypeResponse`) já implementados em `shared/schemas/priceType/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/priceTypes.*`, incluindo validação de combinação única
- [x] 1.3 Tela `/precos` já implementada no frontend (`components/view/precos`, `components/modules/precos`)
- [x] 1.4 Spec `price-type` registrada em `openspec/specs/price-type/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/price-type/spec.md`
