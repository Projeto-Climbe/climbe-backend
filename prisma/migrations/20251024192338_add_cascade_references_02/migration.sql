-- DropForeignKey
ALTER TABLE `reunioes` DROP FOREIGN KEY `reunioes_empresa_id_fkey`;

-- DropIndex
DROP INDEX `reunioes_empresa_id_fkey` ON `reunioes`;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;
