## 1. Baseline da capability `recipe`

- [x] 1.1 Schemas Zod (`recipeBase`, `recipeInput`, `recipeActiveInput`, `recipeResponse`) já implementados em `shared/schemas/recipe/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/recipes.*`, incluindo bloqueio por pedidos pendentes e cálculo de custo médio
- [x] 1.3 Tela `/receitas` (`RecipesView.tsx`, `RecipeRow.tsx`, `RecipeSheet.tsx`, `RecipeIngredientRow.tsx`, `RecipeIngredientsTable.tsx`) e hook (`useRecipes.ts`) já implementados no frontend
- [x] 1.4 Spec `recipe` registrada em `openspec/specs/recipe/spec.md` refletindo o comportamento acima, incluindo a estimativa de custo não documentada anteriormente no Obsidian

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/recipe/spec.md`
