# Frontend — UI Guide

Regras de exibição de valores, formatação e identidade visual.

---

## Regras de exibição — Pix e Swile

| Contexto | Comportamento |
|---|---|
| Home — lista de clientes | Sempre os dois lado a lado para todos |
| Lista de Pedidos — coluna VALOR | Método + valor para pagos; só Pix para pendentes |
| Drawer de novo pedido — rodapé | Total Pix e Total Swile em tempo real |
| Detalhe do pedido | Sempre os dois |

---

## Regras de exibição — Valor unitário (Compras)

Calculado: `Valor Total ÷ Quantidade`

Só exibido quando quantidade **e** valor total estão preenchidos.

| Unidade | Casas decimais | Exemplo |
|---|---|---|
| `g` / `ml` | 3 | `R$ 0,028 /g` |
| `kg` / `L` / `un` | 2 | `R$ 14,00 /kg` |

---

## Regras de exibição — Receitas

- Lista de receitas exibe **"última vez no cardápio"** — data da semana mais recente em que apareceu
- Se nunca usada no cardápio: exibe "nunca usada"
- Campo calculado pelo backend (`ultimaVezNoCardapio` no `receitaResponse`)

---

## Formatação de valores

Nunca formatar inline nos componentes. Sempre usar `formatters/`:

```typescript
// moeda.formatter.ts
formatarMoeda(14)              // → "R$ 14,00"
formatarMoeda(0.028)           // → "R$ 0,028"  (não usado isolado)
formatarValorUnitario(0.028, 'g')   // → "R$ 0,028 /g"
formatarValorUnitario(14, 'kg')     // → "R$ 14,00 /kg"
formatarValorUnitario(9, 'ml')      // → "R$ 0,006 /ml"

// semana.formatter.ts
formatarSemana(23, 2025)       // → "Semana 23 · Jun 2025"
formatarSemanaAbreviada(23)    // → "S23"  (usado no gráfico)
```

---

## Identidade visual

- **Mobile first** — sidebar no desktop, bottom nav no mobile
- **Paleta:** tons quentes — mostarda, terracota, verde oliva, branco
- **Tipografia:** sem serifa, legível, tamanho generoso no mobile
- **Ícones:** Lucide (incluso no shadcn)
- **Dark mode:** não é prioridade

### Cores de status
| Status | Cor |
|---|---|
| `pendente` | Neutro (cinza) |
| `produzido` | Mostarda / dourado |
| `pago` | Verde |
| Lucro positivo | Verde |
| Custo / saída | Terracota / vermelho |

### Navegação
- **Desktop:** sidebar lateral com 6 itens
- **Mobile:** bottom navigation bar com 6 itens

```
🏠 Home
📋 Pedidos
🍽️ Cardápio & Receitas
👥 Clientes
🛒 Compras & Custos
📊 Financeiro
```

---

## Padrões de interação

| Padrão | Onde é usado |
|---|---|
| Drawer lateral | Novo pedido |
| Modal centrado | Novo/editar cliente, grupos, adicionar prato, cadastrar ingrediente |
| Modais empilhados | Modal de cliente → modal de grupos |
| Accordion (seta `›`) | Lista de clientes na Home |
| Chips clicáveis | Seleção de grupo, seleção de unidade, tamanhos de produto |
| Empty state com CTA | Pedidos sem registros na semana |
| Botão salvar inline | Edição de custo geral (aparece ao editar) |