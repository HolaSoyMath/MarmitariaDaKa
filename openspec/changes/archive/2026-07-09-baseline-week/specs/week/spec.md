## ADDED Requirements

### Requirement: Semana identificada por número ISO e ano
Cada semana SHALL ser identificada pela combinação de número da semana ISO (1 a 53) e ano.

#### Scenario: Identificação de semana
- **WHEN** o sistema referencia uma semana
- **THEN** ela é identificada por `number` (1-53) e `year`, exibida como "Semana XX · Mês AAAA"

### Requirement: Criação idempotente sob demanda
O sistema SHALL criar uma semana automaticamente na primeira vez em que ela é selecionada, e SHALL retornar a semana já existente em seleções subsequentes, sem duplicar registros para o mesmo número + ano.

#### Scenario: Selecionar semana inédita
- **WHEN** a dona navega até uma semana que ainda não existe no banco e a seleciona
- **THEN** o sistema cria essa semana automaticamente

#### Scenario: Selecionar semana já existente
- **WHEN** a dona seleciona uma semana que já foi aberta anteriormente
- **THEN** o sistema retorna o registro existente sem criar um duplicado

### Requirement: Sem restrição de semana futura ou passada
O sistema SHALL permitir navegar e abrir tanto semanas futuras quanto passadas, sem limite de data.

#### Scenario: Navegar para semana futura
- **WHEN** a dona avança o week picker além da semana atual
- **THEN** o sistema permite selecionar e abrir essa semana futura normalmente

### Requirement: Semana selecionada é estado global persistente
A semana selecionada SHALL ser mantida como estado global no frontend, exibida no week picker presente em todas as páginas, e SHALL persistir ao navegar entre telas sem resetar.

#### Scenario: Navegar entre páginas mantém a semana
- **WHEN** a dona troca de tela com uma semana selecionada
- **THEN** a mesma semana continua selecionada na nova tela, sem reset

### Requirement: Histórico de semanas passadas sempre disponível
Semanas passadas SHALL continuar disponíveis para consulta indefinidamente.

#### Scenario: Consultar semana antiga
- **WHEN** a dona navega o week picker para uma semana de meses atrás que já foi aberta
- **THEN** o sistema retorna os dados dessa semana normalmente
