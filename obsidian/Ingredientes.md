# Ingredientes

## O que é

Cadastro base de ingredientes usados nas receitas e registrados nas compras. É o ponto de partida — sem ingrediente cadastrado, não é possível criar receitas nem registrar compras.

---

## Dados de um ingrediente

- **Nome** — texto único (ex: "Frango", "Requeijão")
- **Unidade** — define como o ingrediente é medido: `g`, `kg`, `ml`, `L`, `un`

---

## Como é cadastrado

Dois caminhos:

1. **Tela própria** — CRUD simples em `/ingredientes`
2. **Modal inline** — ao cadastrar uma receita ou registrar uma compra, a dona pode cadastrar um novo ingrediente sem sair da tela atual. Após salvar, o ingrediente já fica selecionado automaticamente.

---

## Regras

- Nome é único — não podem existir dois ingredientes com o mesmo nome
- A unidade define as casas decimais do valor unitário nas compras:
  - `g` e `ml` → 3 casas decimais
  - `kg`, `L` e `un` → 2 casas decimais
- Soft delete — ingredientes não são excluídos fisicamente para preservar histórico de compras e receitas

---

## Relacionamentos

- [[Receitas]] — ingredientes compõem as receitas
- [[Compras]] — ingredientes são selecionados ao registrar compras