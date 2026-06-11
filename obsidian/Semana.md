# Semana

## O que é

A semana é a unidade central do sistema. Tudo — cardápio, pedidos, compras e custos — pertence a uma semana específica.

Identificada pelo número ISO da semana + ano (ex: Semana 23 / 2025).

---

## Como é criada

A dona abre a semana manualmente via week picker — ela navega até a semana desejada e o sistema a cria automaticamente ao selecionar.

Não há criação automática de semana sem ação da dona. Não há data de fechamento — o ciclo é controlado por ela.

---

## Week picker

- Presente em todas as páginas no canto superior direito
- Exibe: "Semana XX · Mês AAAA"
- Navegação por setas ← →
- Sem restrição de semana futura ou passada
- **A semana selecionada é global e persiste ao navegar entre páginas** — trocar de tela não reseta a semana

---

## Regras

- Cada semana pode ter: um cardápio, uma compra, vários pedidos e vários custos gerais
- Semanas passadas ficam disponíveis para consulta — o histórico nunca some
- Uma semana só existe no banco quando a dona a seleciona pela primeira vez

---

## Relacionamentos

- [[Cardapio]] — o cardápio é montado por semana
- [[Pedidos]] — pedidos são vinculados à semana selecionada no week picker
- [[Compras]] — uma compra por semana (editável)
- [[CustosGerais]] — custos lançados por semana