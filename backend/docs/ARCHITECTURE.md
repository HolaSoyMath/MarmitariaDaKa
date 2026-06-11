# Backend — Architecture

Bun + Elysia + Prisma + PostgreSQL (Neon).

---

## Estrutura de pastas

```
apps/backend/src/
├── index.ts                    # Entry point — instância Elysia + registro de rotas
│
├── routes/                     # Entrada HTTP — valida input, chama controller
│   ├── clientes.ts
│   ├── grupos.ts
│   ├── ingredientes.ts
│   ├── receitas.ts
│   ├── cardapio.ts
│   ├── pedidos.ts
│   ├── precos.ts
│   ├── compras.ts
│   ├── custos.ts
│   └── financeiro.ts
│
├── controllers/                # Orquestra — recebe input validado, chama service
│   ├── clientes.controller.ts
│   ├── grupos.controller.ts
│   ├── ingredientes.controller.ts
│   ├── receitas.controller.ts
│   ├── cardapio.controller.ts
│   ├── pedidos.controller.ts
│   ├── precos.controller.ts
│   ├── compras.controller.ts
│   ├── custos.controller.ts
│   └── financeiro.controller.ts
│
├── services/                   # Regras de negócio — chama repository
│   ├── clientes.service.ts
│   ├── grupos.service.ts
│   ├── ingredientes.service.ts
│   ├── receitas.service.ts
│   ├── cardapio.service.ts
│   ├── pedidos.service.ts
│   ├── precos.service.ts
│   ├── compras.service.ts
│   ├── custos.service.ts
│   └── financeiro.service.ts
│
├── repositories/               # Queries Prisma — sempre filtra deletedAt: null
│   ├── clientes.repository.ts
│   ├── grupos.repository.ts
│   ├── ingredientes.repository.ts
│   ├── receitas.repository.ts
│   ├── cardapio.repository.ts
│   ├── pedidos.repository.ts
│   ├── precos.repository.ts
│   ├── compras.repository.ts
│   ├── custos.repository.ts
│   └── financeiro.repository.ts
│
├── interfaces/                 # Contratos entre camadas
│   ├── IClientesRepository.ts
│   ├── IPedidosRepository.ts
│   └── ...
│
├── types/                      # Tipagens internas do backend
│
└── lib/
    ├── prisma.ts               # Instância singleton PrismaClient
    └── constants.ts            # Valores fixos do domínio
```

---

## Camadas e responsabilidades

### `routes/` — Entrada HTTP
- Define o endpoint (método + path)
- Valida o input usando schema Zod do `shared/schemas/`
- Chama o controller correspondente
- Não contém lógica de negócio

```typescript
// routes/pedidos.ts
app.post('/pedidos',
  ({ body }) => pedidosController.criar(pedidoInput.parse(body))
)

app.patch('/pedidos/:id/produzido',
  ({ params }) => pedidosController.marcarProduzido(params.id)
)
```

### `controllers/` — Orquestração
- Recebe input já validado da rota
- Orquestra chamadas ao service
- Formata a resposta no formato `[entidade]Response`
- Não contém regras de negócio nem queries

```typescript
// controllers/pedidos.controller.ts
export const pedidosController = {
  async criar(data: PedidoInput): Promise<PedidoResponse> {
    const pedido = await pedidosService.criar(data)
    return pedidoResponseSchema.parse(pedido)
  }
}
```

### `services/` — Regras de negócio
- Aplica todas as regras de negócio
- Chama um ou mais repositories
- Lança erros de domínio quando regras são violadas

```typescript
// services/pedidos.service.ts
export const pedidosService = {
  async criar(data: PedidoInput) {
    // valida que cardapioItems pertencem à semana correta
    // busca valorPix e valorSwile do TipoPreco para snapshot
    // cria o pedido com os snapshots
  },
  async marcarProduzido(id: string) {
    const pedido = await pedidosRepository.buscarPorId(id)
    if (pedido.status !== 'pendente') throw new Error('Apenas pedidos pendentes podem ser marcados como produzidos')
    return pedidosRepository.atualizarStatus(id, 'produzido')
  }
}
```

### `repositories/` — Queries Prisma
- Única camada que toca o Prisma
- Sempre filtra `deletedAt: null`
- Implementa as interfaces de `interfaces/`
- Nunca contém regras de negócio

```typescript
// repositories/clientes.repository.ts
export const clientesRepository: IClientesRepository = {
  async listar() {
    return prisma.cliente.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      include: { grupo: true },
    })
  },
  async softDelete(id: string) {
    return prisma.cliente.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
```

### `interfaces/` — Contratos
- Definem o que o Service espera do Repository
- Desacoplam a lógica de negócio do Prisma
- Facilitam testes com mocks

```typescript
// interfaces/IClientesRepository.ts
export interface IClientesRepository {
  listar(): Promise<Cliente[]>
  buscarPorId(id: string): Promise<Cliente | null>
  criar(data: ClienteInput): Promise<Cliente>
  atualizar(id: string, data: Partial<ClienteInput>): Promise<Cliente>
  softDelete(id: string): Promise<Cliente>
}
```

---

## Soft delete — regra absoluta

**Nunca usar `prisma.[entidade].delete()`.**

```typescript
// ERRADO — jamais fazer isso
await prisma.cliente.delete({ where: { id } })

// CORRETO — sempre
await prisma.cliente.update({
  where: { id },
  data: { deletedAt: new Date() }
})
```

Toda query de listagem ou busca deve incluir:
```typescript
where: { deletedAt: null }
```

---

> Regras de negócio por serviço documentadas em `SERVICES.md`.

## Eden Treaty — exportação de tipos

```typescript
// index.ts
const app = new Elysia()
  .use(clientesRoutes)
  .use(pedidosRoutes)
  // ...demais rotas

export type App = typeof app
export default app
```

O frontend importa `App` para tipagem end-to-end via Eden Treaty.

---

## Deploy

Render (free tier). Uptime Robot faz ping a cada 5 minutos.
Variável obrigatória: `DATABASE_URL` apontando para o Neon PostgreSQL.