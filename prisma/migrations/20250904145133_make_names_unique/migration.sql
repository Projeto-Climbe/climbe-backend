/*
  Warnings:

  - A unique constraint covering the columns `[nome_cargo]` on the table `cargos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `permissoes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cargos_nome_cargo_key` ON `cargos`(`nome_cargo`);

-- CreateIndex
CREATE UNIQUE INDEX `permissoes_descricao_key` ON `permissoes`(`descricao`);
