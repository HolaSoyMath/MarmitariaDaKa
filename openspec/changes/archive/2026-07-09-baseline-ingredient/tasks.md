## 1. Baseline da capability `ingredient`

- [x] 1.1 Schemas Zod (`ingredientBase`, `ingredientInput`, `ingredientResponse`) já implementados em `shared/schemas/ingredient/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/ingredients.*`, incluindo validação de nome único
- [x] 1.3 Tela `/ingredientes` (`IngredientsView.tsx`), modal (`IngredientSheet.tsx`) e hook (`useIngredients.ts`) já implementados no frontend
- [x] 1.4 Spec `ingredient` registrada em `openspec/specs/ingredient/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/ingredient/spec.md`
