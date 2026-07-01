# Cardápio

## O que é

O cardápio define quais pratos estarão disponíveis para pedido em uma semana específica. É montado pela dona no início do ciclo semanal.

---

## Regras

- **Só entra prato com receita cadastrada** — não é possível adicionar um prato ao cardápio sem ter uma receita vinculada
- Cada receita aparece **no máximo uma vez** por semana — sem repetição
- O card do prato no cardápio mostra somente os tamanhos vinculados à receita (definidos no cadastro da receita), não todos os tipos de preço cadastrados no sistema
- O cardápio é por semana — semanas diferentes podem ter cardápios completamente distintos
- Remover um prato do cardápio só é possível se não houver pedidos ativos com aquele prato (`pendente` ou `produzido`)

---

## Como é montado

Na tela de Cardápio & Receitas, a dona seleciona a semana via week picker e adiciona pratos via modal de busca:

- O modal lista todas as receitas cadastradas
- Receitas já no cardápio aparecem marcadas como "no cardápio" — bloqueadas para nova adição
- Se a receita não existir: link "Cadastre uma nova receita aqui" redireciona para `/receitas`
- Não há criação de receita inline no modal do cardápio

---

## Relacionamentos

- [[Semana]] — cada cardápio pertence a uma semana
- [[Receitas]] — pratos do cardápio são vinculados a receitas existentes
- [[Pedidos]] — itens do pedido são escolhidos do cardápio da semana