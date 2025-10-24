-- DropForeignKey
ALTER TABLE `CompanyService` DROP FOREIGN KEY `CompanyService_id_empresa_fkey`;

-- DropForeignKey
ALTER TABLE `Planilha` DROP FOREIGN KEY `Planilha_id_contrato_fkey`;

-- DropForeignKey
ALTER TABLE `participantes_reuniao` DROP FOREIGN KEY `participantes_reuniao_id_empresa_fkey`;

-- DropForeignKey
ALTER TABLE `participantes_reuniao` DROP FOREIGN KEY `participantes_reuniao_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `representantes` DROP FOREIGN KEY `representantes_empresa_id_fkey`;

-- DropIndex
DROP INDEX `CompanyService_id_empresa_fkey` ON `CompanyService`;

-- DropIndex
DROP INDEX `Planilha_id_contrato_fkey` ON `Planilha`;

-- DropIndex
DROP INDEX `participantes_reuniao_id_empresa_fkey` ON `participantes_reuniao`;

-- DropIndex
DROP INDEX `participantes_reuniao_id_usuario_fkey` ON `participantes_reuniao`;

-- AddForeignKey
ALTER TABLE `representantes` ADD CONSTRAINT `representantes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresa`(`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Planilha` ADD CONSTRAINT `Planilha_id_contrato_fkey` FOREIGN KEY (`id_contrato`) REFERENCES `contratos`(`id_contrato`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyService` ADD CONSTRAINT `CompanyService_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresa`(`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE;
