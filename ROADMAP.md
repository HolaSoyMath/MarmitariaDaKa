# Roadmap

Mapa de progresso do desenvolvimento. Para instruções de como implementar cada item, consultar `docs/WORKFLOWS.md`, `apps/backend/docs/SERVICES.md` e os nós do `obsidian/`.

---

## Fase 1 — Setup do Monorepo

- [x] Inicializar repositório no GitHub
- [x] `bun init` na raiz
- [x] Configurar `turbo.json`
- [x] Configurar workspaces no `package.json` da raiz
- [x] Criar estrutura de pastas: `apps/frontend`, `apps/backend`, `shared/schemas`
- [x] Copiar docs, obsidian, CLAUDE.md e skills para o projeto
- [x] Commit inicial

---

## Fase 2 — Shared (Schemas Zod)

- [x] Configurar `shared/` como workspace
- [x] Criar `enums.ts`

**Cadastros base:**
- [x] Grupo — Base, Input, Response
- [x] Cliente — Base, Input, Response
- [x] Ingrediente — Base, Input, Response
- [x] Receita — Base, Input, Response

**Operação:**
- [x] TipoPreco — Base, Input, Response
- [x] Semana — Base, Input, Response
- [x] Cardápio — Base, Input, Response
- [x] Pedido — Base, Input, MarcarPagoInput, Response
- [x] Compra — Base, Input, Response
- [x] CustoGeral — Base, Input, Response
- [x] Financeiro — PeriodoFinanceiro, RelatorioFinanceiroResponse

---

## Fase 3 — Backend

**Setup:**
- [x] Inicializar projeto Bun + Elysia em `apps/backend`
- [x] Configurar Prisma + conexão Neon
- [x] Rodar migration inicial com o schema completo
- [x] Configurar `lib/prisma.ts` singleton
- [x] Exportar tipo `App` para Eden Treaty

**Cadastros base:**
- [x] Grupos — interface, repository, service, controller, route
- [x] Clientes — interface, repository, service, controller, route
- [x] Ingredientes — interface, repository, service, controller, route
- [x] Receitas — interface, repository, service, controller, route
  - [x] Proteção de edição com pedidos ativos
  - [x] Delete físico de ingredientes (substituição da lista)
  - [x] Campo `ultimaVezNoCardapio` no response

**Operação semanal:**
- [x] Semana — criação automática via week picker, route
- [x] TiposPrecos — CRUD completo, route
- [x] Cardápio — adicionar/remover prato, validação de receita vinculada, route
- [ ] Pedidos — CRUD, transições de status, snapshot de preço, route
  - [ ] `marcarProduzido`
  - [ ] `marcarPago` (com método Pix/Swile)
  - [ ] `reverterParaPendente`
- [ ] Compras — upsert por semana, snapshot valorUnitario, gás automático, route
- [ ] CustosGerais — CRUD manual, proteção do gás, route
- [ ] Financeiro — cálculo por semana/mês/período, métrica "a receber", route

---

## Fase 4 — Frontend

**Setup:**
- [ ] Inicializar Next.js em `apps/frontend`
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Configurar Eden Treaty em `lib/api.ts`
- [ ] Configurar TanStack Query em `lib/queryClient.ts`
- [ ] Criar `SemanaContext`
- [ ] Criar `constants/` — unidades, status, métodos de pagamento
- [ ] Criar `formatters/` — moeda, semana, unidade

**Componentes base:**
- [ ] Layout — Sidebar, BottomNav, Header, PageWrapper
- [ ] Shared — WeekPicker, IngredienteSelector, StatusBadge

**Módulos — por tela:**
- [ ] Home — cards de totais, grade de pratos, lista de clientes, accordion, checkbox produzido, dropdown pago
- [ ] Pedidos — lista com status, drawer novo pedido, modal cliente inline, empty state
- [ ] Cardápio — cards de prato, modal de adicionar com busca
- [ ] Receitas — lista com última vez no cardápio, criar/editar com IngredienteSelector
- [ ] Ingredientes — CRUD simples
- [ ] Clientes — lista, modal cliente com chips de grupo, modal grupos empilhado
- [ ] Tipos & Preços — CRUD com dual pricing Pix/Swile
- [ ] Compras & Custos — abas, IngredienteSelector, valor unitário calculado, custos inline, gás read-only, painel consolidado
- [ ] Financeiro — toggle modos, gráfico barras, pratos com drill-down, Pix vs Swile

---

## Fase 5 — Deploy

- [ ] Deploy do backend no Render
- [ ] Configurar variável `DATABASE_URL` no Render
- [ ] Configurar Uptime Robot (ping a cada 5 min)
- [ ] Deploy do frontend no Vercel
- [ ] Configurar variável `NEXT_PUBLIC_API_URL` no Vercel
- [ ] Testar fluxo completo em produção

---

## Fase 6 — Ajustes e polimento

- [ ] Testes de usabilidade com a dona
- [ ] Ajustes de UX baseados no feedback
- [ ] Preencher `docs/TESTING.md` e escrever testes
- [ ] Revisão geral de performance