# Workflows

Fluxos de desenvolvimento passo a passo. Seguir esta ordem ao criar qualquer funcionalidade nova.

---

## Como criar uma nova entidade do zero

1. **Schema Prisma** (`apps/backend/prisma/schema.prisma`)
   - Adicionar model com `deletedAt DateTime?`
   - Rodar `bunx prisma migrate dev --name add_[entidade]`

2. **Schemas Zod** (`shared/schemas/[entidade]/`)
   - Criar `[entidade]Base.schema.ts`
   - Criar `[entidade]Input.schema.ts` com `.pick()` do Base
   - Criar `[entidade]Response.schema.ts` com `.pick()` + `.extend()` se necessário

3. **Interface do repositório** (`apps/backend/src/interfaces/I[Entidade]Repository.ts`)
   - Definir contrato: `listar`, `buscarPorId`, `criar`, `atualizar`, `softDelete`

4. **Repository** (`apps/backend/src/repositories/[entidade].repository.ts`)
   - Implementar a interface
   - Sempre filtrar `deletedAt: null`
   - Sempre ordenar por padrão (geralmente `nome asc`)

5. **Service** (`apps/backend/src/services/[entidade].service.ts`)
   - Implementar regras de negócio
   - Chamar o repository

6. **Controller** (`apps/backend/src/controllers/[entidade].controller.ts`)
   - Chamar o service
   - Retornar no formato `[entidade]Response`

7. **Route** (`apps/backend/src/routes/[entidade].ts`)
   - Definir endpoints
   - Validar input com schema Zod
   - Registrar no `index.ts`

8. **Service do frontend** (`apps/frontend/src/services/[entidade].service.ts`)
   - Criar hooks `use[Entidade]s` e `useCriar[Entidade]`, etc.
   - Usar TanStack Query

9. **Componentes** (`apps/frontend/src/components/modules/[modulo]/`)
   - Criar componentes de UI
   - Usar mappers/formatters — sem lógica inline

10. **Página** (`apps/frontend/src/app/[rota]/page.tsx`)
    - Compor os componentes
    - Server Component por padrão

---

## Como adicionar um campo novo a uma entidade existente

1. Adicionar o campo no model Prisma
2. Rodar migration: `bunx prisma migrate dev --name add_[campo]_to_[entidade]`
3. Atualizar `[entidade]Base.schema.ts` com o novo campo
4. Verificar se `Input` e `Response` precisam incluir o campo (`.pick()`)
5. Atualizar repository se a query precisar mudar
6. Atualizar service se houver lógica nova
7. Atualizar componentes do frontend se necessário

---

## Como criar uma nova rota no Elysia

```typescript
// apps/backend/src/routes/[entidade].ts
import Elysia from 'elysia'
import { [entidade]Input } from '../../../shared/schemas/[entidade]/[entidade]Input.schema'
import { [entidade]Controller } from '../controllers/[entidade].controller'

export const [entidade]Routes = new Elysia({ prefix: '/[entidade]s' })
  .get('/', () => [entidade]Controller.listar())
  .get('/:id', ({ params }) => [entidade]Controller.buscarPorId(params.id))
  .post('/', ({ body }) => [entidade]Controller.criar([entidade]Input.parse(body)))
  .patch('/:id', ({ params, body }) => [entidade]Controller.atualizar(params.id, body))
  .delete('/:id', ({ params }) => [entidade]Controller.softDelete(params.id))
```

Registrar no `index.ts`:
```typescript
app.use([entidade]Routes)
```

---

## Como criar um componente novo no frontend

1. Definir se é `ui/`, `layout/` ou `modules/[modulo]/`
2. Criar o arquivo do componente
3. Server Component por padrão — só adicionar `"use client"` se precisar de interatividade direta
4. Receber dados via props — não chamar API diretamente
5. Usar `formatters/` para qualquer valor monetário, data ou semana
6. Usar `constants/` para valores fixos de domínio

---

## Como fazer soft delete

```typescript
// NUNCA
await prisma.[entidade].delete({ where: { id } })

// SEMPRE
await prisma.[entidade].update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

---

## Como aplicar uma migration em produção

```bash
# Localmente (dev)
bunx prisma migrate dev --name descricao

# Em produção (Render)
bunx prisma migrate deploy
```

Nunca editar migrations já aplicadas. Sempre criar nova migration para corrigir.

---

## Checklist antes de considerar uma funcionalidade concluída

- [ ] Migration aplicada e testada
- [ ] Schema Zod atualizado em `shared/schemas/`
- [ ] Rota do backend respondendo corretamente
- [ ] Frontend consumindo e exibindo os dados
- [ ] Soft delete funcionando (se aplicável)
- [ ] Nó correspondente no Obsidian atualizado
- [ ] Se alterou regra financeira: nó do Obsidian atualizado **antes** do código