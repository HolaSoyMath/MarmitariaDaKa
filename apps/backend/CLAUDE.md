# Backend — CLAUDE.md

Bun + Elysia. Leia o `CLAUDE.md` da raiz antes deste.

---

## Estrutura de pastas

```
apps/backend/src/
├── index.ts                     # Entry point — instância Elysia + rotas
├── routes/
│   ├── clients.ts
│   ├── groups.ts
│   ├── ingredients.ts
│   ├── recipes.ts
│   ├── menuItems.ts
│   ├── weeks.ts
│   ├── priceTypes.ts
│   ├── orders.ts
│   ├── purchases.ts
│   ├── generalCosts.ts
│   └── financial.ts
├── services/
│   ├── clients.service.ts
│   ├── groups.service.ts
│   ├── ingredients.service.ts
│   ├── recipes.service.ts
│   ├── menuItems.service.ts
│   ├── weeks.service.ts
│   ├── priceTypes.service.ts
│   ├── orders.service.ts
│   ├── purchases.service.ts
│   ├── generalCosts.service.ts
│   └── financial.service.ts
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
import { orderInput } from '@marmitaria/schemas/order/orderInput.schema'

app.post('/orders', ({ body }) => {
  const data = orderInput.parse(body)
  return ordersService.create(data)
})
```

---

## Soft delete — regra obrigatória

Todas as entidades têm `deletedAt: DateTime?`. **Nunca usar `delete()` do Prisma.**

```typescript
// ERRADO
await prisma.client.delete({ where: { id } })

// CORRETO
await prisma.client.update({
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
await prisma.client.updateMany({ where: { groupId: id }, data: { deletedAt: new Date() } })
await prisma.group.update({ where: { id }, data: { deletedAt: new Date() } })

// CORRETO
await prisma.$transaction([
  prisma.client.updateMany({ where: { groupId: id }, data: { deletedAt: new Date() } }),
  prisma.group.update({ where: { id }, data: { deletedAt: new Date() } }),
])
```

Aplica-se a: cascade soft delete, criação de Pedido + itens, edição de Receita + substituição de ingredientes, qualquer service que execute múltiplas escritas na mesma operação.

---

## Regras de negócio críticas

**Snapshot de preço:** ao criar `OrderItem`, copiar `pixPrice` e `swilePrice` do `PriceType` para `snapshotPixPrice` e `snapshotSwilePrice`. Nunca recalcular depois.

**Gás:** ao salvar qualquer alteração em `PurchaseItem` da semana, recalcular o `GeneralCost` de tipo `gas_percentage` como 5% da soma dos `totalValue` dos `PurchaseItem` ativos daquela semana.

**Snapshot de unitValue:** ao salvar `PurchaseItem`, calcular `unitValue = totalValue / quantity` e persistir. Nunca recalcular depois.

**Status de pedido:** a transição é sempre `pending → produced → paid`. `paid` é irreversível. `produced` pode voltar para `pending`.

**Proteção de receita:** antes de editar ou excluir uma `Recipe`, verificar se existe `OrderItem → MenuItem → Recipe` com order de status `pending` ou `produced`. Se existir, rejeitar com erro.

**Purchase única por semana:** cada `Week` tem no máximo uma `Purchase` (`@unique` no `weekId`). A dona edita a lista de itens da purchase existente.

---

## Eden Treaty — exposição de tipos

O `index.ts` deve exportar o tipo `App` para o frontend consumir via Eden Treaty:

```typescript
// index.ts
const app = new Elysia()
  .use(clientsRoutes)
  // ...demais rotas

export type App = typeof app
export default app
```

---

## Convenção de idioma

**Todo o código deve estar em inglês:** nomes de arquivos, pastas, classes, funções, variáveis, propriedades, rotas de API e tipos. Português é reservado para texto exibido ao usuário e para comentários/documentação.

---

## Deploy

Render (free tier). Uptime Robot faz ping a cada 5 minutos para evitar sleep.
Variável de ambiente obrigatória: `DATABASE_URL` apontando para o Neon.