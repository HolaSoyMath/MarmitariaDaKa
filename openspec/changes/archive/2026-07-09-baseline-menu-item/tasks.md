## 1. Baseline da capability `menu-item`

- [x] 1.1 Schemas Zod (`menuItemBase`, `menuItemInput`, `menuItemResponse`, `menuItemUpdatePriceTypesInput`) já implementados em `shared/schemas/menuItem/`
- [x] 1.2 Camada backend (route, controller, service, repository) já implementada em `apps/backend/src/{routes,controllers,services,repositories}/menuItems.*`, incluindo validação de tamanhos e bloqueio por pedidos pendentes
- [x] 1.3 Tela `/cardapio` (`MenuItemsView.tsx`, `MenuItemCard.tsx`, `AddMenuItemDialog.tsx`, `MenuItemSizesDialog.tsx`) e hook (`useMenuItems.ts`) já implementados no frontend
- [x] 1.4 Spec `menu-item` registrada em `openspec/specs/menu-item/spec.md` refletindo o comportamento acima

## 2. Validação

- [x] 2.1 Conferir que a spec não introduz nenhum requisito que o código atual não cumpra
- [x] 2.2 Arquivar o change para materializar `openspec/specs/menu-item/spec.md`
