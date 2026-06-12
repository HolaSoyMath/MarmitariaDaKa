# Backend — Services Guide

Regras de negócio por serviço. Toda lógica aqui é implementada na camada `services/`.

---

## Pedidos (`pedidos.service.ts`)

### Criar pedido
- Verificar que todos os `cardapioItemId` pertencem à semana do pedido
- Para cada item, buscar `TipoPreco` e copiar valores como snapshot:
  ```typescript
  valorPixSnapshot   = tipoPreco.valorPix
  valorSwileSnapshot = tipoPreco.valorSwile
  ```
- Itens com `quantidade = 0` são ignorados — não geram `PedidoItem`
- O mesmo prato pode ter linhas para tamanhos diferentes (ex: 1× 550G + 1× 400G)

### Transição de status
```
pendente → produzido   ✓  (marcarProduzido)
produzido → pago       ✓  (marcarPago — requer metodoPagamento: 'pix' | 'swile')
produzido → pendente   ✓  (reverterParaPendente)
pago → qualquer        ✗  irreversível — lançar erro
```

### Editar pedido
- Permitido apenas quando `status = 'pendente'`
- `status = 'produzido'` ou `'pago'` → lançar erro

### Excluir pedido (soft delete)
- Permitido apenas quando `status = 'pendente'`
- `status = 'produzido'` ou `'pago'` → lançar erro

---

## Receitas (`receitas.service.ts`)

### Proteção de edição e exclusão
Antes de qualquer alteração na receita, verificar se há pedidos ativos vinculados:

```typescript
const pedidosAtivos = await prisma.pedidoItem.findFirst({
  where: {
    deletedAt: null,
    cardapioItem: { receitaId: id, deletedAt: null },
    pedido: { status: { in: ['pendente', 'produzido'] }, deletedAt: null },
  },
})
if (pedidosAtivos) throw new Error('Receita vinculada a pedidos ativos')
```

### Editar ingredientes
Substituição da lista inteira — delete físico + insert:
```typescript
await prisma.$transaction([
  prisma.receitaIngrediente.deleteMany({ where: { receitaId: id } }),
  prisma.receitaIngrediente.createMany({ data: novosIngredientes }),
])
```

### Última vez no cardápio
Campo calculado no response — busca o `CardapioItem` mais recente:
```typescript
const ultimo = await prisma.cardapioItem.findFirst({
  where: { receitaId: id, deletedAt: null },
  orderBy: { createdAt: 'desc' },
  include: { semana: true },
})
return ultimo ? formatarSemana(ultimo.semana.numeroSemana, ultimo.semana.ano) : null
```

---

## Grupos (`grupos.service.ts`)

### Excluir grupo — soft delete em cascata
Excluir grupo aplica soft delete em todos os clientes associados na mesma transação:

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

---

## Compras (`compras.service.ts`)

### Compra única por semana
Usar upsert para garantir que só existe uma `Compra` por semana:
```typescript
const compra = await prisma.compra.upsert({
  where: { semanaId },
  create: { semanaId },
  update: {},
})
```

### Snapshot de valorUnitario
Ao salvar qualquer `CompraItem`, calcular e persistir:
```typescript
valorUnitario = valorTotal / quantidade
```
Imutável após criação — nunca recalcular.

### Recalcular gás automaticamente
Disparado sempre que um `CompraItem` é criado, editado ou removido (soft delete):

```typescript
const resultado = await prisma.compraItem.aggregate({
  where: { compra: { semanaId }, deletedAt: null },
  _sum: { valorTotal: true },
})

const totalIngredientes = resultado._sum.valorTotal ?? 0

await prisma.custoGeral.upsert({
  where: { semanaId_tipo: { semanaId, tipo: 'percentual_gas' } },
  create: {
    semanaId,
    descricao: 'Gás',
    valor: totalIngredientes * 0.05,
    tipo: 'percentual_gas',
  },
  update: { valor: totalIngredientes * 0.05 },
})
```

---

## Custos Gerais (`custos.service.ts`)

- Custos do tipo `fixo` são criados, editados e excluídos (soft delete) manualmente
- Custo do tipo `percentual_gas` é gerenciado exclusivamente pelo `compras.service.ts`
- Nunca permitir criação manual de custo com `tipo = 'percentual_gas'`

---

## Financeiro (`financeiro.service.ts`)

### Faturamento
Soma dos pedidos com `status = 'pago'` apenas — pedidos produzidos mas não pagos não entram.

```typescript
// por semana
where: { semanaId, status: 'pago', deletedAt: null }

// por mês
where: {
  semana: { ano, numeroSemana: { gte: primeiraSemanaMes, lte: ultimaSemanaMes } },
  status: 'pago',
  deletedAt: null,
}
```

### Custo total da semana
```
custo total = soma(CompraItem.valorTotal) + soma(CustoGeral.valor)
```
O gás já está incluído em `CustoGeral` como `percentual_gas`.

### Métrica "A receber" (usada na Home)
Soma dos pedidos com `status = 'produzido'` (feitos mas não pagos):
```typescript
where: { semanaId, status: 'produzido', deletedAt: null }
```

### "Última vez no cardápio" (Receitas)
Ver `receitas.service.ts` acima.