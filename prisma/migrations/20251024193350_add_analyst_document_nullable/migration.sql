-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_analystId_fkey`;

-- DropIndex
DROP INDEX `Document_analystId_fkey` ON `Document`;

-- AlterTable
ALTER TABLE `Document` MODIFY `analystId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_analystId_fkey` FOREIGN KEY (`analystId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
