-- AlterTable: converte valores monetários de Float para Int (centavos), preservando dados existentes
ALTER TABLE "GeneralCost"
  ALTER COLUMN "value" TYPE INTEGER USING ROUND("value" * 100)::INTEGER;

ALTER TABLE "OrderItem"
  ALTER COLUMN "snapshotPixPrice" TYPE INTEGER USING ROUND("snapshotPixPrice" * 100)::INTEGER,
  ALTER COLUMN "snapshotSwilePrice" TYPE INTEGER USING ROUND("snapshotSwilePrice" * 100)::INTEGER;

ALTER TABLE "PriceType"
  ALTER COLUMN "pixPrice" TYPE INTEGER USING ROUND("pixPrice" * 100)::INTEGER,
  ALTER COLUMN "swilePrice" TYPE INTEGER USING ROUND("swilePrice" * 100)::INTEGER;

ALTER TABLE "PurchaseItem"
  ALTER COLUMN "totalValue" TYPE INTEGER USING ROUND("totalValue" * 100)::INTEGER,
  ALTER COLUMN "unitValue" TYPE INTEGER USING ROUND("unitValue" * 100)::INTEGER;

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "gasPercentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
