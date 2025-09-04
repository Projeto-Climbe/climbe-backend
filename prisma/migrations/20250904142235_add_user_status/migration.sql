-- CreateTable
CREATE TABLE `cargos` (
    `id_cargo` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_cargo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_cargo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contratos` (
    `id_contrato` INTEGER NOT NULL AUTO_INCREMENT,
    `id_proposta` INTEGER NULL,
    `descricao` TEXT NULL,
    `valor` DECIMAL(15, 2) NULL,
    `data_inicio` DATE NULL,
    `data_fim` DATE NULL,
    `status` VARCHAR(100) NULL,

    INDEX `id_proposta`(`id_proposta`),
    PRIMARY KEY (`id_contrato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos` (
    `id_documento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_empresa` INTEGER NULL,
    `tipo_documento` VARCHAR(255) NULL,
    `url_documento` VARCHAR(255) NULL,
    `validade` DATE NULL,

    INDEX `id_empresa`(`id_empresa`),
    PRIMARY KEY (`id_documento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id_empresa` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_fantasia` VARCHAR(255) NOT NULL,
    `razao_social` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `inscricao_estadual` VARCHAR(50) NULL,
    `endereco` VARCHAR(255) NULL,
    `cidade` VARCHAR(255) NULL,
    `estado` VARCHAR(100) NULL,
    `telefone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `representante_legal` VARCHAR(255) NULL,
    `representante_cpf` VARCHAR(14) NULL,
    `representante_rg` VARCHAR(20) NULL,
    `representante_endereco` VARCHAR(255) NULL,
    `representante_cidade` VARCHAR(255) NULL,
    `representante_estado` VARCHAR(100) NULL,

    UNIQUE INDEX `cnpj`(`cnpj`),
    PRIMARY KEY (`id_empresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas_servicos` (
    `id_empresa` INTEGER NOT NULL,
    `id_servico` INTEGER NOT NULL,

    PRIMARY KEY (`id_empresa`, `id_servico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacoes` (
    `id_notificacao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `mensagem` TEXT NULL,
    `data_envio` DATETIME(0) NULL,
    `lida` BOOLEAN NULL DEFAULT false,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_notificacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participantes_reuniao` (
    `id_reuniao` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_reuniao`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissoes` (
    `id_permissao` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_permissao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planilhas` (
    `id_planilha` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NULL,
    `url_arquivo` VARCHAR(255) NULL,
    `id_usuario` INTEGER NULL,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_planilha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propostas` (
    `id_proposta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `id_empresa` INTEGER NULL,
    `descricao` TEXT NULL,
    `valor` DECIMAL(15, 2) NULL,
    `data_criacao` DATE NULL,

    INDEX `id_empresa`(`id_empresa`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_proposta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorios` (
    `id_relatorio` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NULL,
    `url_arquivo` VARCHAR(255) NULL,
    `data_emissao` DATE NULL,
    `id_usuario` INTEGER NULL,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_relatorio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reunioes` (
    `id_reuniao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `id_empresa` INTEGER NULL,
    `data` DATE NULL,
    `hora` TIME(0) NULL,
    `local` VARCHAR(255) NULL,
    `pauta` TEXT NULL,
    `ata` TEXT NULL,

    INDEX `id_empresa`(`id_empresa`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_reuniao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicos` (
    `id_servico` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_servico` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_servico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_permissoes` (
    `id_usuario` INTEGER NOT NULL,
    `id_permissao` INTEGER NOT NULL,

    PRIMARY KEY (`id_usuario`, `id_permissao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `status` VARCHAR(100) NULL DEFAULT 'pending',
    `telefone` VARCHAR(20) NULL,
    `endereco` VARCHAR(255) NULL,
    `cidade` VARCHAR(255) NULL,
    `estado` VARCHAR(100) NULL,
    `id_cargo` INTEGER NULL,

    UNIQUE INDEX `cpf`(`cpf`),
    UNIQUE INDEX `email`(`email`),
    INDEX `id_cargo`(`id_cargo`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contratos` ADD CONSTRAINT `contratos_ibfk_1` FOREIGN KEY (`id_proposta`) REFERENCES `propostas`(`id_proposta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id_empresa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `empresas_servicos` ADD CONSTRAINT `empresas_servicos_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id_empresa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_ibfk_1` FOREIGN KEY (`id_reuniao`) REFERENCES `reunioes`(`id_reuniao`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `participantes_reuniao` ADD CONSTRAINT `participantes_reuniao_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `planilhas` ADD CONSTRAINT `planilhas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id_empresa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `relatorios` ADD CONSTRAINT `relatorios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reunioes` ADD CONSTRAINT `reunioes_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id_empresa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuario_permissoes` ADD CONSTRAINT `usuario_permissoes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_cargo`) REFERENCES `cargos`(`id_cargo`) ON DELETE NO ACTION ON UPDATE NO ACTION;
