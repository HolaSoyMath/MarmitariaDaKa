## Why

Continuação do baseline de OpenSpec. O Cardápio conecta Semana, Receitas e Tipos de Preço, e é a origem dos itens selecionáveis em Pedidos — precisa de spec própria antes de propor mudanças nesses módulos.

## What Changes

- Documentar a capability `menu-item` como ela existe hoje: prato do cardápio vinculado a uma receita ativa e a uma semana, com tamanhos (tipos de preço) escolhidos entre os cadastrados na receita, uma receita por semana no máximo, edição de tamanhos após adicionado, e bloqueio de remoção quando há pedidos pendentes.
- Nenhum comportamento novo é introduzido — este change apenas registra o estado atual do sistema como spec.

## Capabilities

### New Capabilities
- `menu-item`: Prato do cardápio de uma semana, vinculado a uma receita, com subconjunto de tamanhos escolhido para aquela semana.

### Modified Capabilities
(nenhuma — baseline inicial)

## Impact

- Código afetado (somente leitura/documentação, nenhuma alteração): `shared/schemas/menuItem/*`, `apps/backend/src/{controllers,services,repositories,routes}/menuItems.*`, `apps/frontend/src/{app/(private)/cardapio, components/modules/cardapio, components/view/cardapio, hooks/useMenuItems.ts}`.
- Nenhum código será alterado por este change.
