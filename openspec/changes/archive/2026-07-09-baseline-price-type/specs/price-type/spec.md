## ADDED Requirements

### Requirement: Combinação tipo + tamanho única
O sistema SHALL exigir que a combinação de tipo (ex: "Marmita") e tamanho (ex: "400G") seja única entre os tipos de preço ativos.

#### Scenario: Criar tipo de preço com combinação inédita
- **WHEN** a dona cadastra um tipo de preço com tipo e tamanho que ainda não existem juntos
- **THEN** o sistema cria o registro com os valores Pix e Swile informados

#### Scenario: Criar tipo de preço com combinação duplicada
- **WHEN** a dona tenta cadastrar um tipo de preço cuja combinação tipo + tamanho já existe em outro registro ativo
- **THEN** o sistema rejeita a operação com um erro de conflito

### Requirement: Preços editáveis sem afetar pedidos existentes
O sistema SHALL permitir editar os valores Pix e Swile de um tipo de preço a qualquer momento, sem alterar o preço já registrado em itens de pedidos existentes (que usam snapshot próprio).

#### Scenario: Alterar preço de um tipo existente
- **WHEN** a dona edita o valor Pix ou Swile de um tipo de preço
- **THEN** o sistema atualiza o valor vigente para novos pedidos, sem alterar o valor já gravado em pedidos anteriores

### Requirement: Exclusão por soft delete
O sistema SHALL usar soft delete ao excluir um tipo de preço, preservando as referências de pedidos e receitas antigas.

#### Scenario: Excluir tipo de preço em uso
- **WHEN** a dona exclui um tipo de preço que já foi usado em receitas ou pedidos anteriores
- **THEN** o sistema marca `deletedAt` no tipo de preço sem afetar os registros que o referenciam
