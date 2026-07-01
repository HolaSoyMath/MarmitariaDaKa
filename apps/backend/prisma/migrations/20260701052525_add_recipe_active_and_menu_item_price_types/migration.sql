-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "MenuItemPriceType" (
    "id" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "priceTypeId" TEXT NOT NULL,

    CONSTRAINT "MenuItemPriceType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemPriceType_menuItemId_priceTypeId_key" ON "MenuItemPriceType"("menuItemId", "priceTypeId");

-- AddForeignKey
ALTER TABLE "MenuItemPriceType" ADD CONSTRAINT "MenuItemPriceType_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemPriceType" ADD CONSTRAINT "MenuItemPriceType_priceTypeId_fkey" FOREIGN KEY ("priceTypeId") REFERENCES "PriceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
