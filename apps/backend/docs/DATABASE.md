# Database

PostgreSQL via Neon (serverless). ORM: Prisma.

---

## Schema Prisma

```prisma
// apps/backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Group {
  id        String    @id @default(cuid())
  nome      String    @unique
  clients   Client[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}

model Client {
  id        String   @id @default(cuid())
  nome      String
  grupoId   String
  group     Group    @relation(fields: [grupoId], references: [id])
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}

model Ingredient {
  id            String             @id @default(cuid())
  nome          String             @unique
  unidade       String
  recipes       RecipeIngredient[]
  purchaseItems PurchaseItem[]
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  deletedAt     DateTime?
}

model Recipe {
  id          String             @id @default(cuid())
  nome        String             @unique
  ingredients RecipeIngredient[]
  menuItems   MenuItem[]
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
  deletedAt   DateTime?
}

model RecipeIngredient {
  // DELETE FÍSICO — sem deletedAt
  // Ao editar receita: substituir lista inteira (delete + insert)
  // Seguro pois pedidos não referenciam RecipeIngredient diretamente
  id            String     @id @default(cuid())
  receitaId     String
  ingredienteId String
  quantidade    Float
  recipe        Recipe     @relation(fields: [receitaId], references: [id], onDelete: Cascade)
  ingredient    Ingredient @relation(fields: [ingredienteId], references: [id])

  @@unique([receitaId, ingredienteId])
}

model PriceType {
  id         String      @id @default(cuid())
  tipo       String      // 'Marmita', 'Caldo', etc.
  tamanho    String      // '400G', '550G', '400ml', etc.
  valorPix   Float
  valorSwile Float
  orderItems OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  deletedAt  DateTime?   // soft delete — preserva referências de pedidos antigos

  @@unique([tipo, tamanho])
}

model Week {
  id           String        @id @default(cuid())
  numeroSemana Int
  ano          Int
  menuItems    MenuItem[]
  orders       Order[]
  purchase     Purchase?
  generalCosts GeneralCost[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  deletedAt    DateTime?

  @@unique([numeroSemana, ano])
}

model MenuItem {
  id         String      @id @default(cuid())
  semanaId   String
  receitaId  String
  week       Week        @relation(fields: [semanaId], references: [id])
  recipe     Recipe      @relation(fields: [receitaId], references: [id])
  orderItems OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  deletedAt  DateTime?

  @@unique([semanaId, receitaId]) // receita aparece no máximo 1x por semana
}

model Order {
  id              String      @id @default(cuid())
  semanaId        String
  clienteId       String
  status          String      @default("pendente") // 'pendente' | 'produzido' | 'pago'
  metodoPagamento String?     // 'Pix' | 'Swile' — preenchido ao marcar pago
  week            Week        @relation(fields: [semanaId], references: [id])
  client          Client      @relation(fields: [clienteId], references: [id])
  items           OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  deletedAt       DateTime?
}

model OrderItem {
  id                 String    @id @default(cuid())
  pedidoId           String
  cardapioItemId     String
  tipoPrecoId        String
  quantidade         Int       @default(1)
  snapshotValorPix   Float     // snapshot imutável — copiado de PriceType.valorPix
  snapshotValorSwile Float     // snapshot imutável — copiado de PriceType.valorSwile
  order              Order     @relation(fields: [pedidoId], references: [id], onDelete: Cascade)
  menuItem           MenuItem  @relation(fields: [cardapioItemId], references: [id])
  priceType          PriceType @relation(fields: [tipoPrecoId], references: [id])
  deletedAt          DateTime?
}

model Purchase {
  id        String         @id @default(cuid())
  semanaId  String         @unique // uma compra por semana
  week      Week           @relation(fields: [semanaId], references: [id])
  items     PurchaseItem[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  deletedAt DateTime?
}

model PurchaseItem {
  id            String     @id @default(cuid())
  compraId      String
  ingredienteId String
  quantidade    Float
  valorTotal    Float      // snapshot — valor pago total
  valorUnitario Float      // snapshot — calculado: valorTotal / quantidade
  local         String?    // opcional — nome do mercado (ex: "Atacadão", "Feira")
  purchase      Purchase   @relation(fields: [compraId], references: [id], onDelete: Cascade)
  ingredient    Ingredient @relation(fields: [ingredienteId], references: [id])
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  deletedAt     DateTime?
}

model GeneralCost {
  id        String    @id @default(cuid())
  semanaId  String
  descricao String
  valor     Float
  tipo      String    @default("fixo") // 'fixo' | 'percentual_gas'
  week      Week      @relation(fields: [semanaId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}
```

---

## Regras de banco

### Transações — regra obrigatória

Toda operação com mais de uma escrita usa `prisma.$transaction`. Os exemplos de cascade e RecipeIngredient neste arquivo são aplicações dessa regra.

### Soft delete — regra absoluta
Toda entidade tem `deletedAt DateTime?`. Nada é deletado fisicamente — exceto `RecipeIngredient` (ver abaixo).

Toda query deve filtrar registros ativos:
```typescript
where: { deletedAt: null }
```

### RecipeIngredient — única exceção ao soft delete
Usa delete físico com substituição da lista inteira ao editar uma receita:
```typescript
await prisma.$transaction([
  prisma.recipeIngredient.deleteMany({ where: { receitaId: id } }),
  prisma.recipeIngredient.createMany({ data: novosIngredientes }),
])
```
Seguro porque orders não referenciam `RecipeIngredient` diretamente.

### Soft delete em cascata — Group
Ao excluir group, excluir todos os clients associados na mesma transação:
```typescript
await prisma.$transaction([
  prisma.client.updateMany({
    where: { grupoId: id, deletedAt: null },
    data: { deletedAt: new Date() },
  }),
  prisma.group.update({
    where: { id },
    data: { deletedAt: new Date() },
  }),
])
```

### Snapshots — campos imutáveis
Campos snapshot são calculados e persistidos na criação. **Nunca recalcular após persistir.**

| Entidade | Campo snapshot | Origem |
|---|---|---|
| `OrderItem` | `snapshotValorPix` | `PriceType.valorPix` no momento do pedido |
| `OrderItem` | `snapshotValorSwile` | `PriceType.valorSwile` no momento do pedido |
| `PurchaseItem` | `valorUnitario` | `valorTotal / quantidade` no momento do registro |

### Gás automático
`GeneralCost` com `tipo = 'percentual_gas'` é gerenciado automaticamente pelo backend.

Recalculado via upsert toda vez que um `PurchaseItem` da semana é criado, editado ou removido:
```typescript
const totalIngredientes = await prisma.purchaseItem.aggregate({
  where: { purchase: { semanaId }, deletedAt: null },
  _sum: { valorTotal: true },
})

await prisma.generalCost.upsert({
  where: { semanaId_tipo: { semanaId, tipo: 'percentual_gas' } },
  create: { semanaId, descricao: 'Gás', valor: totalIngredientes._sum.valorTotal * 0.05, tipo: 'percentual_gas' },
  update: { valor: totalIngredientes._sum.valorTotal * 0.05 },
})
```

### Purchase única por semana
`Purchase` tem `@unique` no `semanaId`. Usar `upsert` para garantir:
```typescript
await prisma.purchase.upsert({
  where: { semanaId },
  create: { semanaId },
  update: {},
})
```

---

## Ordenação padrão

| Entidade | Ordenação padrão |
|---|---|
| Client, Ingredient, Recipe, Group, PriceType | `nome asc` |
| Order | `createdAt desc` |
| PurchaseItem, GeneralCost | `createdAt desc` |

---

## Migrations

```bash
# Criar migration após alterar o schema
bunx prisma migrate dev --name descricao_da_mudanca

# Aplicar migrations em produção
bunx prisma migrate deploy

# Visualizar banco
bunx prisma studio
```

Nunca editar migrations já aplicadas em produção. Sempre criar nova migration para corrigir.
