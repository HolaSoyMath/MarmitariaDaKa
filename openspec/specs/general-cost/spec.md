# general-cost Specification

## Purpose
TBD - created by archiving change baseline-general-cost. Update Purpose after archive.
## Requirements
### Requirement: Custo manual com descrição livre e valor
O sistema SHALL permitir que a dona lance um custo geral manual para a semana, com descrição livre e valor em reais, do tipo `fixo`.

#### Scenario: Lançar custo manual
- **WHEN** a dona registra um custo geral com descrição (ex: "Embalagem") e valor
- **THEN** o sistema cria o custo do tipo `fixo` vinculado à semana

### Requirement: Custo manual editável e removível
O sistema SHALL permitir editar a descrição e o valor de um custo manual, e removê-lo (soft delete), a qualquer momento.

#### Scenario: Editar custo manual
- **WHEN** a dona altera a descrição ou o valor de um custo do tipo `fixo`
- **THEN** o sistema atualiza o registro com os novos valores

#### Scenario: Remover custo manual
- **WHEN** a dona remove um custo do tipo `fixo`
- **THEN** o sistema marca `deletedAt` no custo, sem excluí-lo fisicamente

### Requirement: Custo de gás protegido contra alteração manual
O custo do tipo `gas_percentage` SHALL ser criado e atualizado exclusivamente pelo recálculo automático disparado por Compras; tentativas de editar ou excluir esse custo manualmente SHALL ser rejeitadas.

#### Scenario: Tentar editar custo de gás
- **WHEN** a dona tenta editar um custo geral do tipo `gas_percentage`
- **THEN** o sistema rejeita a operação com um erro informando que o custo de gás é calculado automaticamente

#### Scenario: Tentar excluir custo de gás
- **WHEN** a dona tenta excluir um custo geral do tipo `gas_percentage`
- **THEN** o sistema rejeita a operação com o mesmo tipo de erro

### Requirement: Listagem de custos por semana
O sistema SHALL listar todos os custos gerais ativos de uma semana, incluindo manuais e o automático de gás quando existir.

#### Scenario: Listar custos da semana
- **WHEN** a dona consulta os custos gerais de uma semana com custos manuais e o custo de gás já calculado
- **THEN** o sistema retorna todos eles, ordenados do mais recente para o mais antigo

