# Tipos e Preços

## O que é

Cadastro dos tipos de produto e seus preços. Define quais tamanhos existem e quanto custam em Pix e Swile.

---

## Dados de um tipo

- **Tipo** — categoria do produto (ex: "Marmita", "Caldo")
- **Tamanho** — variação do tipo (ex: "400G", "550G", "400ml")
- **Valor Pix** — preço quando pago via Pix
- **Valor Swile** — preço quando pago via cartão Swile

Exemplos:

| Tipo | Tamanho | Pix | Swile |
|---|---|---|---|
| Marmita | 400G | R$ 18,00 | R$ 21,00 |
| Marmita | 550G | R$ 26,00 | R$ 29,00 |
| Caldo | 400ml | configurável | configurável |

---

## Regras

- A combinação tipo + tamanho é única — não pode haver dois registros com o mesmo par
- Preços são editáveis a qualquer momento
- **Alterações de preço não afetam pedidos já registrados** — cada pedido guarda um snapshot do preço vigente no momento do registro
- Soft delete — tipos excluídos são desativados, não removidos, para preservar referências de pedidos antigos

---

## Relacionamentos

- [[Pedidos]] — ao registrar um item de pedido, o preço do tipo é copiado como snapshot