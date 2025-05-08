/*
  Warnings:

  - You are about to drop the column `amount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Interaction` MODIFY `answer` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `amount`,
    DROP COLUMN `cnpj`,
    DROP COLUMN `companyName`,
    DROP COLUMN `invoiceNumber`;
