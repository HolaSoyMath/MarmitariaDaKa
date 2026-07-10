## 1. Baseline da capability `client`

- [x] 1.1 Schemas Zod (`clientBase`, `clientInput`, `clientResponse`) já implementados em `shared/schemas/client/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/clients.*`
- [x] 1.3 Soft delete em cascata via grupo já implementado em `groups.repository.ts` (`softDelete`)
- [x] 1.4 Tela de Clientes (`ClientsView.tsx`), formulário compartilhado (`ClientSheet.tsx`) e hook (`useClients.ts`) já implementados no frontend
- [x] 1.5 Spec `client` registrada em `openspec/specs/client/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/client/spec.md`
