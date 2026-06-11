# Clientes

## O que é

Cadastro de clientes recorrentes da marmitaria. A dona cadastra uma vez e seleciona nas semanas seguintes ao registrar pedidos.

---

## Dados de um cliente

- **Nome** — texto (ex: "Dona Lúcia", "Marcos")
- **Grupo** — a qual grupo pertence (ex: Família, Trabalho)

---

## Como é gerenciado

Tela simples em `/clientes` com lista de todos os clientes. O mesmo modal de criação/edição é compartilhado com a tela de Pedidos — ao registrar um novo pedido, a dona pode cadastrar um cliente novo sem sair do fluxo.

---

## Regras

- Cada cliente pertence a **um único grupo**
- Clientes são recorrentes — cadastrados uma vez, selecionados nas semanas seguintes
- Soft delete — clientes não são excluídos fisicamente
- **Exclusão via grupo:** ao excluir um grupo, todos os clientes associados são desativados junto (soft delete em cascata)
- Não há exclusão individual de cliente pela tela de clientes — apenas edição

---

## Relacionamentos

- [[Grupos]] — todo cliente pertence a um grupo
- [[Pedidos]] — clientes são selecionados ao registrar pedidos