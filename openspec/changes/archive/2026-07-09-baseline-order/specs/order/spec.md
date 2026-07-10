## ADDED Requirements

### Requirement: Registro de pedido com um ou mais itens
O sistema SHALL permitir registrar um pedido vinculado a um cliente e a uma semana, com um ou mais itens; cada item referencia um prato do cardápio (`menuItem`) e um tamanho (`priceType`), com uma quantidade.

#### Scenario: Criar pedido com múltiplos itens
- **WHEN** a dona registra um pedido para um cliente com dois ou mais itens de tamanhos diferentes, inclusive o mesmo prato em tamanhos diferentes
- **THEN** o sistema cria o pedido com status inicial `pending` e todos os itens vinculados

#### Scenario: Itens com quantidade zero são ignorados
- **WHEN** o formulário de pedido é salvo com um item cuja quantidade é 0
- **THEN** o sistema não cria esse item, mantendo apenas os itens com quantidade maior que zero

### Requirement: Snapshot imutável de preço
Ao criar ou editar os itens de um pedido, o sistema SHALL copiar os valores Pix e Swile vigentes do tipo de preço para o item do pedido (`snapshotPixPrice`, `snapshotSwilePrice`); esse valor SHALL NOT ser recalculado posteriormente, mesmo que o tipo de preço mude depois.

#### Scenario: Preço alterado depois de o pedido existir
- **WHEN** o preço de um tipo de preço é alterado após um pedido já ter sido registrado com aquele tipo
- **THEN** o item do pedido já registrado mantém os valores Pix e Swile do momento em que foi criado

#### Scenario: Ambos os valores sempre exibidos
- **WHEN** um item de pedido é exibido, independente do método de pagamento que será usado
- **THEN** os valores Pix e Swile são ambos exibidos lado a lado

### Requirement: Transições de status
O status de um pedido SHALL seguir a sequência `pending → produced → paid`, com as seguintes transições permitidas: `pending → produced` (marcar como produzido), `produced → paid` (marcar como pago, informando o método), `produced → pending` (reversão), `paid → produced` (reversão, limpando o método de pagamento) e `paid → pending` (reversão direta, limpando o método de pagamento).

#### Scenario: Marcar como produzido
- **WHEN** a dona marca como produzido um pedido com status `pending`
- **THEN** o sistema muda o status para `produced`

#### Scenario: Marcar como produzido pedido que não está pendente
- **WHEN** a dona tenta marcar como produzido um pedido que não está `pending`
- **THEN** o sistema rejeita a operação com um erro de conflito

#### Scenario: Marcar como pago
- **WHEN** a dona marca como pago um pedido com status `produced`, informando Pix ou Swile
- **THEN** o sistema muda o status para `paid` e grava o método de pagamento informado

#### Scenario: Marcar como pago pedido que não está produzido
- **WHEN** a dona tenta marcar como pago um pedido que não está `produced`
- **THEN** o sistema rejeita a operação com um erro de conflito

#### Scenario: Reverter pedido pago para pendente
- **WHEN** a dona reverte um pedido `paid` diretamente para `pending`
- **THEN** o sistema muda o status para `pending` e limpa o método de pagamento

#### Scenario: Reverter pedido pago para produzido
- **WHEN** a dona reverte um pedido `paid` para `produced` (desmarcar pagamento sem desfazer a produção)
- **THEN** o sistema muda o status para `produced` e limpa o método de pagamento

#### Scenario: Reverter pedido já pendente
- **WHEN** a dona tenta reverter para pendente um pedido que já está `pending`
- **THEN** o sistema rejeita a operação com um erro de conflito

### Requirement: Edição e exclusão restritas a pedidos pendentes
O sistema SHALL permitir editar ou excluir um pedido somente quando seu status for `pending`; pedidos `produced` ou `paid` SHALL NOT poder ser editados ou excluídos.

#### Scenario: Editar pedido pendente
- **WHEN** a dona edita os itens de um pedido com status `pending`
- **THEN** o sistema substitui os itens do pedido pelos novos valores enviados, gerando novos snapshots de preço

#### Scenario: Tentar editar pedido não pendente
- **WHEN** a dona tenta editar um pedido com status `produced` ou `paid`
- **THEN** o sistema rejeita a operação com um erro de conflito

#### Scenario: Tentar excluir pedido não pendente
- **WHEN** a dona tenta excluir um pedido com status `produced` ou `paid`
- **THEN** o sistema rejeita a operação com um erro de conflito

#### Scenario: Excluir pedido pendente
- **WHEN** a dona exclui um pedido com status `pending`
- **THEN** o sistema marca `deletedAt` no pedido (soft delete)

### Requirement: Mudança de status disponível na tela de Pedidos e na Home
A tela de Pedidos SHALL oferecer os mesmos controles de mudança de status (marcar produzido, marcar pago com escolha de método, desmarcar pagamento com confirmação) disponíveis na Home.

#### Scenario: Marcar como produzido pela tela de Pedidos
- **WHEN** a dona marca um pedido `pending` como produzido diretamente na tela de Pedidos
- **THEN** o sistema muda o status para `produced`, da mesma forma que faria a partir da Home

#### Scenario: Desmarcar pagamento pela tela de Pedidos exige confirmação
- **WHEN** a dona tenta desmarcar o pagamento de um pedido `paid` na tela de Pedidos
- **THEN** o sistema exibe um diálogo de confirmação informando que o pedido voltará para produzido e o método de pagamento será removido, antes de efetivar a mudança
