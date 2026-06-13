-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingrediente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receita" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceitaIngrediente" (
    "id" TEXT NOT NULL,
    "receitaId" TEXT NOT NULL,
    "ingredienteId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ReceitaIngrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoPreco" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "valorPix" DOUBLE PRECISION NOT NULL,
    "valorSwile" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TipoPreco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semana" (
    "id" TEXT NOT NULL,
    "numeroSemana" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Semana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardapioItem" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "receitaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CardapioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "metodoPagamento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoItem" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "cardapioItemId" TEXT NOT NULL,
    "tipoPrecoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "snapshotValorPix" DOUBLE PRECISION NOT NULL,
    "snapshotValorSwile" DOUBLE PRECISION NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompraItem" (
    "id" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "ingredienteId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "local" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CompraItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustoGeral" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'fixo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CustoGeral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_nome_key" ON "Grupo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Ingrediente_nome_key" ON "Ingrediente"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Receita_nome_key" ON "Receita"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "ReceitaIngrediente_receitaId_ingredienteId_key" ON "ReceitaIngrediente"("receitaId", "ingredienteId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoPreco_tipo_tamanho_key" ON "TipoPreco"("tipo", "tamanho");

-- CreateIndex
CREATE UNIQUE INDEX "Semana_numeroSemana_ano_key" ON "Semana"("numeroSemana", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "CardapioItem_semanaId_receitaId_key" ON "CardapioItem"("semanaId", "receitaId");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_semanaId_key" ON "Compra"("semanaId");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceitaIngrediente" ADD CONSTRAINT "ReceitaIngrediente_receitaId_fkey" FOREIGN KEY ("receitaId") REFERENCES "Receita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceitaIngrediente" ADD CONSTRAINT "ReceitaIngrediente_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingrediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardapioItem" ADD CONSTRAINT "CardapioItem_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Semana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardapioItem" ADD CONSTRAINT "CardapioItem_receitaId_fkey" FOREIGN KEY ("receitaId") REFERENCES "Receita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Semana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_cardapioItemId_fkey" FOREIGN KEY ("cardapioItemId") REFERENCES "CardapioItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_tipoPrecoId_fkey" FOREIGN KEY ("tipoPrecoId") REFERENCES "TipoPreco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Semana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraItem" ADD CONSTRAINT "CompraItem_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraItem" ADD CONSTRAINT "CompraItem_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingrediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustoGeral" ADD CONSTRAINT "CustoGeral_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Semana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
