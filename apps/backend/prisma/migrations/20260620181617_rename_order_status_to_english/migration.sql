-- Rename existing status values from Portuguese to English
UPDATE "Order" SET "status" = 'pending'  WHERE "status" = 'pendente';
UPDATE "Order" SET "status" = 'produced' WHERE "status" = 'produzido';
UPDATE "Order" SET "status" = 'paid'     WHERE "status" = 'pago';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'pending';
