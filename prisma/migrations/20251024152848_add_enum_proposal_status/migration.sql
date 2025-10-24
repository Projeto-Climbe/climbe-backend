/*
  Warnings:

  - You are about to alter the column `status` on the `propostas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `propostas` MODIFY `status` ENUM('pendente', 'aceita', 'rejeitada', 'cancelada', 'em_analise') NULL DEFAULT 'pendente';
