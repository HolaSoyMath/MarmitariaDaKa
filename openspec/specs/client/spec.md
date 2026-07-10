# client Specification

## Purpose
TBD - created by archiving change baseline-client. Update Purpose after archive.
## Requirements
### Requirement: Cadastro de cliente vinculado a um grupo
O sistema SHALL permitir cadastrar um cliente com nome e vínculo obrigatório a exatamente um grupo (`groupId`).

#### Scenario: Criação de cliente com sucesso
- **WHEN** a dona envia nome e um `groupId` válido para criar um cliente
- **THEN** o sistema cria o cliente vinculado a esse grupo e retorna o cliente com os dados do grupo embutidos (`group`)

### Requirement: Listagem de clientes
O sistema SHALL listar todos os clientes ativos (não excluídos), cada um com os dados do grupo ao qual pertence.

#### Scenario: Listar clientes ativos
- **WHEN** a dona acessa a tela de Clientes
- **THEN** o sistema retorna todos os clientes com `deletedAt = null`, ordenados por nome na interface, cada um exibindo o nome do grupo

### Requirement: Edição de cliente
O sistema SHALL permitir editar o nome e o grupo de um cliente existente através do mesmo formulário usado na criação.

#### Scenario: Editar cliente existente
- **WHEN** a dona seleciona "Editar" em um cliente e altera nome e/ou grupo
- **THEN** o sistema atualiza o registro do cliente com os novos valores

#### Scenario: Formulário de cliente compartilhado com Pedidos
- **WHEN** a dona está registrando um novo pedido e precisa cadastrar um cliente que ainda não existe
- **THEN** o mesmo formulário de criação/edição de cliente é aberto sem sair do fluxo de Pedidos

### Requirement: Exclusão de cliente restrita a cascata de grupo
O sistema SHALL manter a exclusão individual de cliente indisponível na tela de Clientes; o soft delete de cliente SHALL ocorrer apenas em cascata quando o grupo ao qual ele pertence é excluído.

#### Scenario: Grupo excluído desativa clientes associados
- **WHEN** a dona exclui um grupo que possui clientes ativos vinculados
- **THEN** o sistema marca `deletedAt` em todos os clientes desse grupo e no próprio grupo, na mesma transação

#### Scenario: Tela de Clientes não oferece exclusão individual
- **WHEN** a dona está na tela de Clientes
- **THEN** a interface oferece apenas a ação "Editar" por cliente, sem botão de exclusão individual

### Requirement: Cliente pertence a um único grupo
Cada cliente SHALL pertencer a exatamente um grupo, usado para agrupamento e navegação (ex: Família, Trabalho).

#### Scenario: Cliente sem grupo é rejeitado
- **WHEN** uma requisição de criação ou edição de cliente não informa um `groupId` válido
- **THEN** o sistema rejeita a operação por falha de validação do schema

