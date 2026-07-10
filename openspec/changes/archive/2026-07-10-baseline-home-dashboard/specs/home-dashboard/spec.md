## ADDED Requirements

### Requirement: Card de totais da semana
A Home SHALL exibir, para a semana selecionada no week picker, o total de marmitas a entregar (soma das quantidades de todos os itens de todos os pedidos da semana), a quantidade ainda a produzir (soma das quantidades dos itens de pedidos com status `pending`), e o valor total ainda a receber (soma do valor Pix dos itens de pedidos com status diferente de `paid`).

#### Scenario: Totais com pedidos em status variados
- **WHEN** a semana tem pedidos `pending`, `produced` e `paid`
- **THEN** o total geral soma todos os itens, "a produzir" soma apenas os itens de pedidos `pending`, e "a receber" soma o valor Pix dos itens de pedidos `pending` e `produced` (tudo que não está `paid`)

### Requirement: Card "por prato" com os mais pedidos
A Home SHALL exibir uma grade de até 4 pratos, mostrando os pratos com maior quantidade total pedida na semana, cada um com a quantidade por tamanho; posições sem prato SHALL ser exibidas como vazias ("livre").

#### Scenario: Semana com mais de 4 pratos pedidos
- **WHEN** a semana tem pedidos para mais de 4 pratos diferentes do cardápio
- **THEN** a Home exibe apenas os 4 pratos com maior quantidade total pedida, ordenados do maior para o menor

#### Scenario: Semana com menos de 4 pratos pedidos
- **WHEN** a semana tem pedidos para menos de 4 pratos diferentes
- **THEN** as posições restantes da grade são exibidas vazias, indicadas como "livre"

### Requirement: Lista de clientes da semana com valores lado a lado
A Home SHALL listar todos os clientes com pedido na semana, exibindo para cada um os valores Pix e Swile totais lado a lado, com uma seta para expandir os itens do pedido inline (accordion).

#### Scenario: Expandir pedido de um cliente
- **WHEN** a dona clica na seta de um cliente na lista da Home
- **THEN** os itens do pedido daquele cliente (prato, tamanho e quantidade) são exibidos inline, sem navegar para outra tela

### Requirement: Marcar produzido inline
A Home SHALL permitir marcar um pedido como produzido (ou reverter para pendente) através de um checkbox ao lado do cliente, desabilitado quando o pedido já está pago.

#### Scenario: Marcar pedido pendente como produzido
- **WHEN** a dona marca o checkbox de um pedido `pending`
- **THEN** o pedido passa para `produced`

#### Scenario: Desmarcar pedido produzido
- **WHEN** a dona desmarca o checkbox de um pedido `produced`
- **THEN** o pedido volta para `pending`

#### Scenario: Checkbox desabilitado para pedido pago
- **WHEN** um pedido está `paid`
- **THEN** o checkbox de produção fica desabilitado, exigindo desmarcar o pagamento antes de alterar a produção

### Requirement: Home como painel somente da semana selecionada
Todos os dados exibidos na Home (totais, pratos e clientes) SHALL ser referentes exclusivamente à semana atualmente selecionada no week picker global.

#### Scenario: Trocar semana no week picker atualiza a Home
- **WHEN** a dona navega para outra semana pelo week picker
- **THEN** todos os cards e a lista de clientes da Home são recarregados com os dados da nova semana selecionada
