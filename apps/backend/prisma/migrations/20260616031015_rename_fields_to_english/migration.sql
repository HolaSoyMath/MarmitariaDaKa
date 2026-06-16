/*
  Warnings:

  - You are about to drop the column `grupoId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `GeneralCost` table. All the data in the column will be lost.
  - You are about to drop the column `semanaId` on the `GeneralCost` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `GeneralCost` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `GeneralCost` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `unidade` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `receitaId` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `semanaId` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `metodoPagamento` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `semanaId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cardapioItemId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `pedidoId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `snapshotValorPix` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `snapshotValorSwile` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `tipoPrecoId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `tamanho` on the `PriceType` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `PriceType` table. All the data in the column will be lost.
  - You are about to drop the column `valorPix` on the `PriceType` table. All the data in the column will be lost.
  - You are about to drop the column `valorSwile` on the `PriceType` table. All the data in the column will be lost.
  - You are about to drop the column `semanaId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `compraId` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `ingredienteId` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `local` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `valorUnitario` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `ingredienteId` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `receitaId` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `ano` on the `Week` table. All the data in the column will be lost.
  - You are about to drop the column `numeroSemana` on the `Week` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId,recipeId]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type,size]` on the table `PriceType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,ingredientId]` on the table `RecipeIngredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekNumber,year]` on the table `Week` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `GeneralCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `GeneralCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekId` to the `GeneralCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuItemId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceTypeId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotPixPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotSwilePrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pixPrice` to the `PriceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `PriceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swilePrice` to the `PriceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `PriceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseId` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekNumber` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Week` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_grupoId_fkey";

-- DropForeignKey
ALTER TABLE "GeneralCost" DROP CONSTRAINT "GeneralCost_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_receitaId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_cardapioItemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_tipoPrecoId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_semanaId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseItem" DROP CONSTRAINT "PurchaseItem_compraId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseItem" DROP CONSTRAINT "PurchaseItem_ingredienteId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_ingredienteId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_receitaId_fkey";

-- DropIndex
DROP INDEX "Group_nome_key";

-- DropIndex
DROP INDEX "Ingredient_nome_key";

-- DropIndex
DROP INDEX "MenuItem_semanaId_receitaId_key";

-- DropIndex
DROP INDEX "PriceType_tipo_tamanho_key";

-- DropIndex
DROP INDEX "Purchase_semanaId_key";

-- DropIndex
DROP INDEX "Recipe_nome_key";

-- DropIndex
DROP INDEX "RecipeIngredient_receitaId_ingredienteId_key";

-- DropIndex
DROP INDEX "Week_numeroSemana_ano_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "grupoId",
DROP COLUMN "nome",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeneralCost" DROP COLUMN "descricao",
DROP COLUMN "semanaId",
DROP COLUMN "tipo",
DROP COLUMN "valor",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'fixo',
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weekId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "nome",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "nome",
DROP COLUMN "unidade",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "receitaId",
DROP COLUMN "semanaId",
ADD COLUMN     "recipeId" TEXT NOT NULL,
ADD COLUMN     "weekId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "clienteId",
DROP COLUMN "metodoPagamento",
DROP COLUMN "semanaId",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "weekId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "cardapioItemId",
DROP COLUMN "pedidoId",
DROP COLUMN "quantidade",
DROP COLUMN "snapshotValorPix",
DROP COLUMN "snapshotValorSwile",
DROP COLUMN "tipoPrecoId",
ADD COLUMN     "menuItemId" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "priceTypeId" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "snapshotPixPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "snapshotSwilePrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "PriceType" DROP COLUMN "tamanho",
DROP COLUMN "tipo",
DROP COLUMN "valorPix",
DROP COLUMN "valorSwile",
ADD COLUMN     "pixPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "swilePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "semanaId",
ADD COLUMN     "weekId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseItem" DROP COLUMN "compraId",
DROP COLUMN "ingredienteId",
DROP COLUMN "local",
DROP COLUMN "quantidade",
DROP COLUMN "valorTotal",
DROP COLUMN "valorUnitario",
ADD COLUMN     "ingredientId" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "purchaseId" TEXT NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "nome",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "ingredienteId",
DROP COLUMN "quantidade",
DROP COLUMN "receitaId",
ADD COLUMN     "ingredientId" TEXT NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recipeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Week" DROP COLUMN "ano",
DROP COLUMN "numeroSemana",
ADD COLUMN     "weekNumber" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_weekId_recipeId_key" ON "MenuItem"("weekId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceType_type_size_key" ON "PriceType"("type", "size");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_weekId_key" ON "Purchase"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_ingredientId_key" ON "RecipeIngredient"("recipeId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "Week_weekNumber_year_key" ON "Week"("weekNumber", "year");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_priceTypeId_fkey" FOREIGN KEY ("priceTypeId") REFERENCES "PriceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralCost" ADD CONSTRAINT "GeneralCost_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
