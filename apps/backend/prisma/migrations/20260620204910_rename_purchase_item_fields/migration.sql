/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `PurchaseItem` table. All the data in the column will be lost.
  - Added the required column `totalValue` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitValue` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseItem" DROP COLUMN "totalPrice",
DROP COLUMN "unitPrice",
ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitValue" DOUBLE PRECISION NOT NULL;
