# Receitas

## O que é

Cadastro das receitas que a dona prepara. Uma receita define o nome do prato e, para cada tamanho em que é oferecida, quais ingredientes a compõem com suas respectivas quantidades.

Receitas são o pré-requisito para montar o cardápio — sem receita cadastrada, o prato não entra na semana.

---

## Dados de uma receita

- **Nome** — texto único (ex: "Fricassê de Frango", "Caldo de Feijão")
- **Tamanhos disponíveis** — um ou mais [[TiposPrecos|tipos de preço]] em que o prato é oferecido (ex: Marmita 400G, Marmita 550G), cada um já com seu preço Pix/Swile vindo do cadastro de Tipos e Preços
- **Ingredientes por tamanho** — cada tamanho vinculado à receita tem sua **própria** lista de ingrediente + quantidade. Uma Marmita 400G e uma Marmita 550G da mesma receita levam quantidades diferentes de cada ingrediente (é por isso que existem em tamanhos diferentes), então cada uma tem seu próprio "Custo Aproximado", calculado independentemente
- **Ativa** — booleano, `true` por padrão

---

## Custo médio preso à semana

O "Custo médio" de cada tamanho é a soma de dois componentes: o custo dos ingredientes (média das últimas compras) **mais o Custo adicional** cadastrado em [[TiposPrecos|Tipos e Preços]] para aquele tamanho (pote, fita, adesivo etc). O Custo adicional é um valor fixo definido em Preços — não vem de compras, então não tem histórico nem trava de semana; entra sempre pelo valor atual configurado no tipo de preço.

Na listagem de Receitas, o custo dos ingredientes é calculado com base na média das últimas compras daquele ingrediente **até a semana selecionada no week picker global** (inclusive) — nunca usando compras de semanas posteriores. Isso significa que, se a dona olhar o custo de um prato numa semana passada, registrar depois uma compra numa semana futura com preço diferente, e voltar a olhar aquela semana passada, o valor **não muda** — só muda o custo a partir da semana em que a compra nova foi registrada. O Custo adicional soma normalmente por cima desse valor.

Se nenhum ingrediente do tamanho tiver histórico de compra, o "Custo médio" ainda aparece — igual ao Custo adicional — e fica marcado como parcial (⚠), já que falta o custo dos ingredientes.

No formulário de criar/editar receita (aba "Ingredientes"), o "Custo Aproximado" continua sendo uma estimativa **ao vivo**, sem essa trava de semana — usa sempre o histórico de compras mais recente disponível, porque faz sentido ver o valor mais atual possível enquanto se está montando a receita.

No [[Cardapio|Cardápio da semana]], cada prato mostra seu "Custo médio" preso à própria semana do cardápio (a mesma regra, usando a semana daquele cardápio como referência).

---

## Última vez no cardápio

A lista de receitas exibe quando aquela receita foi usada pela última vez no cardápio semanal. Se nunca foi usada, exibe "nunca usada". Ajuda a dona a lembrar quais pratos já fez recentemente.

---

## Ativar / desativar

Uma receita pode ser desativada sem ser excluída — útil quando a dona quer parar de oferecer um prato temporariamente (ex: para ajustar a receita) sem perder o cadastro nem o histórico.

- Receita desativada some da lista padrão de Receitas (existe um filtro para ver as inativas) e não aparece mais no modal de "Adicionar prato ao cardápio"
- Desativar/ativar não é bloqueado por pedidos pendentes — é só uma flag de visibilidade, não altera dados
- Pratos já adicionados ao cardápio de semanas anteriores continuam existindo normalmente mesmo se a receita for desativada depois
- A lista de Receitas é sempre ordenada em ordem alfabética por nome

---

## Regras

- Nome é único — não podem existir duas receitas com o mesmo nome
- Pelo menos um tamanho (tipo de preço) é obrigatório — não é possível salvar uma receita sem nenhum tamanho vinculado
- Cada tamanho vinculado precisa de pelo menos um ingrediente na sua lista — não é possível salvar um tamanho sem ingredientes
- Ao marcar um novo tamanho no formulário, a lista de ingredientes desse tamanho começa **copiando** a lista de outro tamanho já preenchido da mesma receita (ponto de partida editável — na prática, o mais comum é só escalar a proporção)
- **Uma receita não pode ser editada ou excluída se tiver pedidos pendentes** (status `pendente`) vinculados a ela no cardápio da semana atual — pedidos já `produzido` ou `pago` não bloqueiam, pois o preço já foi travado em snapshot no item do pedido
- Ao editar os ingredientes de um tamanho, a lista daquele tamanho é substituída integralmente — não há edição parcial. Editar um tamanho não afeta a lista de ingredientes dos outros tamanhos da mesma receita
- Soft delete na exclusão da receita
- A composição de ingredientes (lista, por tamanho) usa delete físico ao editar — sem histórico de versões. Isso não afeta o Financeiro: o custo dos relatórios vem das compras reais de cada semana, nunca da lista de ingredientes da receita — ver [[Financeiro]]

---

## Relacionamentos

- [[Ingredientes]] — receitas são compostas por ingredientes
- [[TiposPrecos]] — cada receita declara em quais tamanhos é oferecida
- [[Cardapio]] — receitas são vinculadas ao cardápio da semana