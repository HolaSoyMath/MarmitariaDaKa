-- CreateTable
CREATE TABLE "RecipePriceType" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "priceTypeId" TEXT NOT NULL,

    CONSTRAINT "RecipePriceType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipePriceType_recipeId_priceTypeId_key" ON "RecipePriceType"("recipeId", "priceTypeId");

-- AddForeignKey
ALTER TABLE "RecipePriceType" ADD CONSTRAINT "RecipePriceType_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePriceType" ADD CONSTRAINT "RecipePriceType_priceTypeId_fkey" FOREIGN KEY ("priceTypeId") REFERENCES "PriceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
