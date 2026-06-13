# Backend — CLAUDE.md

Bun + Elysia. Leia o `CLAUDE.md` da raiz antes deste.

---

## Estrutura de pastas

```
apps/backend/src/
├── index.ts                     # Entry point — instância Elysia + rotas
├── routes/
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
├── services/
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
├── repositories/
│   └── (um por entidade)
├── types/                       # Tipagens internas do backend
└── lib/
    └── prisma.ts                # Instância singleton do PrismaClient
```

---

## Padrão de camadas

```
Route (Elysia)
  └── Service (regras de negócio)
        └── Repository (queries Prisma)
```

- **Route** — valida input com schema Zod do `shared/schemas/`, chama o service
- **Service** — aplica regras de negócio, chama o repository
- **Repository** — queries Prisma, sempre filtra `deletedAt: null`

---

## Validação de input

Sempre usar os schemas do `shared/schemas/` nas rotas:

```typescript
import { pedidoInput } from '../../../shared/schemas/pedido/pedidoInput.schema'

app.post('/pedidos', ({ body }) => {
  const data = pedidoInput.parse(body)
  return pedidosService.criar(data)
})
```

---

## Soft delete — regra obrigatória

Todas as entidades têm `deletedAt: DateTime?`. **Nunca usar `delete()` do Prisma.**

```typescript
// ERRADO
await prisma.cliente.delete({ where: { id } })

// CORRETO
await prisma.cliente.update({
  where: { id },
  data: { deletedAt: new Date() }
})
```

Toda query de listagem ou busca deve filtrar:

```typescript
where: { deletedAt: null }
```

---

## Transações — regra obrigatória

Toda operação que envolva **mais de uma escrita no banco** deve usar `prisma.$transaction`. Sem exceção.

```typescript
// ERRADO — sem atomicidade
await prisma.cliente.updateMany({ where: { grupoId: id }, data: { deletedAt: new Date() } })
await prisma.grupo.update({ where: { id }, data: { deletedAt: new Date() } })

// CORRETO
await prisma.$transaction([
  prisma.cliente.updateMany({ where: { grupoId: id }, data: { deletedAt: new Date() } }),
  prisma.grupo.update({ where: { id }, data: { deletedAt: new Date() } }),
])
```

Aplica-se a: cascade soft delete, criação de Pedido + itens, edição de Receita + substituição de ingredientes, qualquer service que execute múltiplas escritas na mesma operação.

---

## Regras de negócio críticas

**Snapshot de preço:** ao criar `PedidoItem`, copiar `valorPix` e `valorSwile` do `TipoPreco` para `valorPixSnapshot` e `valorSwileSnapshot`. Nunca recalcular depois.

**Gás:** ao salvar qualquer alteração em `CompraItem` da semana, recalcular o `CustoGeral` de tipo `percentual_gas` como 5% da soma dos `valorTotal` dos `CompraItem` ativos daquela semana.

**Snapshot de valorUnitario:** ao salvar `CompraItem`, calcular `valorUnitario = valorTotal / quantidade` e persistir. Nunca recalcular depois.

**Status de pedido:** a transição é sempre `pendente → produzido → pago`. Pago é irreversível. Produzido pode voltar para pendente.

**Proteção de receita:** antes de editar ou excluir uma `Receita`, verificar se existe `PedidoItem → CardapioItem → Receita` com pedido de status `pendente` ou `produzido`. Se existir, rejeitar com erro.

**Compra única por semana:** cada `Semana` tem no máximo uma `Compra` (`@unique` no `semanaId`). A dona edita a lista de itens da compra existente.

---

## Eden Treaty — exposição de tipos

O `index.ts` deve exportar o tipo `App` para o frontend consumir via Eden Treaty:

```typescript
// index.ts
const app = new Elysia()
  .use(clientesRoutes)
  // ...demais rotas

export type App = typeof app
export default app
```

---

## Deploy

Render (free tier). Uptime Robot faz ping a cada 5 minutos para evitar sleep.
Variável de ambiente obrigatória: `DATABASE_URL` apontando para o Neon.