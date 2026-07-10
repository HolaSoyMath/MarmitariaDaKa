# financial Specification

## Purpose
TBD - created by archiving change baseline-financial. Update Purpose after archive.
## Requirements
### Requirement: Três modos de visualização de período
O sistema SHALL permitir consultar o relatório financeiro em três modos: por semana (usando a semana do week picker), por mês (agrupando todas as semanas do mês escolhido) ou por período livre (data início e data fim escolhidas pela dona).

#### Scenario: Consulta por semana
- **WHEN** a dona consulta o Financeiro no modo semana
- **THEN** o sistema calcula as métricas com base apenas na semana selecionada no week picker

#### Scenario: Consulta por mês
- **WHEN** a dona escolhe um mês no modo mês
- **THEN** o sistema agrega os dados de todas as semanas ISO que pertencem a esse mês

#### Scenario: Consulta por período livre
- **WHEN** a dona informa uma data de início e uma data de fim
- **THEN** o sistema agrega os dados de todas as semanas contidas nesse intervalo

### Requirement: Faturamento é cash-based (apenas pedidos pagos)
O faturamento, o ranking de clientes e o ranking de grupos SHALL considerar exclusivamente pedidos com status `paid`; pedidos `produced` mas não pagos SHALL NOT entrar no faturamento.

#### Scenario: Pedido produzido mas não pago não conta
- **WHEN** um pedido está com status `produced` e ainda não foi marcado como pago
- **THEN** seu valor não é somado ao faturamento do período

#### Scenario: Pedido pago conta no faturamento
- **WHEN** um pedido está com status `paid`
- **THEN** seu valor (conforme o método de pagamento snapshot no item) é somado ao faturamento do período

### Requirement: Métricas principais do período
O sistema SHALL calcular, para o período selecionado: custo total (com detalhamento em ingredientes, custos gerais manuais e gás automático), faturamento, lucro (faturamento menos custo total) com margem percentual, ticket médio (faturamento dividido pelo número de pedidos pagos), e break-even (custo dividido pelo preço médio por marmita, comparado com a quantidade realmente vendida).

#### Scenario: Breakdown de custo separado em três partes
- **WHEN** o sistema calcula o custo total do período
- **THEN** ele expõe separadamente o custo de ingredientes (compras), o custo geral manual e o custo de gás automático

#### Scenario: Cálculo de break-even
- **WHEN** o sistema calcula o break-even do período
- **THEN** ele divide o custo total pelo preço médio por marmita e compara o resultado com a quantidade de marmitas efetivamente vendidas no período

### Requirement: Comparação com período anterior
O sistema SHALL comparar faturamento, custo e lucro do período selecionado com o período imediatamente anterior de mesma granularidade (semana anterior no modo semana, mês anterior no modo mês, ou um período de mesma duração imediatamente antes do início do período livre); quando o período anterior não existir no banco ou tiver valor zero, o sistema SHALL exibir a variação como indisponível em vez de uma porcentagem.

#### Scenario: Período anterior existente
- **WHEN** o período anterior tem dados registrados com valor diferente de zero
- **THEN** o sistema exibe a variação percentual de faturamento, custo e lucro em relação a ele

#### Scenario: Período anterior inexistente ou zerado
- **WHEN** o período anterior nunca foi aberto no sistema, ou teve valor zero na métrica comparada
- **THEN** o sistema exibe a variação como indisponível ("—") em vez de calcular uma porcentagem

### Requirement: Semana recorde histórica
O sistema SHALL calcular, entre todas as semanas já registradas no banco (não limitado ao período selecionado), a semana de maior faturamento e a semana de maior lucro, que podem ser semanas diferentes.

#### Scenario: Semanas recordes diferentes
- **WHEN** a semana de maior faturamento histórico não é a mesma de maior lucro histórico
- **THEN** o sistema exibe as duas semanas recordes separadamente, cada uma com sua métrica

### Requirement: Projeção do mês com limiar de histórico mínimo
No modo mês, o sistema SHALL projetar o faturamento esperado do mês inteiro com base na média das semanas já registradas naquele mês multiplicada pelo total de semanas ISO do mês, exibindo essa projeção somente quando o sistema tiver ao menos 4 semanas de histórico total (contando todas as semanas já abertas, de qualquer período).

#### Scenario: Histórico insuficiente
- **WHEN** o sistema tem menos de 4 semanas abertas no total
- **THEN** a projeção do mês não é exibida

#### Scenario: Histórico suficiente
- **WHEN** o sistema já tem 4 ou mais semanas abertas no total e a dona consulta o modo mês
- **THEN** o sistema exibe a projeção de faturamento do mês

### Requirement: Séries temporais para gráficos
O sistema SHALL expor uma série temporal por semana de faturamento e custo (para o gráfico entrou×saiu e o gráfico de linha de lucro/margem) e uma série temporal do mix de pagamento Pix vs Swile; no modo semana a série tem um único ponto, e nos modos mês/período livre a série tem um ponto por semana contida no intervalo.

#### Scenario: Série no modo semana
- **WHEN** a dona consulta o modo semana
- **THEN** a série temporal retorna um único ponto, referente àquela semana

#### Scenario: Série no modo mês ou período
- **WHEN** a dona consulta o modo mês ou período livre
- **THEN** a série temporal retorna um ponto por semana contida no intervalo, permitindo visualizar a evolução ao longo do tempo

### Requirement: Pratos mais pedidos com drill-down por tamanho
O sistema SHALL listar os pratos mais pedidos do período por quantidade, permitindo detalhar cada prato por tamanho, mostrando quantidade vendida e faturamento de cada tamanho.

#### Scenario: Detalhar prato por tamanho
- **WHEN** a dona expande um prato no ranking de mais pedidos
- **THEN** o sistema exibe a quantidade vendida e o faturamento de cada tamanho daquele prato no período

### Requirement: Faturamento agregado por tamanho de marmita
O sistema SHALL agregar o faturamento do período por tamanho de marmita, somando entre todas as receitas, para indicar se tamanhos maiores ou menores têm mais peso no faturamento.

#### Scenario: Agregação entre receitas diferentes
- **WHEN** duas receitas diferentes oferecem o mesmo tamanho (ex: "550G")
- **THEN** o faturamento desse tamanho soma os valores das duas receitas juntas

### Requirement: Comparativo Pix vs Swile
O sistema SHALL calcular, para o período, a quantidade de pedidos e o valor total recebido por cada método de pagamento (Pix, Swile), incluindo o ticket médio de cada método, além de disponibilizar essa comparação como série temporal ao longo das semanas.

#### Scenario: Ticket médio por método
- **WHEN** o sistema calcula o comparativo Pix vs Swile do período
- **THEN** ele exibe, para cada método, a quantidade de pedidos, o valor total recebido e o ticket médio (valor total dividido pela quantidade)

### Requirement: Ranking de ingredientes por custo histórico
O sistema SHALL calcular, para cada ingrediente, a soma histórica total do valor gasto em compras e a variação percentual do valor unitário entre a primeira e a última compra registrada; ao selecionar um ingrediente, o sistema SHALL exibir a evolução completa do valor unitário e um recorte das últimas 5 compras.

#### Scenario: Selecionar ingrediente no ranking
- **WHEN** a dona clica em um ingrediente no ranking de custo
- **THEN** o sistema exibe a evolução histórica completa do valor unitário e destaca as últimas 5 compras

### Requirement: Indicador de prato parado
Para cada receita ativa, o sistema SHALL calcular a última vez em que ela apareceu em um pedido com status `paid` ou `produced` (não a última vez que apareceu no cardápio); receitas nunca vendidas SHALL ser indicadas como nunca vendidas.

#### Scenario: Receita nunca vendida
- **WHEN** uma receita ativa nunca teve um item de pedido `produced` ou `paid`
- **THEN** o sistema a indica como "nunca vendida"

#### Scenario: Distinção de "última vez no cardápio"
- **WHEN** uma receita esteve no cardápio de uma semana recente mas nunca teve pedido produzido ou pago naquela semana
- **THEN** o indicador de "prato parado" não considera essa presença no cardápio como venda

### Requirement: Ranking de clientes e grupos por histórico total
O sistema SHALL rankear clientes e grupos por quantidade de pedidos pagos e por valor total pago, considerando por padrão o histórico total (não limitado ao período selecionado na tela).

#### Scenario: Ranking não muda com o período selecionado
- **WHEN** a dona troca o período selecionado no Financeiro (semana, mês ou período livre)
- **THEN** o ranking de clientes e de grupos continua refletindo o histórico total de pedidos pagos, não apenas o período selecionado

### Requirement: Sazonalidade entre anos
O sistema SHALL permitir comparar o mesmo período (semana, mês ou ano, conforme granularidade escolhida pela dona) entre anos diferentes.

#### Scenario: Comparar o mesmo mês em anos diferentes
- **WHEN** a dona escolhe granularidade de mês e compara sazonalidade
- **THEN** o sistema exibe as métricas desse mês em cada ano disponível no histórico, lado a lado

### Requirement: Resumo em linguagem natural
O sistema SHALL gerar alertas automáticos em linguagem natural a partir das métricas já calculadas: variação de lucro em relação ao período anterior, valor total ainda a receber, e prato parado há mais de 4 semanas sem venda.

#### Scenario: Alerta de prato parado
- **WHEN** existe uma receita ativa sem venda (`produced` ou `paid`) há mais de 4 semanas
- **THEN** o resumo em linguagem natural inclui um alerta mencionando esse prato

### Requirement: Ordenação cronológica por semana ISO, não por data de criação
Toda ordenação cronológica no Financeiro (séries temporais, semana recorde, sazonalidade, evolução de preço de ingrediente) SHALL usar o ano e o número da semana ISO da própria semana, nunca a data de criação do registro no banco.

#### Scenario: Edição retroativa não altera a ordem
- **WHEN** a dona edita uma compra de uma semana passada depois de já ter registrado compras de semanas mais recentes
- **THEN** a ordem cronológica exibida continua correta, baseada no (ano, número da semana), não na ordem em que os registros foram salvos ou editados no banco

