## 1. Baseline da capability `financial`

- [x] 1.1 Schemas Zod de resposta (`financialReportResponse`, `financialTimeseriesResponse`, `financialComparisonResponse`, `financialRecordWeekResponse`, `financialIngredientCostResponse`, `financialDishLastSoldResponse`, `financialRankingResponse`, `financialSeasonalityResponse`, `financialPeriod`) já implementados em `shared/schemas/financial/`
- [x] 1.2 Endpoints e regras de cálculo já implementados em `apps/backend/src/{routes/financial.ts, services/financial.service.ts}`
- [x] 1.3 Tela `/financeiro` e componentes (`components/modules/financeiro/*`) já implementados no frontend
- [x] 1.4 Spec `financial` registrada em `openspec/specs/financial/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/financial/spec.md`
