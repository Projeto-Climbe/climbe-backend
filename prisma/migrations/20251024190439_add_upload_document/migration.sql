/*
  Warnings:

  - You are about to alter the column `type` on the `Document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(1))`.

*/
-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_id_empresa_fkey`;

-- DropIndex
DROP INDEX `Document_id_empresa_fkey` ON `Document`;

-- AlterTable
ALTER TABLE `Document` MODIFY `type` ENUM('balanco', 'dre', 'gerenciais', 'cnpj', 'contrato_social') NOT NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresa`(`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;
