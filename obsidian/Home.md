# Home

## O que é

Painel operacional da semana. É a tela principal — onde a dona acompanha o que precisa produzir e marca as produções do dia.

---

## O que exibe

**Card de totais** — visão rápida da semana:
- Total de marmitas a entregar (soma de todos os itens de todos os pedidos)
- Quantidade ainda a produzir (soma dos itens de pedidos `pendente`)
- Valor total ainda a receber, em Pix (soma dos itens de pedidos que não estão `pago` — ou seja, `pendente` e `produzido` juntos)

**Por prato** — grade com os até 4 pratos **mais pedidos** da semana (ordenados por quantidade total pedida, não os 4 primeiros do cardápio), cada um com a quantidade por tamanho. Posições sem prato aparecem vazias ("livre")

**Clientes da semana** — lista de todos os clientes com pedido, mostrando:
- Valores Pix e Swile lado a lado (sempre os dois)
- Seta `›` para expandir os itens do pedido inline (accordion)
- Checkbox para marcar como produzido

---

## Ações disponíveis na Home

**Marcar como produzido / desmarcar** — checkbox `✓` ao lado do cliente, alterna entre `pendente` e `produzido`. Fica desabilitado quando o pedido já está `pago`.

**Marcar como pago não está disponível na Home.** Essa ação (escolher Pix ou Swile e confirmar o pagamento) só existe na tela de [[Pedidos]] — assim como desmarcar um pagamento já registrado. A Home e a tela de Pedidos compartilham o controle de marcar/desmarcar produzido, mas apenas Pedidos lida com pagamento.

---

## Relacionamentos

- [[Frontend]] — a Home é uma tela do frontend
- [[Pedidos]] — a Home consome os mesmos pedidos da semana; marcar/desmarcar pago é feito na tela de Pedidos