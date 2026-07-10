## ADDED Requirements

### Requirement: Uma única compra editável por semana
O sistema SHALL manter no máximo uma compra por semana; ao salvar a lista de itens, o sistema SHALL criar a compra da semana se ainda não existir, ou atualizar a lista de itens da compra existente.

#### Scenario: Primeira compra da semana
- **WHEN** a dona registra itens de compra pela primeira vez em uma semana sem compra ainda criada
- **THEN** o sistema cria a compra da semana com os itens informados

#### Scenario: Editar compra existente da semana
- **WHEN** a dona adiciona, edita ou remove itens de uma semana que já tem uma compra registrada
- **THEN** o sistema substitui a lista de itens ativos da compra existente pelos novos itens, sem criar uma segunda compra para a mesma semana

### Requirement: Valor unitário calculado e congelado como snapshot
Ao salvar um item de compra, o sistema SHALL calcular `unitValue = totalValue / quantity` e persistir esse valor; ele SHALL NOT ser recalculado posteriormente.

#### Scenario: Registrar item de compra
- **WHEN** a dona registra um item com ingrediente, quantidade e valor total pago
- **THEN** o sistema calcula e grava o valor unitário correspondente no momento do registro

### Requirement: Local de compra opcional
Cada item de compra SHALL permitir informar opcionalmente o nome do local onde foi comprado.

#### Scenario: Item sem local informado
- **WHEN** a dona registra um item de compra sem preencher o campo de local
- **THEN** o sistema salva o item normalmente com local nulo

### Requirement: Recálculo automático do custo de gás
Toda vez que a lista de itens de uma compra é salva, o sistema SHALL recalcular automaticamente o custo geral de gás daquela semana como um percentual configurável (padrão do sistema) sobre a soma dos valores totais dos itens ativos da compra.

#### Scenario: Gás recalculado ao salvar compra
- **WHEN** a dona salva a lista de itens de uma compra, alterando o total gasto em ingredientes
- **THEN** o sistema atualiza o custo geral do tipo "gás" da semana para o percentual configurado sobre a nova soma de valores totais

#### Scenario: Primeira compra da semana cria o custo de gás
- **WHEN** a semana ainda não possui um custo geral do tipo "gás" e a primeira compra é salva
- **THEN** o sistema cria automaticamente esse custo geral com a descrição "Gás (calculado automaticamente)"

### Requirement: Soft delete nos itens removidos
Ao remover um item da lista de compra, o sistema SHALL marcá-lo como excluído (soft delete) em vez de apagá-lo fisicamente, preservando o histórico de compras.

#### Scenario: Remover item de uma compra
- **WHEN** a dona remove um item da lista de compra da semana e salva
- **THEN** o sistema marca `deletedAt` no item removido, sem excluí-lo fisicamente do banco
