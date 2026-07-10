## Why

Continuação do baseline de OpenSpec. Tipos de Preço definem os tamanhos e valores usados por Receitas e travados em snapshot nos Pedidos — precisa de spec própria antes de propor mudanças nesses módulos dependentes.

## What Changes

- Documentar a capability `priceType` como ela existe hoje: combinação única de tipo + tamanho, valores Pix e Swile editáveis a qualquer momento, soft delete para preservar referências antigas.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `price-type`: Cadastro de tipos de produto (tipo + tamanho) com preços Pix e Swile, base para Receitas e para o snapshot de preço em Pedidos.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/priceType/*`, `apps/backend/src/{controllers,services,repositories,routes}/priceTypes.*`, `apps/frontend/src/{app/(private)/precos, components/modules/precos, components/view/precos}`.
- Nenhum código será alterado por este change.
