-- DropForeignKey
ALTER TABLE `contratos` DROP FOREIGN KEY `contratos_id_proposta_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_userId_fkey`;

-- DropForeignKey
ALTER TABLE `propostas` DROP FOREIGN KEY `propostas_empresa_id_fkey`;

-- DropIndex
DROP INDEX `contratos_id_proposta_fkey` ON `contratos`;

-- DropIndex
DROP INDEX `notifications_userId_fkey` ON `notifications`;

-- DropIndex
DROP INDEX `propostas_empresa_id_fkey` ON `propostas`;

-- AddForeignKey
ALTER TABLE `contratos` ADD CONSTRAINT `contratos_id_proposta_fkey` FOREIGN KEY (`id_proposta`) REFERENCES `propostas`(`id_proposta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
