# Pedidos

## O que é

Registro dos pedidos dos clientes para uma semana. É o coração da operação semanal — é aqui que a dona controla o que precisa produzir e o que já recebeu.

---

## Dados de um pedido

- **Cliente** — quem pediu
- **Semana** — semana vinculada ao week picker no momento do registro
- **Itens** — um ou mais pratos do cardápio da semana, cada um com tamanho e quantidade
- **Status** — em qual etapa o pedido está
- **Método de pagamento** — Pix ou Swile (preenchido ao marcar como pago)

---

## Status e transições

```
pendente → produzido → pago
```

- `pendente → produzido` — dona marca quando a marmita está pronta
- `produzido → pago` — dona marca quando recebe o pagamento, informando Pix ou Swile
- `produzido → pendente` — reversão permitida (erro ao marcar antes de produzir)
- `pago` — **irreversível**

**Ações de mudar status ocorrem exclusivamente na Home** — a tela de Pedidos é somente leitura para status.

---

## Preço — snapshot imutável

Ao registrar um pedido, o sistema copia os valores Pix e Swile do tipo de produto vigente e os armazena no item do pedido. Esse valor nunca muda — mesmo que os preços sejam alterados depois.

Os dois valores (Pix e Swile) são sempre exibidos, independente do método que será usado.

---

## Regras

- Um pedido pode ter um ou mais itens
- O mesmo prato pode aparecer em tamanhos diferentes no mesmo pedido (ex: 1× 550G + 1× 400G)
- Itens com quantidade 0 são ignorados ao salvar
- **Edição** — permitida apenas quando `status = pendente`
- **Exclusão** — permitida apenas quando `status = pendente`
- Pedidos `produzido` ou `pago` não podem ser editados nem excluídos
- Soft delete na exclusão

---

## Relacionamentos

- [[Clientes]] — todo pedido pertence a um cliente
- [[Cardapio]] — itens do pedido são selecionados do cardápio da semana
- [[TiposPrecos]] — preço de cada item é copiado como snapshot no momento do pedido
- [[Semana]] — pedido é vinculado à semana selecionada no week picker