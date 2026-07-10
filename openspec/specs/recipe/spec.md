# recipe Specification

## Purpose
TBD - created by archiving change baseline-recipe. Update Purpose after archive.
## Requirements
### Requirement: Cadastro de receita com nome único, ingredientes e tamanhos
O sistema SHALL permitir cadastrar uma receita com nome único (entre receitas ativas), uma lista de ingredientes com quantidade, e ao menos um tamanho (tipo de preço) vinculado.

#### Scenario: Criar receita válida
- **WHEN** a dona cadastra uma receita com nome inédito, ao menos um ingrediente e ao menos um tamanho
- **THEN** o sistema cria a receita com `active = true` por padrão

#### Scenario: Criar receita sem tamanho
- **WHEN** a dona tenta salvar uma receita sem nenhum tamanho (tipo de preço) vinculado
- **THEN** o sistema rejeita a operação por falha de validação do schema

#### Scenario: Criar receita com nome duplicado
- **WHEN** a dona tenta cadastrar uma receita com um nome já usado por outra receita ativa
- **THEN** o sistema rejeita a operação com um erro de conflito

### Requirement: Edição substitui a composição integralmente
Ao editar uma receita, a lista de ingredientes e a lista de tamanhos SHALL ser substituídas por completo, sem edição parcial e sem manter histórico de versões anteriores.

#### Scenario: Editar ingredientes de uma receita
- **WHEN** a dona edita uma receita alterando a lista de ingredientes
- **THEN** o sistema remove todos os vínculos de ingrediente e tipo de preço anteriores e recria a partir da lista enviada, na mesma transação

### Requirement: Bloqueio de edição/exclusão com pedidos pendentes
O sistema SHALL impedir a edição ou exclusão de uma receita quando existir algum item de pedido com status `pending` vinculado a ela através do cardápio; pedidos com status `produced` ou `paid` SHALL NOT bloquear, pois o preço já está congelado em snapshot no item do pedido.

#### Scenario: Tentar editar receita com pedido pendente
- **WHEN** a dona tenta editar uma receita que possui ao menos um `OrderItem` de um pedido `pending` vinculado via cardápio
- **THEN** o sistema rejeita a edição com um erro informando que a receita possui pedidos pendentes

#### Scenario: Editar receita com apenas pedidos produzidos ou pagos
- **WHEN** a dona edita uma receita cujos pedidos vinculados estão todos com status `produced` ou `paid`
- **THEN** o sistema permite a edição normalmente

### Requirement: Ativar e desativar sem excluir
O sistema SHALL permitir marcar uma receita como ativa ou inativa independentemente de pedidos pendentes, sem afetar dados existentes; receitas inativas SHALL ser ocultadas da listagem padrão e do modal de adicionar prato ao cardápio, mas SHALL continuar visíveis via filtro de inativas.

#### Scenario: Desativar receita
- **WHEN** a dona desativa uma receita
- **THEN** ela deixa de aparecer na lista padrão de Receitas e no modal de adicionar prato ao cardápio, mas continua acessível pelo filtro de inativas

#### Scenario: Pratos de semanas anteriores não são afetados
- **WHEN** uma receita usada em cardápios de semanas anteriores é desativada
- **THEN** os itens de cardápio dessas semanas continuam existindo e sendo exibidos normalmente

### Requirement: Exclusão por soft delete
O sistema SHALL usar soft delete ao excluir uma receita, sujeito ao mesmo bloqueio de pedidos pendentes da edição.

#### Scenario: Excluir receita sem pedidos pendentes
- **WHEN** a dona exclui uma receita sem nenhum pedido `pending` vinculado
- **THEN** o sistema marca `deletedAt` na receita

### Requirement: Indicação da última vez no cardápio
O sistema SHALL exibir, para cada receita, em qual semana ela foi usada pela última vez no cardápio, ou indicar que nunca foi usada.

#### Scenario: Receita já usada
- **WHEN** a receita tem ao menos um item de cardápio ativo vinculado
- **THEN** o sistema exibe a semana e ano do uso mais recente (`Semana X/AAAA`)

#### Scenario: Receita nunca usada
- **WHEN** a receita não possui nenhum item de cardápio ativo vinculado
- **THEN** o sistema indica que ela nunca foi usada

### Requirement: Estimativa de custo médio por ingrediente e por receita
O sistema SHALL estimar o custo de cada ingrediente de uma receita com base na média do valor unitário das últimas compras registradas daquele ingrediente (até 5 compras mais recentes), e SHALL somar essas estimativas para exibir um custo médio total da receita, sinalizando quando a estimativa é parcial por falta de histórico de algum ingrediente.

#### Scenario: Custo estimado com histórico completo
- **WHEN** todos os ingredientes de uma receita possuem histórico de compras
- **THEN** o sistema exibe o custo médio de cada ingrediente (valor unitário médio × quantidade) e o custo total médio da receita, sem indicação de estimativa parcial

#### Scenario: Custo estimado parcial por falta de histórico
- **WHEN** ao menos um ingrediente da receita nunca foi comprado
- **THEN** o sistema exibe o custo total médio calculado apenas com os ingredientes que têm histórico, sinalizando que a estimativa é parcial

#### Scenario: Estimativa ao vivo durante edição
- **WHEN** a dona está criando ou editando uma receita e seleciona um ingrediente com quantidade preenchida
- **THEN** o sistema exibe, para aquela linha, o custo estimado com base na média das últimas 5 compras daquele ingrediente, ou indica que não há histórico de compra ainda

