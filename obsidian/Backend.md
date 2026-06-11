# Backend

## O que é

Servidor da aplicação. Responsável por todas as regras de negócio, acesso ao banco de dados e exposição da API consumida pelo frontend.

---

## Stack

- **Runtime:** Bun
- **Framework:** Elysia
- **ORM:** Prisma
- **Banco:** PostgreSQL via Neon (serverless)
- **Deploy:** Render (free tier — mantido ativo via Uptime Robot)

---

## Onde fica

`apps/backend/`

---

## Documentação técnica

- `apps/backend/docs/ARCHITECTURE.md` — camadas, padrões de código, soft delete, Eden Treaty
- `apps/backend/docs/DATABASE.md` — schema Prisma, migrations, snapshots
- `apps/backend/docs/SERVICES.md` — regras de negócio por serviço

---

## Módulos que têm regras no backend

- [[Pedidos]] — status, snapshot de preço, proteção de edição
- [[Receitas]] — proteção de edição com pedidos ativos
- [[Compras]] — compra única por semana, snapshot de valor unitário, gás automático
- [[CustosGerais]] — gás calculado e gerenciado automaticamente
- [[Grupos]] — soft delete em cascata com clientes
- [[Financeiro]] — cálculo de faturamento, custo e lucro