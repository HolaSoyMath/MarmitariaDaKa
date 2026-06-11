# Frontend — Architecture

Next.js App Router + Tailwind CSS + shadcn/ui.

---

## Estrutura de pastas

```
apps/frontend/src/
├── app/                        # Rotas e páginas (Next.js App Router)
│   ├── layout.tsx
│   ├── page.tsx                # Home
│   ├── pedidos/page.tsx
│   ├── cardapio/page.tsx
│   ├── receitas/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── ingredientes/page.tsx
│   ├── clientes/page.tsx       # Grupos via modal, sem sub-rota
│   ├── precos/page.tsx
│   ├── compras/page.tsx        # Abas: Ingredientes + Custos gerais
│   └── financeiro/page.tsx
│
├── components/
│   ├── ui/                     # Componentes base — shadcn/ui + primitivos customizados
│   │   └── (button, input, modal, dropdown, chip, badge...)
│   ├── layout/                 # Componentes estruturais genéricos
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   └── PageWrapper.tsx
│   └── modules/                # Componentes específicos por módulo
│       ├── pedidos/
│       ├── cardapio/
│       ├── receitas/
│       ├── clientes/
│       ├── compras/
│       └── financeiro/
│
├── hooks/                      # Lógica de estado e side effects
│   ├── useSemanaAtual.ts
│   └── useWeekPicker.ts
│
├── services/                   # Encapsula TanStack Query (queries + mutations)
│   ├── pedidos.service.ts
│   ├── clientes.service.ts
│   └── ...
│
├── mappers/                    # Transforma Response → formato que a UI consome
│   ├── pedido.mapper.ts
│   └── ...
│
├── formatters/                 # Formatação de valores para exibição
│   ├── moeda.formatter.ts      # R$ 14,00 / R$ 0,028
│   ├── semana.formatter.ts     # "Semana 23 · Jun 2025"
│   └── unidade.formatter.ts   # casas decimais por unidade
│
├── validators/                 # Validações de formulário além do Zod
│   └── pedido.validator.ts
│
├── contexts/                   # Estado global do app
│   └── SemanaContext.tsx       # Semana selecionada — persiste entre páginas
│
├── constants/                  # Valores fixos do domínio
│   ├── unidades.ts             # ['g', 'kg', 'ml', 'L', 'un']
│   ├── statusPedido.ts         # ['pendente', 'produzido', 'pago']
│   └── metodoPagamento.ts      # ['pix', 'swile']
│
├── types/                      # Tipagens internas do frontend
│   └── (props de componente, estado de UI, form state)
│
└── lib/
    ├── api.ts                  # Cliente Eden Treaty
    ├── queryClient.ts          # Configuração TanStack Query
    └── utils.ts
```

---

## Camadas e responsabilidades

### `app/` — Páginas
- Server Components por padrão
- Responsáveis por buscar dados (via TanStack Query em Server Components ou passando para client)
- Não contêm lógica de negócio nem formatação
- Compõem os componentes de `modules/`

### `components/ui/` — Primitivos
- Componentes base do shadcn/ui
- Sem lógica de negócio
- Reutilizáveis em qualquer contexto

### `components/layout/` — Estrutura
- Navbar, sidebar, header, footer, wrappers de página
- Sem lógica de domínio

### `components/modules/` — Funcionalidades
- Componentes específicos de cada módulo
- Podem ser Client Components quando necessário
- Recebem dados via props — não chamam a API diretamente

### `hooks/` — Estado e efeitos
- Lógica de estado local e global
- Encapsulam comportamentos reutilizáveis
- Não fazem chamadas à API diretamente (isso é responsabilidade dos `services/`)

### `services/` — Chamadas à API
- Encapsulam `useQuery` e `useMutation` do TanStack Query
- Retornam dados já tipados via `z.infer<>`
- Único lugar onde `api.ts` é chamado

### `mappers/` — Transformação de dados
- Convertem `[entidade]Response` para o formato que a UI precisa
- Exemplo: agrupar `PedidoItem` por prato para exibir na Home

### `formatters/` — Formatação de exibição
- Convertem valores brutos em strings formatadas
- `moeda.formatter.ts`: aplica as regras de casas decimais por unidade
- `semana.formatter.ts`: "Semana 23 · Jun 2025"
- Nunca alteram o dado — só formatam para exibição

### `validators/` — Validação de formulário
- Validações que vão além do schema Zod compartilhado
- Exemplo: validações cruzadas entre campos de um formulário

### `contexts/` — Estado global
- `SemanaContext` — semana selecionada persiste ao navegar entre páginas
- Outros contextos globais conforme necessário

### `constants/` — Valores fixos
- Espelham os enums do `shared/schemas/enums.ts` em formato utilizável pela UI
- Usados em chips, dropdowns, validações

---

## Regra — Client Components como folhas

**Server Components** por padrão em tudo. `"use client"` apenas nos componentes de interação na ponta da árvore:

```
page.tsx (Server)
  └── PedidosLista (Server)
        └── PedidoLinha (Server)
              └── StatusBadge (Server)
              └── CheckboxProduzido (Client) ← "use client" aqui
```

Nunca colocar `"use client"` em um componente pai se apenas um filho precisa de interatividade. Isolar o filho.

---

## Estado global — Semana

A semana selecionada é compartilhada entre todas as páginas via `SemanaContext`:

```typescript
// contexts/SemanaContext.tsx
const SemanaContext = createContext<{
  semanaId: string
  numeroSemana: number
  ano: number
  setSemana: (semana: SemanaResponse) => void
}>()
```

- Week picker no header lê e escreve neste context
- Todas as queries que dependem de semana leem do context
- Ao selecionar semana inexistente no banco → chamada automática para criar

---

## Padrão de chamada à API

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

---

## Deploy

Vercel. Variável obrigatória: `NEXT_PUBLIC_API_URL` apontando para o Render.