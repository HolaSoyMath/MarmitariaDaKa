# Custos Gerais

## O que é

Registro dos custos fixos da semana além dos ingredientes — embalagem, luz, água, e o gás calculado automaticamente. Junto com as compras, forma o custo total da semana que alimenta o financeiro.

---

## Tipos de custo

**Manual** — lançado pela dona:
- Descrição livre (ex: "Embalagem", "Água")
- Valor em R$
- Editável e removível a qualquer momento

**Gás (automático)** — calculado pelo sistema:
- 5% do total de ingredientes da semana
- Recalculado automaticamente toda vez que a lista de compras muda
- Não é editável nem removível pela dona

---

## Custo total da semana

O painel de Compras & Custos exibe o resumo consolidado:

```
Custo de ingredientes    R$ XX,00
+ Custos gerais + gás    R$ XX,00
= Total da semana        R$ XX,00
```

Esse total é o que o Financeiro usa como custo da semana.

---

## Regras

- Custos manuais têm soft delete — não são removidos fisicamente
- O gás nunca é lançado manualmente — qualquer tentativa deve ser bloqueada
- Valores são snapshot — registrados no momento do lançamento e não recalculados retroativamente

---

## Relacionamentos

- [[Semana]] — custos são lançados por semana
- [[Compras]] — o total de ingredientes da semana determina o valor do gás