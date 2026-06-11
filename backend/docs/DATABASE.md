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

// ─── GRUPOS E CLIENTES ───────────────────────────────────────

model Grupo {
  id        String    @id @default(cuid())
  nome      String    @unique
  clientes  Cliente[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}

model Cliente {
  id        String    @id @default(cuid())
  nome      String
  grupoId   String
  grupo     Grupo     @relation(fields: [grupoId], references: [id])
  pedidos   Pedido[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}

// ─── INGREDIENTES E RECEITAS ─────────────────────────────────

model Ingrediente {
  id          String               @id @default(cuid())
  nome        String               @unique
  unidade     String               // 'g' | 'kg' | 'ml' | 'L' | 'un'
  receitas    ReceitaIngrediente[]
  compraItens CompraItem[]
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt
  deletedAt   DateTime?
}

model Receita {
  id           String               @id @default(cuid())
  nome         String               @unique
  ingredientes ReceitaIngrediente[]
  cardapio     CardapioItem[]
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt
  deletedAt    DateTime?
}

model ReceitaIngrediente {
  // DELETE FÍSICO — sem deletedAt
  // Ao editar receita: substituir lista inteira (delete + insert)
  // Seguro pois pedidos não referenciam ReceitaIngrediente diretamente
  id            String      @id @default(cuid())
  receitaId     String
  ingredienteId String
  quantidade    Float
  receita       Receita     @relation(fields: [receitaId], references: [id], onDelete: Cascade)
  ingrediente   Ingrediente @relation(fields: [ingredienteId], references: [id])

  @@unique([receitaId, ingredienteId])
}

// ─── TIPOS E PREÇOS ───────────────────────────────────────────

model TipoPreco {
  id          String       @id @default(cuid())
  tipo        String       // 'Marmita', 'Caldo', etc.
  tamanho     String       // '400G', '550G', '400ml', etc.
  valorPix    Float
  valorSwile  Float
  pedidoItens PedidoItem[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  deletedAt   DateTime?    // soft delete — preserva referências de pedidos antigos

  @@unique([tipo, tamanho])
}

// ─── SEMANA E CARDÁPIO ────────────────────────────────────────

model Semana {
  id           String         @id @default(cuid())
  numeroSemana Int
  ano          Int
  cardapio     CardapioItem[]
  pedidos      Pedido[]
  compra       Compra?
  custosGerais CustoGeral[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  deletedAt    DateTime?

  @@unique([numeroSemana, ano])
}

model CardapioItem {
  id        String       @id @default(cuid())
  semanaId  String
  receitaId String
  semana    Semana       @relation(fields: [semanaId], references: [id])
  receita   Receita      @relation(fields: [receitaId], references: [id])
  pedidos   PedidoItem[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  deletedAt DateTime?

  @@unique([semanaId, receitaId]) // receita aparece no máximo 1x por semana
}

// ─── PEDIDOS ─────────────────────────────────────────────────

model Pedido {
  id              String       @id @default(cuid())
  semanaId        String
  clienteId       String
  status          String       @default("pendente") // 'pendente' | 'produzido' | 'pago'
  metodoPagamento String?      // 'pix' | 'swile' — preenchido ao marcar pago
  semana          Semana       @relation(fields: [semanaId], references: [id])
  cliente         Cliente      @relation(fields: [clienteId], references: [id])
  itens           PedidoItem[]
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?
}

model PedidoItem {
  id                 String       @id @default(cuid())
  pedidoId           String
  cardapioItemId     String
  tipoPrecoId        String
  quantidade         Int          @default(1)
  valorPixSnapshot   Float        // snapshot imutável — copiado de TipoPreco.valorPix
  valorSwileSnapshot Float        // snapshot imutável — copiado de TipoPreco.valorSwile
  pedido             Pedido       @relation(fields: [pedidoId], references: [id], onDelete: Cascade)
  cardapioItem       CardapioItem @relation(fields: [cardapioItemId], references: [id])
  tipoPreco          TipoPreco    @relation(fields: [tipoPrecoId], references: [id])
  deletedAt          DateTime?
}

// ─── COMPRAS ─────────────────────────────────────────────────

model Compra {
  id        String       @id @default(cuid())
  semanaId  String       @unique // uma compra por semana
  semana    Semana       @relation(fields: [semanaId], references: [id])
  itens     CompraItem[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  deletedAt DateTime?
}

model CompraItem {
  id            String      @id @default(cuid())
  compraId      String
  ingredienteId String
  quantidade    Float
  valorTotal    Float       // snapshot — valor pago total
  valorUnitario Float       // snapshot — calculado: valorTotal / quantidade
  local         String?     // opcional — nome do mercado (ex: "Atacadão", "Feira")
  compra        Compra      @relation(fields: [compraId], references: [id], onDelete: Cascade)
  ingrediente   Ingrediente @relation(fields: [ingredienteId], references: [id])
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?
}

// ─── CUSTOS GERAIS ────────────────────────────────────────────

model CustoGeral {
  id        String    @id @default(cuid())
  semanaId  String
  descricao String
  valor     Float
  tipo      String    @default("fixo") // 'fixo' | 'percentual_gas'
  semana    Semana    @relation(fields: [semanaId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}
```

---

## Regras de banco

### Soft delete — regra absoluta
Toda entidade tem `deletedAt DateTime?`. Nada é deletado fisicamente — exceto `ReceitaIngrediente` (ver abaixo).

Toda query deve filtrar registros ativos:
```typescript
where: { deletedAt: null }
```

### ReceitaIngrediente — única exceção ao soft delete
Usa delete físico com substituição da lista inteira ao editar uma receita:
```typescript
await prisma.$transaction([
  prisma.receitaIngrediente.deleteMany({ where: { receitaId: id } }),
  prisma.receitaIngrediente.createMany({ data: novosIngredientes }),
])
```
Seguro porque pedidos não referenciam `ReceitaIngrediente` diretamente.

### Soft delete em cascata — Grupo
Ao excluir grupo, excluir todos os clientes associados na mesma transação:
```typescript
await prisma.$transaction([
  prisma.cliente.updateMany({
    where: { grupoId: id, deletedAt: null },
    data: { deletedAt: new Date() },
  }),
  prisma.grupo.update({
    where: { id },
    data: { deletedAt: new Date() },
  }),
])
```

### Snapshots — campos imutáveis
Campos snapshot são calculados e persistidos na criação. **Nunca recalcular após persistir.**

| Entidade | Campo snapshot | Origem |
|---|---|---|
| `PedidoItem` | `valorPixSnapshot` | `TipoPreco.valorPix` no momento do pedido |
| `PedidoItem` | `valorSwileSnapshot` | `TipoPreco.valorSwile` no momento do pedido |
| `CompraItem` | `valorUnitario` | `valorTotal / quantidade` no momento do registro |

### Gás automático
`CustoGeral` com `tipo = 'percentual_gas'` é gerenciado automaticamente pelo backend.

Recalculado via upsert toda vez que um `CompraItem` da semana é criado, editado ou removido:
```typescript
const totalIngredientes = await prisma.compraItem.aggregate({
  where: { compra: { semanaId }, deletedAt: null },
  _sum: { valorTotal: true },
})

await prisma.custoGeral.upsert({
  where: { semanaId_tipo: { semanaId, tipo: 'percentual_gas' } },
  create: { semanaId, descricao: 'Gás', valor: totalIngredientes._sum.valorTotal * 0.05, tipo: 'percentual_gas' },
  update: { valor: totalIngredientes._sum.valorTotal * 0.05 },
})
```

### Compra única por semana
`Compra` tem `@unique` no `semanaId`. Usar `upsert` para garantir:
```typescript
await prisma.compra.upsert({
  where: { semanaId },
  create: { semanaId },
  update: {},
})
```

---

## Ordenação padrão

| Entidade | Ordenação padrão |
|---|---|
| Cliente, Ingrediente, Receita, Grupo, TipoPreco | `nome asc` |
| Pedido | `createdAt desc` |
| CompraItem, CustoGeral | `createdAt desc` |

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