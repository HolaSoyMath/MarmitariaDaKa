# Tipos e Preços

## O que é

Cadastro dos tipos de produto e seus preços. Define quais tamanhos existem e quanto custam em Pix e Swile.

---

## Dados de um tipo

- **Tipo** — categoria do produto (ex: "Marmita", "Caldo")
- **Tamanho** — variação do tipo (ex: "400G", "550G", "400ml")
- **Valor Pix** — preço quando pago via Pix
- **Valor Swile** — preço quando pago via cartão Swile
- **Custo adicional** — valor fixo de custo (não de venda) desse tamanho: pote, fita, adesivo e outros materiais usados na embalagem. Entra na soma do "Custo médio" da receita em [[Receitas]] e no [[Cardapio|Cardápio]], junto com o custo dos ingredientes

Exemplos:

| Tipo | Tamanho | Pix | Swile | Custo adicional |
|---|---|---|---|---|
| Marmita | 400G | R$ 18,00 | R$ 21,00 | R$ 1,20 |
| Marmita | 550G | R$ 26,00 | R$ 29,00 | R$ 1,50 |
| Caldo | 400ml | configurável | configurável | configurável |

---

## Regras

- A combinação tipo + tamanho é única — não pode haver dois registros com o mesmo par
- Preços são editáveis a qualquer momento
- **Alterações de preço não afetam pedidos já registrados** — cada pedido guarda um snapshot do preço vigente no momento do registro
- Soft delete — tipos excluídos são desativados, não removidos, para preservar referências de pedidos antigos
- O custo adicional não é snapshotado em pedidos (ele não é um preço de venda) — ele só é usado para compor o "Custo médio" das receitas, sempre com o valor atual

---

## Relacionamentos

- [[Receitas]] — cada receita declara em quais tamanhos é oferecida
- [[Pedidos]] — ao registrar um item de pedido, o preço do tipo é copiado como snapshot