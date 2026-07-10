## 1. Baseline da capability `group`

- [x] 1.1 Schemas Zod (`groupBase`, `groupInput`, `groupResponse`) já implementados em `shared/schemas/group/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/groups.*`, incluindo validação de nome único e cascata transacional
- [x] 1.3 Modal `GroupsDialog.tsx` e hook `useGroups.ts` já implementados no frontend
- [x] 1.4 Spec `group` registrada em `openspec/specs/group/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/group/spec.md`
