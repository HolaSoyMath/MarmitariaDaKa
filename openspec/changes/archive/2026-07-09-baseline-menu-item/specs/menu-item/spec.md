## ADDED Requirements

### Requirement: Adicionar prato exige receita ativa e existente
O sistema SHALL exigir que um prato adicionado ao cardápio referencie uma receita existente; receitas inativas SHALL NOT aparecer como opção no modal de adicionar prato.

#### Scenario: Adicionar receita inexistente
- **WHEN** o sistema recebe uma requisição para adicionar ao cardápio uma receita que não existe
- **THEN** a operação é rejeitada com erro de não encontrado

#### Scenario: Receita inativa não aparece no modal
- **WHEN** a dona abre o modal de adicionar prato ao cardápio
- **THEN** apenas receitas ativas são listadas como opção

### Requirement: Uma receita aparece no máximo uma vez por semana
O sistema SHALL impedir que a mesma receita seja adicionada mais de uma vez ao cardápio de uma mesma semana.

#### Scenario: Adicionar receita já presente na semana
- **WHEN** a dona tenta adicionar ao cardápio uma receita que já está no cardápio daquela semana
- **THEN** o sistema rejeita a operação com um erro de conflito

#### Scenario: Receita marcada como "no cardápio" no modal
- **WHEN** uma receita já está no cardápio da semana selecionada
- **THEN** o modal de adicionar prato a exibe como já adicionada, bloqueada para nova adição

### Requirement: Tamanhos escolhidos por semana, restritos aos da receita
Ao adicionar ou editar um prato do cardápio, a dona SHALL escolher ao menos um tamanho (tipo de preço) dentre os cadastrados na receita vinculada; tamanhos fora dessa lista SHALL ser rejeitados.

#### Scenario: Escolher tamanho válido
- **WHEN** a dona adiciona um prato ao cardápio escolhendo um ou mais tamanhos que pertencem à receita
- **THEN** o sistema cria o item do cardápio com esses tamanhos vinculados

#### Scenario: Escolher tamanho que não pertence à receita
- **WHEN** a dona tenta salvar um tamanho que não está cadastrado na receita vinculada
- **THEN** o sistema rejeita a operação com um erro de conflito

#### Scenario: Cardápio exibe apenas os tamanhos escolhidos da semana
- **WHEN** o card do prato é exibido no cardápio da semana
- **THEN** somente os tamanhos escolhidos para aquela semana são exibidos, não todos os tamanhos cadastrados na receita nem todos os tipos de preço do sistema

### Requirement: Edição de tamanhos após adicionado
O sistema SHALL permitir editar, a qualquer momento, quais tamanhos de um prato já adicionado ao cardápio estão disponíveis naquela semana, substituindo integralmente a seleção anterior.

#### Scenario: Editar tamanhos de um prato já no cardápio
- **WHEN** a dona altera os tamanhos disponíveis de um prato já adicionado ao cardápio da semana
- **THEN** o sistema substitui a lista de tamanhos anterior pela nova seleção, na mesma transação

### Requirement: Cardápio isolado por semana
Cardápios de semanas diferentes SHALL ser completamente independentes, podendo ter pratos e tamanhos distintos entre si mesmo para a mesma receita.

#### Scenario: Mesma receita com tamanhos diferentes em semanas diferentes
- **WHEN** a mesma receita é adicionada ao cardápio de duas semanas diferentes com conjuntos de tamanhos diferentes
- **THEN** cada semana mantém sua própria seleção de tamanhos, sem interferência entre elas

### Requirement: Remoção bloqueada por pedidos pendentes
O sistema SHALL impedir a remoção de um prato do cardápio quando existir algum item de pedido com status `pending` vinculado a ele; pedidos `produced` ou `paid` SHALL NOT bloquear a remoção.

#### Scenario: Remover prato com pedido pendente
- **WHEN** a dona tenta remover do cardápio um prato que possui ao menos um item de pedido `pending`
- **THEN** o sistema rejeita a remoção com um erro informando que há pedidos pendentes

#### Scenario: Remover prato com apenas pedidos produzidos ou pagos
- **WHEN** a dona remove um prato do cardápio cujos pedidos vinculados estão todos `produced` ou `paid`
- **THEN** o sistema remove o prato do cardápio (soft delete)

### Requirement: Grade do cardápio ordenada alfabeticamente
A listagem de pratos do cardápio de uma semana SHALL ser ordenada em ordem alfabética pelo nome da receita.

#### Scenario: Exibir grade do cardápio
- **WHEN** a dona acessa o cardápio de uma semana com múltiplos pratos adicionados
- **THEN** os pratos são exibidos em ordem alfabética pelo nome da receita
