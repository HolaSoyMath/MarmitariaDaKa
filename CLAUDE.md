# Marmitaria da Ká — CLAUDE.md

Sistema de gestão interno para uma marmitaria familiar. Ferramenta da mãe — não é app de restaurante, não tem cliente final, não tem delivery. É o controle semanal de produção, pedidos e financeiro.

---

## Como se localizar neste projeto

**Leia sempre nesta ordem:**

1. Este arquivo — visão geral e estrutura
2. `obsidian/` — contexto de negócio, regras e decisões por módulo
3. `apps/frontend/CLAUDE.md` — se a conversa for sobre o frontend
4. `apps/backend/CLAUDE.md` — se a conversa for sobre o backend
5. `docs/` — detalhes técnicos quando necessário

---

## O que é o sistema

Ciclo semanal:
1. Dona abre a semana via week picker
2. Monta o cardápio (vincula receitas cadastradas)
3. Registra pedidos dos clientes
4. Vai ao mercado e registra as compras
5. Produz as marmitas e marca como produzido (na Home)
6. Recebe o pagamento e marca como pago com Pix ou Swile (na Home)
7. Consulta o financeiro

---

## Estrutura do monorepo

```
marmitaria/
├── CLAUDE.md                    ← você está aqui
├── docs/
│   ├── ARCHITECTURE.md          # padrões técnicos do backend
│   ├── DATABASE.md              # schema Prisma + regras de banco
│   └── FRONTEND.md              # App Router, estado global, componentes
├── obsidian/                    # contexto de negócio por módulo
├── shared/
│   └── schemas/                 # schemas Zod compartilhados (front ↔ back)
│       ├── enums.ts
│       ├── cliente/
│       ├── grupo/
│       ├── ingrediente/
│       ├── receita/
│       ├── cardapio/
│       ├── pedido/
│       ├── tipoPreco/
│       ├── compra/
│       ├── custoGeral/
│       └── financeiro/
└── apps/
    ├── frontend/                # Next.js — ver apps/frontend/CLAUDE.md
    │   └── src/
    │       └── types/           # tipagens internas do frontend
    └── backend/                 # Bun + Elysia — ver apps/backend/CLAUDE.md
        └── src/
            └── types/           # tipagens internas do backend
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS + shadcn/ui |
| Backend | Bun + Elysia |
| ORM | Prisma |
| Banco | PostgreSQL via Neon (serverless) |
| Monorepo | Turborepo |
| Deploy frontend | Vercel |
| Deploy backend | Render (free tier — Uptime Robot pinga a cada 5 min) |
| Documentação | Obsidian + `docs/` |

---

## Padrão de tipos compartilhados (`shared/schemas/`)

Apenas o que trafega entre frontend e backend. Padrão obrigatório:

- `[entidade]Base` — fonte da verdade. **Nunca usado diretamente.**
- `[entidade]Input` — o que o frontend envia. Derivado via `.pick()`
- `[entidade]Response` — o que o backend devolve. Derivado via `.pick()` + `.extend()`
- Tipos sempre via `z.infer<>` — nunca escritos à mão

Tipagens internas de cada lado ficam em `apps/frontend/src/types/` e `apps/backend/src/types/`.

---

## Regras do projeto

1. Toda funcionalidade entregue no backend deve ser validada no frontend antes de ser considerada concluída
2. Toda funcionalidade entregue deve ter seu nó no Obsidian atualizado
3. `CLAUDE.md` é sempre o primeiro arquivo lido — aponta para `docs/` e `obsidian/`
4. `docs/` tem detalhe técnico, `obsidian/` tem contexto de negócio — complementares, nunca substitutos
5. Toda alteração de regra de negócio financeira (preço, snapshot, gás) deve atualizar o nó correspondente no Obsidian antes de qualquer código
6. Soft delete em todas as entidades — nada é deletado fisicamente do banco