# Frontend — CLAUDE.md

Next.js (App Router) + Tailwind CSS + shadcn/ui. Leia o `CLAUDE.md` da raiz antes deste.

---

## Estrutura de pastas

```
apps/frontend/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                        # Home
│   ├── pedidos/
│   │   └── page.tsx                    # Lista + drawer de novo pedido
│   ├── cardapio/
│   │   └── page.tsx
│   ├── receitas/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── ingredientes/
│   │   └── page.tsx
│   ├── clientes/
│   │   └── page.tsx                    # Grupos via modal, sem sub-rota
│   ├── precos/
│   │   └── page.tsx
│   ├── compras/
│   │   └── page.tsx                    # Abas: Ingredientes + Custos gerais
│   └── financeiro/
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                 # Desktop
│   │   └── BottomNav.tsx              # Mobile
│   ├── shared/
│   │   ├── WeekPicker.tsx
│   │   ├── IngredienteSelector.tsx     # Dropdown pesquisável + modal inline
│   │   └── StatusBadge.tsx
│   └── modules/
│       ├── pedidos/
│       ├── receitas/
│       ├── compras/
│       └── financeiro/
├── hooks/
│   ├── useSemanaAtual.ts
│   └── useWeekPicker.ts
├── types/                              # Tipagens internas do frontend
└── lib/
    ├── api.ts                          # Cliente Eden Treaty
    └── utils.ts
```

---

## Estado global — Semana

A semana selecionada é **global e persistente** entre todas as páginas. Ao navegar entre telas, a semana não reseta.

- Implementar via Context ou Zustand
- Week picker fica no **canto superior direito do header** em todas as páginas
- Exibe: "Semana XX · Mês AAAA" com setas ← →
- Semanas não existentes no banco são criadas automaticamente ao selecionar

---

## Consumo da API

Usar **Eden Treaty** para tipagem end-to-end com o backend Elysia.

```typescript
// lib/api.ts
import { treaty } from '@elysiajs/eden'
import type { App } from '../../backend/src'

export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL!)
```

**Server state:** TanStack Query — toda chamada à API passa por ele.
**Form state:** useState / useReducer local — não vai para o TanStack Query.

---

## Padrões de componente

- Componentes de página em `app/*/page.tsx`
- Componentes reutilizáveis em `components/shared/`
- Componentes específicos de módulo em `components/modules/[modulo]/`
- Nunca importar de `shared/schemas/` diretamente nos componentes — usar os tipos inferidos via `z.infer<>` importados de `shared/schemas/`

---

## Padrões de UI importantes

- **Drawer lateral** — novo pedido abre sobre a lista, sem rota própria
- **Modais empilhados** — ex: modal de cliente pode abrir modal de grupos por cima
- **Accordion** — lista de clientes na Home usa seta `›` para expandir itens inline
- **Chips clicáveis** — seleção de grupo e de unidade usam chips, não dropdown
- **Semana vinculada ao week picker** — pedidos, compras e cardápio sempre usam a semana do estado global

---

## Regras de exibição de valores

- Pix e Swile **sempre exibidos lado a lado** na Home para todos os clientes
- Na lista de Pedidos: coluna VALOR exibe método + valor para pagos; só valor Pix para pendentes
- Valor unitário em Compras: só aparece quando quantidade E valor total estão preenchidos
  - `g` / `ml` → 3 casas decimais
  - `kg` / `L` / `un` → 2 casas decimais

---

## Convenção de idioma

**Todo o código deve estar em inglês:** nomes de arquivos, componentes, hooks, funções, variáveis e propriedades. As rotas Next.js (`app/*/`) podem usar português nos segmentos de URL pois são visíveis ao usuário. Português é reservado para texto exibido na UI e para comentários/documentação.

---

## Deploy

Vercel. Variável de ambiente obrigatória: `NEXT_PUBLIC_API_URL` apontando para o backend no Render.