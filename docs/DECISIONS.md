# Decisions

Registro de decisões tomadas no projeto e o porquê. Evita reabrir discussões já resolvidas.

---

## Infraestrutura

**Render (backend) + Neon (banco) — por que separados?**
O Render tem PostgreSQL próprio no free tier, mas expira em 90 dias. O Neon oferece PostgreSQL permanente no free tier. Separar backend de banco garante que o banco não precise ser migrado após 90 dias.

**Por que não Railway?**
Descartado por confiabilidade e free tier pouco claro.

**Por que não Fly.io?**
Free plan descontinuado.

**Por que não Oracle Cloud?**
Free tier indisponível ao tentar criar conta.

**Uptime Robot pingando o Render a cada 5 min**
O Render coloca o serviço para dormir após inatividade no free tier. O ping evita o cold start para a usuária.

**Prisma com `@prisma/adapter-pg` e não `@prisma/adapter-neon`**
O adapter Neon serverless (HTTP/WebSocket) existe para ambientes edge/serverless sem conexão TCP persistente (ex: Vercel Edge Functions). O backend roda no Render como processo Bun de vida longa, então uma conexão TCP pooled via `pg` é mais rápida por query do que o driver HTTP do Neon. `DATABASE_URL` deve apontar para a connection string *pooled* do Neon (host com sufixo `-pooler`) para não esgotar o limite de conexões do free tier.

---

## Stack

**Por que Elysia no backend e não Hono ou Express?**
O desenvolvedor já conhece Elysia, tem Eden Treaty para tipagem end-to-end com o Next.js e WebSocket nativo para possível uso futuro.

**Por que Bun e não Node?**
Performance e compatibilidade com Elysia. Bun é o runtime recomendado pelo Elysia.

**Por que Prisma e não Drizzle?**
Familiaridade e maturidade do ecossistema. Drizzle pode ser avaliado em projetos futuros.

**Por que Turborepo?**
Monorepo com frontend, backend e shared — Turborepo gerencia builds e dependências entre os pacotes.

---

## Arquitetura

**Por que soft delete em tudo?**
Entidades com impacto financeiro (pedidos, compras, custos) não podem ser removidas fisicamente — quebrariam o histórico. Para consistência, todas as entidades seguem o mesmo padrão.

**Por que `ReceitaIngrediente` é exceção ao soft delete?**
Pedidos não referenciam `ReceitaIngrediente` diretamente — referenciam `CardapioItem` → `Receita`. A composição da receita não tem impacto financeiro. Delete físico + substituição da lista é mais simples e seguro.

**Por que snapshot de preço no `PedidoItem`?**
Preços mudam com o tempo. Um pedido registrado hoje com Marmita 550G a R$ 26,00 deve continuar mostrando R$ 26,00 mesmo que o preço seja alterado amanhã.

**Por que snapshot de `valorUnitario` no `CompraItem`?**
Mesmo motivo — o custo unitário de um ingrediente é um dado histórico, não deve ser recalculado.

**Por que gás é calculado como 5% dos ingredientes e não lançado manualmente?**
Decisão de negócio da dona: o gás é proporcional à quantidade cozinhada. 5% do custo de ingredientes foi o valor acordado como boa aproximação.

**Por que compra única por semana (e não múltiplas)?**
A dona faz as compras e vai adicionando itens conforme volta do mercado. Uma única `Compra` editável por semana é mais simples de gerenciar do que múltiplas compras com histórico separado.

---

## Produto

**Por que ações de marcar produzido/pago ficam só na Home?**
A Home é o painel de controle operacional da dona durante a semana. Centralizar as ações evita que ela precise navegar entre telas enquanto está produzindo.

**Por que Pix e Swile sempre exibidos lado a lado?**
A dona precisa saber os dois valores no momento de cobrar — o cliente pode pagar de qualquer forma. Esconder um dos valores geraria perguntas desnecessárias.

**Por que semana criada manualmente via week picker?**
Dá controle à dona sobre quando começa o ciclo. Criação automática poderia criar semanas desnecessárias se ela acessar o sistema fora de ciclo.

**Por que grupos de clientes sem seed automático?**
Cada marmitaria tem seus próprios grupos. Não assumir grupos padrão evita confusão e dá controle total à dona.

**Por que receita protegida de edição com pedidos ativos?**
Editar uma receita com pedidos em andamento poderia criar inconsistências — o cliente pediu uma coisa, a dona produziu outra.

**Por que `ReceitaIngrediente` não tem `updatedAt`?**
A lista de ingredientes é sempre substituída integralmente ao editar. Não há atualização parcial — não faz sentido rastrear atualização por linha.