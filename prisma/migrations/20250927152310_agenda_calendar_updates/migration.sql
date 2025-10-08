-- AlterTable
ALTER TABLE `propostas` ADD COLUMN `usuario_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `reunioes` ADD COLUMN `contratoId` INTEGER NULL,
    ADD COLUMN `durationMinutes` INTEGER NULL,
    ADD COLUMN `horaFim` VARCHAR(191) NULL,
    ADD COLUMN `roomId` INTEGER NULL;

-- CreateTable
CREATE TABLE `meeting_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NULL,
    `capacity` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `meeting_rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`id_contrato`) ON DELETE SET NULL ON UPDATE CASCADE;
