/*
  Warnings:

  - Made the column `displayName` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Invoice` MODIFY `displayName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `password` VARCHAR(191) NOT NULL;
