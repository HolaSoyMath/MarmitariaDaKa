# Compras

## O que é

Registro das compras de ingredientes feitas pela dona ao longo da semana. Alimenta o cálculo de custos da semana e o gás automático.

---

## Dados de uma compra

Cada item da compra tem:
- **Ingrediente** — selecionado do cadastro
- **Quantidade** — com unidade do ingrediente
- **Valor total pago** — valor pago por aquela quantidade
- **Valor unitário** — calculado automaticamente (valor total ÷ quantidade) e salvo como snapshot
- **Local** — opcional, nome do mercado (ex: "Atacadão", "Feira")

---

## Uma compra por semana

Existe apenas **uma compra por semana** — a dona vai editando a mesma lista conforme faz novas idas ao mercado. Não é possível criar uma segunda compra para a mesma semana.

O campo `criado em` de cada item registra o dia em que aquele item foi adicionado — permite saber quando cada ingrediente foi comprado.

---

## Valor unitário — snapshot imutável

Ao salvar um item, o sistema calcula `valor unitário = valor total ÷ quantidade` e armazena. Esse valor nunca é recalculado — é um dado histórico.

---

## Gás automático

Toda vez que a lista de compras é alterada (item adicionado, editado ou removido), o sistema recalcula automaticamente o custo de gás da semana como **5% do total de ingredientes**. Não é lançado manualmente.

---

## Regras

- Soft delete nos itens removidos — o histórico de compras não é apagado
- O valor unitário é calculado no momento do registro e nunca recalculado
- O local é opcional — nem sempre a dona vai querer registrar onde comprou

---

## Relacionamentos

- [[Semana]] — uma compra por semana
- [[Ingredientes]] — itens da compra referenciam ingredientes cadastrados
- [[CustosGerais]] — o total de ingredientes alimenta o cálculo do gás automático