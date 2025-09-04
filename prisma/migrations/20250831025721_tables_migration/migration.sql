/*
  Warnings:

  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `permission_id` on the `UserPermission` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserPermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,permissionId]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permissionId` to the `UserPermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserPermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserPermission` DROP FOREIGN KEY `UserPermission_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserPermission` DROP FOREIGN KEY `UserPermission_user_id_fkey`;

-- DropIndex
DROP INDEX `User_role_id_fkey` ON `User`;

-- DropIndex
DROP INDEX `UserPermission_permission_id_fkey` ON `UserPermission`;

-- DropIndex
DROP INDEX `UserPermission_user_id_permission_id_key` ON `UserPermission`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role_id`,
    ADD COLUMN `roleId` INTEGER NULL;

-- AlterTable
ALTER TABLE `UserPermission` DROP COLUMN `permission_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `permissionId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserPermission_userId_permissionId_key` ON `UserPermission`(`userId`, `permissionId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
