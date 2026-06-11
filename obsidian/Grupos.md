# Grupos

## O que é

Agrupamento de clientes por categoria. Serve para organizar e identificar de onde vêm os clientes da dona.

---

## Dados de um grupo

- **Nome** — texto (ex: "Família", "Amigos", "Trabalho")

---

## Como é gerenciado

Via modal acessível na tela de Clientes — não tem tela própria. O modal permite:
- Criar novo grupo
- Renomear grupo existente
- Excluir grupo

---

## Regras

- Grupos são criados manualmente — não há grupos padrão pré-cadastrados
- Cada cliente pertence a exatamente um grupo
- **Excluir um grupo exclui todos os clientes associados** — soft delete em cascata
- O sistema exibe aviso de confirmação antes de excluir: "Todos os clientes deste grupo serão desativados junto"

---

## Relacionamentos

- [[Clientes]] — cada cliente pertence a um grupo