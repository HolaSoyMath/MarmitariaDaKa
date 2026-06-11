# Receitas

## O que é

Cadastro das receitas que a dona prepara. Uma receita define o nome do prato e quais ingredientes o compõem com suas respectivas quantidades.

Receitas são o pré-requisito para montar o cardápio — sem receita cadastrada, o prato não entra na semana.

---

## Dados de uma receita

- **Nome** — texto único (ex: "Fricassê de Frango", "Caldo de Feijão")
- **Ingredientes** — lista com ingrediente + quantidade

---

## Última vez no cardápio

A lista de receitas exibe quando aquela receita foi usada pela última vez no cardápio semanal. Se nunca foi usada, exibe "nunca usada". Ajuda a dona a lembrar quais pratos já fez recentemente.

---

## Regras

- Nome é único — não podem existir duas receitas com o mesmo nome
- **Uma receita não pode ser editada ou excluída se tiver pedidos ativos** (status `pendente` ou `produzido`) vinculados a ela no cardápio da semana atual
- Ao editar os ingredientes de uma receita, a lista é substituída integralmente — não há edição parcial
- Soft delete na exclusão da receita
- A composição de ingredientes (lista) usa delete físico ao editar — sem histórico de versões

---

## Relacionamentos

- [[Ingredientes]] — receitas são compostas por ingredientes
- [[Cardapio]] — receitas são vinculadas ao cardápio da semana