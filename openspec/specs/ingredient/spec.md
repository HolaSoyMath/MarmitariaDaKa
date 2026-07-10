# ingredient Specification

## Purpose
TBD - created by archiving change baseline-ingredient. Update Purpose after archive.
## Requirements
### Requirement: Cadastro de ingrediente com nome único e unidade
O sistema SHALL permitir cadastrar um ingrediente com nome único (entre ingredientes ativos) e uma unidade de medida (`g`, `kg`, `ml`, `L` ou `un`).

#### Scenario: Criar ingrediente com nome inédito
- **WHEN** a dona cadastra um ingrediente com nome e unidade válidos, e nenhum outro ingrediente ativo tem o mesmo nome
- **THEN** o sistema cria o ingrediente

#### Scenario: Criar ingrediente com nome duplicado
- **WHEN** a dona tenta cadastrar um ingrediente com um nome já usado por outro ingrediente ativo
- **THEN** o sistema rejeita a operação com um erro de conflito

### Requirement: Cadastro via tela própria e via modal inline
O sistema SHALL permitir cadastrar ingredientes tanto pela tela própria (`/ingredientes`) quanto por um modal inline aberto a partir das telas de Receitas e Compras, sem sair do fluxo atual.

#### Scenario: Cadastro pela tela própria
- **WHEN** a dona acessa `/ingredientes` e cadastra um novo ingrediente
- **THEN** o ingrediente passa a existir na lista geral de ingredientes

#### Scenario: Cadastro inline durante criação de receita ou compra
- **WHEN** a dona precisa de um ingrediente que ainda não existe enquanto monta uma receita ou registra uma compra
- **THEN** o sistema permite cadastrá-lo em um modal inline e, ao salvar, ele já fica selecionado automaticamente no formulário de origem

### Requirement: Unidade define casas decimais do valor unitário
A unidade do ingrediente SHALL determinar quantas casas decimais são usadas para exibir o valor unitário calculado em Compras: `g` e `ml` usam 3 casas decimais; `kg`, `L` e `un` usam 2 casas decimais.

#### Scenario: Exibição de valor unitário de ingrediente em gramas
- **WHEN** um item de compra usa um ingrediente com unidade `g`
- **THEN** o valor unitário é exibido com 3 casas decimais

#### Scenario: Exibição de valor unitário de ingrediente em quilos
- **WHEN** um item de compra usa um ingrediente com unidade `kg`
- **THEN** o valor unitário é exibido com 2 casas decimais

### Requirement: Soft delete preserva histórico
O sistema SHALL usar soft delete para ingredientes, preservando o histórico de receitas e compras que os referenciam.

#### Scenario: Excluir ingrediente usado em histórico
- **WHEN** a dona exclui um ingrediente que já foi usado em compras ou receitas passadas
- **THEN** o sistema marca `deletedAt` no ingrediente sem apagar os registros de compras ou receitas que o referenciam

