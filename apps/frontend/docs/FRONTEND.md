# Frontend — Frontend Guide

Padrões gerais do frontend, estado global e regras de arquitetura de componentes.

---

## Estado global — Semana

A semana selecionada é compartilhada entre todas as páginas via `SemanaContext`.

```typescript
// contexts/SemanaContext.tsx
interface SemanaContextType {
  semanaId: string | null
  numeroSemana: number | null
  ano: number | null
  setSemana: (semana: SemanaResponse) => void
}
```

- Persiste ao navegar entre páginas — não reseta ao trocar de rota
- Inicializa com a semana mais recente existente no banco
- Todas as queries dependentes de semana leem deste context
- Week picker é o único ponto de escrita no context
- Ao selecionar semana inexistente no banco → cria automaticamente via API antes de setar

---

## Stack de UI

| Biblioteca | Uso |
|---|---|
| shadcn/ui | Componentes base (`components/ui/`) |
| Tailwind CSS | Estilização |
| Lucide | Ícones (incluso no shadcn) |
| TanStack Query | Server state |
| Eden Treaty | Cliente tipado da API |

---

## Padrão de chamada à API

Toda chamada à API passa pelo TanStack Query via `services/`:

```typescript
// services/pedidos.service.ts
export function usePedidosDaSemana(semanaId: string) {
  return useQuery({
    queryKey: ['pedidos', semanaId],
    queryFn: () => api.pedidos.get({ query: { semanaId } }),
  })
}

export function useCriarPedido() {
  return useMutation({
    mutationFn: (data: PedidoInput) => api.pedidos.post(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  })
}
```

Componentes nunca chamam `api.*` diretamente — sempre via `services/`.

---

## Regra — Client Components como folhas

`"use client"` apenas nos componentes de interação na ponta da árvore. Nunca colocar num componente pai se apenas um filho precisa de interatividade.

```
page.tsx (Server)
  └── ClientesLista (Server)
        └── ClienteLinha (Server)
              └── BotaoEditar (Client) ← "use client" aqui, não acima
```

---

## Regra — sem lógica nos componentes

Componentes em `components/` recebem dados via props e disparam callbacks — sem lógica de negócio, sem formatação inline, sem chamadas à API.

| Responsabilidade | Onde fica |
|---|---|
| Buscar dados | `services/` |
| Transformar dados | `ComponentName/mapper.ts` ou `mappers/` se compartilhado |
| Formatar para exibição | `ComponentName/formatter.ts` ou `formatters/` se compartilhado |
| Validar formulário | `ComponentName/validator.ts` ou `validators/` se compartilhado |
| Estado global | `contexts/` |
| Renderizar | `components/` |

---

## Co-localização de lógica específica

Quando um mapper, formatter ou validator é **exclusivo de um componente**, ele fica dentro da pasta do componente:

```
components/modules/pedidos/
├── PedidoDrawer.tsx
├── mapper.ts      ← transforma PedidoResponse para o formato do drawer
├── formatter.ts   ← formatação exclusiva da UI do drawer
└── validator.ts   ← validação cruzada dos campos do formulário
```

Nomes fixos: `mapper.ts`, `formatter.ts`, `validator.ts` — sem prefixo de módulo.

Quando a lógica é **usada por mais de um componente**, vai para as pastas compartilhadas:

| Lógica | Local |
|---|---|
| Exclusiva de um componente | `ComponentName/mapper.ts` etc. |
| Usada em vários contextos | `mappers/`, `formatters/`, `validators/` |

---

## Formatters

Nunca formatar valores inline nos componentes. Sempre usar os formatters:

```typescript
// formatters/moeda.formatter.ts
formatarMoeda(14.00)         // → "R$ 14,00"
formatarValorUnitario(0.028, 'g')  // → "R$ 0,028 /g"
formatarValorUnitario(14.00, 'kg') // → "R$ 14,00 /kg"

// formatters/semana.formatter.ts
formatarSemana(23, 2025)     // → "Semana 23 · Jun 2025"
```

---

## Constants

Espelham os enums do `shared/schemas/enums.ts` em formato utilizável pela UI:

```typescript
// constants/unidades.ts
export const UNIDADES = ['g', 'kg', 'ml', 'L', 'un'] as const

// constants/statusPedido.ts
export const STATUS_PEDIDO = ['pendente', 'produzido', 'pago'] as const

// constants/metodoPagamento.ts
export const METODO_PAGAMENTO = ['pix', 'swile'] as const
```

---

## Deploy

Vercel. Variável obrigatória: `NEXT_PUBLIC_API_URL` apontando para o backend no Render.