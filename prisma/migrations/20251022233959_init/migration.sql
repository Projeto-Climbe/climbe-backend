-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PasswordResetToken_userId_key`(`userId`),
    UNIQUE INDEX `PasswordResetToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profilePicture` VARCHAR(191) NULL,
    `oauthProvider` VARCHAR(191) NULL,
    `oauthProviderId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OAuthAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` VARCHAR(191) NOT NULL,
    `providerUserId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NOT NULL,
    `refreshToken` TEXT NULL,
    `scope` TEXT NULL,
    `idToken` TEXT NULL,
    `profilePicture` VARCHAR(191) NULL,
    `rawProfile` JSON NULL,
    `expiresAt` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OAuthAccount_provider_providerUserId_key`(`provider`, `providerUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permission_description_key`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,

    UNIQUE INDEX `UserPermission_userId_permissionId_key`(`userId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `id_empresa` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_fantasia` VARCHAR(255) NOT NULL,
    `razao_social` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `inscricao_estadual` VARCHAR(50) NULL,
    `endereco` VARCHAR(255) NULL,
    `cidade` VARCHAR(255) NULL,
    `estado` VARCHAR(100) NULL,
    `cep` VARCHAR(30) NULL,
    `telefone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,

    UNIQUE INDEX `cnpj`(`cnpj`),
    PRIMARY KEY (`id_empresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `representantes` (
    `id_representante` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_legal` VARCHAR(255) NULL,
    `cpf` VARCHAR(14) NULL,
    `rg` VARCHAR(20) NULL,
    `endereco` VARCHAR(255) NULL,
    `cidade` VARCHAR(255) NULL,
    `estado` VARCHAR(100) NULL,
    `empresa_id` INTEGER NOT NULL,

    UNIQUE INDEX `representantes_cpf_key`(`cpf`),
    UNIQUE INDEX `representantes_empresa_id_key`(`empresa_id`),
    PRIMARY KEY (`id_representante`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contratos` (
    `id_contrato` INTEGER NOT NULL AUTO_INCREMENT,
    `id_proposta` INTEGER NOT NULL,
    `data_inicio` DATE NULL,
    `data_fim` DATE NULL,
    `status` VARCHAR(191) NULL,

    PRIMARY KEY (`id_contrato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorios` (
    `id_relatorio` INTEGER NOT NULL AUTO_INCREMENT,
    `contrato_id` INTEGER NOT NULL,
    `url_pdf` VARCHAR(191) NOT NULL,
    `data_envio` DATE NULL,

    PRIMARY KEY (`id_relatorio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propostas` (
    `id_proposta` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NULL,
    `status` VARCHAR(50) NULL,
    `data_criacao` DATE NULL,

    PRIMARY KEY (`id_proposta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `message` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reunioes` (
    `id_reuniao` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NULL,
    `empresa_id` INTEGER NOT NULL,
    `data` DATE NULL,
    `hora` VARCHAR(191) NULL,
    `horaFim` VARCHAR(191) NULL,
    `durationMinutes` INTEGER NULL,
    `presencial` BOOLEAN NULL,
    `local` VARCHAR(255) NULL,
    `roomId` INTEGER NULL,
    `contratoId` INTEGER NULL,
    `pauta` TEXT NULL,
    `status` VARCHAR(191) NULL,

    PRIMARY KEY (`id_reuniao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NULL,
    `capacity` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participantes_reuniao` (
    `id_reuniao` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_empresa` INTEGER NOT NULL,

    PRIMARY KEY (`id_reuniao`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Planilha` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_contrato` INTEGER NOT NULL,
    `url_google_sheets` VARCHAR(255) NULL,
    `blocked` BOOLEAN NOT NULL,
    `view_permission` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_empresa` INTEGER NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `validated` BOOLEAN NOT NULL DEFAULT false,
    `analystId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_empresa` INTEGER NOT NULL,
    `id_service` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OAuthAccount` ADD CONSTRAINT `OAuthAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `representantes` ADD CONSTRAINT `representantes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contratos` ADD CONSTRAINT `contratos_id_proposta_fkey` FOREIGN KEY (`id_proposta`) REFERENCES `propostas`(`id_proposta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relatorios` ADD CONSTRAINT `relatorios_contrato_id_fkey` FOREIGN KEY (`contrato_id`) REFERENCES `contratos`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `meeting_rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`id_contrato`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_reuniao_fkey` FOREIGN KEY (`id_reuniao`) REFERENCES `reunioes`(`id_reuniao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresa`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Planilha` ADD CONSTRAINT `Planilha_id_contrato_fkey` FOREIGN KEY (`id_contrato`) REFERENCES `contratos`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresa`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_analystId_fkey` FOREIGN KEY (`analystId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyService` ADD CONSTRAINT `CompanyService_id_empresa_fkey` FOREIGN KEY (`id_empresa`) REFERENCES `Empresa`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyService` ADD CONSTRAINT `CompanyService_id_service_fkey` FOREIGN KEY (`id_service`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
