-- AlterTable: add nullable recipePriceTypeId column to backfill before making it required
ALTER TABLE "RecipeIngredient" ADD COLUMN "recipePriceTypeId" TEXT;

-- DropForeignKey / DropIndex: the old (recipeId, ingredientId) uniqueness no longer holds once
-- ingredients are duplicated across the recipe's sizes, so drop it before backfilling
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_recipeId_fkey";
DROP INDEX "RecipeIngredient_recipeId_ingredientId_key";

-- Backfill: duplicate each existing ingredient row into every size (RecipePriceType) already linked to that recipe
-- (recipeId is still populated here only because the column is NOT NULL until dropped below)
INSERT INTO "RecipeIngredient" ("id", "recipeId", "recipePriceTypeId", "ingredientId", "quantity")
SELECT gen_random_uuid()::text, rpt."recipeId", rpt."id", ri."ingredientId", ri."quantity"
FROM "RecipeIngredient" ri
JOIN "RecipePriceType" rpt ON rpt."recipeId" = ri."recipeId"
WHERE ri."recipePriceTypeId" IS NULL;

-- Remove the old rows that were tied directly to the recipe (pre-migration shape)
DELETE FROM "RecipeIngredient" WHERE "recipePriceTypeId" IS NULL;

-- AlterTable: drop recipeId, make recipePriceTypeId required
ALTER TABLE "RecipeIngredient" DROP COLUMN "recipeId";
ALTER TABLE "RecipeIngredient" ALTER COLUMN "recipePriceTypeId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipePriceTypeId_ingredientId_key" ON "RecipeIngredient"("recipePriceTypeId", "ingredientId");

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipePriceTypeId_fkey" FOREIGN KEY ("recipePriceTypeId") REFERENCES "RecipePriceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
