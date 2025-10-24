-- DropForeignKey
ALTER TABLE `participantes_reuniao` DROP FOREIGN KEY `participantes_reuniao_id_reuniao_fkey`;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_reuniao_fkey` FOREIGN KEY (`id_reuniao`) REFERENCES `reunioes`(`id_reuniao`) ON DELETE CASCADE ON UPDATE CASCADE;
