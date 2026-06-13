/*
  Warnings:

  - You are about to drop the `CardapioItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Compra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompraItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustoGeral` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grupo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingrediente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PedidoItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Receita` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceitaIngrediente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Semana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoPreco` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardapioItem" DROP CONSTRAINT "CardapioItem_receitaId_fkey";

-- DropForeignKey
ALTER TABLE "CardapioItem" DROP CONSTRAINT "CardapioItem_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_grupoId_fkey";

-- DropForeignKey
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "CompraItem" DROP CONSTRAINT "CompraItem_compraId_fkey";

-- DropForeignKey
ALTER TABLE "CompraItem" DROP CONSTRAINT "CompraItem_ingredienteId_fkey";

-- DropForeignKey
ALTER TABLE "CustoGeral" DROP CONSTRAINT "CustoGeral_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoItem" DROP CONSTRAINT "PedidoItem_cardapioItemId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoItem" DROP CONSTRAINT "PedidoItem_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoItem" DROP CONSTRAINT "PedidoItem_tipoPrecoId_fkey";

-- DropForeignKey
ALTER TABLE "ReceitaIngrediente" DROP CONSTRAINT "ReceitaIngrediente_ingredienteId_fkey";

-- DropForeignKey
ALTER TABLE "ReceitaIngrediente" DROP CONSTRAINT "ReceitaIngrediente_receitaId_fkey";

-- DropTable
DROP TABLE "CardapioItem";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Compra";

-- DropTable
DROP TABLE "CompraItem";

-- DropTable
DROP TABLE "CustoGeral";

-- DropTable
DROP TABLE "Grupo";

-- DropTable
DROP TABLE "Ingrediente";

-- DropTable
DROP TABLE "Pedido";

-- DropTable
DROP TABLE "PedidoItem";

-- DropTable
DROP TABLE "Receita";

-- DropTable
DROP TABLE "ReceitaIngrediente";

-- DropTable
DROP TABLE "Semana";

-- DropTable
DROP TABLE "TipoPreco";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "receitaId" TEXT NOT NULL,
    "ingredienteId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceType" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "valorPix" DOUBLE PRECISION NOT NULL,
    "valorSwile" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PriceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "numeroSemana" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "receitaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "metodoPagamento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "cardapioItemId" TEXT NOT NULL,
    "tipoPrecoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "snapshotValorPix" DOUBLE PRECISION NOT NULL,
    "snapshotValorSwile" DOUBLE PRECISION NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseItem" (
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

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralCost" (
    "id" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'fixo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GeneralCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_nome_key" ON "Group"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_nome_key" ON "Ingredient"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_nome_key" ON "Recipe"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_receitaId_ingredienteId_key" ON "RecipeIngredient"("receitaId", "ingredienteId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceType_tipo_tamanho_key" ON "PriceType"("tipo", "tamanho");

-- CreateIndex
CREATE UNIQUE INDEX "Week_numeroSemana_ano_key" ON "Week"("numeroSemana", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_semanaId_receitaId_key" ON "MenuItem"("semanaId", "receitaId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_semanaId_key" ON "Purchase"("semanaId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_receitaId_fkey" FOREIGN KEY ("receitaId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_receitaId_fkey" FOREIGN KEY ("receitaId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_cardapioItemId_fkey" FOREIGN KEY ("cardapioItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_tipoPrecoId_fkey" FOREIGN KEY ("tipoPrecoId") REFERENCES "PriceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralCost" ADD CONSTRAINT "GeneralCost_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
