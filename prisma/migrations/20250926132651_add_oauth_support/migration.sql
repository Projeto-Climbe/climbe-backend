-- AlterTable
ALTER TABLE `User` ADD COLUMN `oauthProvider` VARCHAR(191) NULL,
    ADD COLUMN `oauthProviderId` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OAuthAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` VARCHAR(191) NOT NULL,
    `providerUserId` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `idToken` VARCHAR(191) NULL,
    `profilePicture` VARCHAR(191) NULL,
    `rawProfile` JSON NULL,
    `expiresAt` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OAuthAccount_provider_providerUserId_key`(`provider`, `providerUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OAuthAccount` ADD CONSTRAINT `OAuthAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
