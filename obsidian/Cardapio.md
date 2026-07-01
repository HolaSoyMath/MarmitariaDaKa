# Cardápio

## O que é

O cardápio define quais pratos estarão disponíveis para pedido em uma semana específica. É montado pela dona no início do ciclo semanal.

---

## Regras

- **Só entra prato com receita cadastrada e ativa** — não é possível adicionar um prato ao cardápio sem ter uma receita vinculada; receitas desativadas não aparecem no modal de adicionar prato
- Cada receita aparece **no máximo uma vez** por semana — sem repetição
- **Tamanhos por semana** — ao adicionar um prato ao cardápio, a dona escolhe quais dos tamanhos cadastrados na receita estarão disponíveis naquela semana (pode ser todos, ou só alguns, ex: só o de 550G). Essa escolha pode ser editada depois, direto no card do prato já no cardápio
- O card do prato no cardápio mostra somente os tamanhos escolhidos para aquela semana — não todos os tamanhos cadastrados na receita, nem todos os tipos de preço do sistema
- O cardápio é por semana — semanas diferentes podem ter cardápios completamente distintos, inclusive com tamanhos diferentes para o mesmo prato
- Remover um prato do cardápio só é possível se não houver pedidos pendentes com aquele prato (`pendente`) — pedidos já `produzido` ou `pago` não bloqueiam
- A grade de pratos do cardápio é sempre ordenada em ordem alfabética pelo nome da receita

---

## Como é montado

Na tela de Cardápio & Receitas, a dona seleciona a semana via week picker e adiciona pratos via modal de busca:

- O modal lista todas as receitas ativas cadastradas
- Ao clicar em "Adicionar" numa receita, a dona escolhe os tamanhos daquela semana antes de confirmar
- Receitas já no cardápio aparecem marcadas como "no cardápio" — bloqueadas para nova adição
- Se a receita não existir: link "Cadastre uma nova receita aqui" redireciona para `/receitas`
- Não há criação de receita inline no modal do cardápio

---

## Relacionamentos

- [[Semana]] — cada cardápio pertence a uma semana
- [[Receitas]] — pratos do cardápio são vinculados a receitas existentes
- [[Pedidos]] — itens do pedido são escolhidos do cardápio da semana