## ADDED Requirements

### Requirement: Nome de grupo único
O sistema SHALL exigir que o nome de um grupo seja único entre os grupos ativos, tanto na criação quanto na renomeação.

#### Scenario: Criar grupo com nome já existente
- **WHEN** a dona tenta criar um grupo com um nome já usado por outro grupo ativo
- **THEN** o sistema rejeita a operação com um erro de conflito informando que já existe um grupo com esse nome

#### Scenario: Renomear grupo para nome já existente
- **WHEN** a dona tenta renomear um grupo para um nome já usado por outro grupo ativo
- **THEN** o sistema rejeita a operação com o mesmo erro de conflito

### Requirement: Gestão via modal na tela de Clientes
O sistema SHALL disponibilizar criação, renomeação e exclusão de grupos por meio de um modal acessível a partir da tela de Clientes, sem rota própria.

#### Scenario: Criar grupo pelo modal
- **WHEN** a dona digita um nome no campo "Novo grupo" e confirma
- **THEN** o sistema cria o grupo e o exibe na lista do modal

#### Scenario: Renomear grupo pelo modal
- **WHEN** a dona seleciona "Renomear" em um grupo, edita o nome e confirma (Enter ou botão Salvar)
- **THEN** o sistema atualiza o nome do grupo

### Requirement: Exclusão de grupo em cascata com confirmação
O sistema SHALL exigir confirmação explícita antes de excluir um grupo, informando que todos os clientes associados serão desativados junto; ao confirmar, o grupo e todos os seus clientes ativos SHALL ser desativados (soft delete) na mesma operação atômica.

#### Scenario: Exclusão pedida sem confirmação ainda
- **WHEN** a dona clica em "Excluir" em um grupo
- **THEN** o sistema exibe um diálogo de confirmação com o aviso "Todos os clientes deste grupo serão desativados junto" antes de executar qualquer alteração

#### Scenario: Exclusão confirmada
- **WHEN** a dona confirma a exclusão no diálogo
- **THEN** o sistema marca `deletedAt` no grupo e em todos os clientes associados ativos, em uma única transação

### Requirement: Grupos sem padrões pré-cadastrados
O sistema SHALL iniciar sem grupos padrão — todo grupo é criado manualmente pela dona.

#### Scenario: Sistema novo sem grupos
- **WHEN** não há nenhum grupo criado ainda
- **THEN** o modal de grupos exibe "Nenhum grupo cadastrado" e nenhum grupo é sugerido automaticamente
