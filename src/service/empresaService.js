import prisma from '../utils/prismaClient.js';

/**
 * Cria uma nova empresa no banco de dados.
 * Verifica se o CNPJ já existe antes de criar[cite: 176].
 * @param {object} empresaData - Os dados da empresa a ser criada.
 * @returns {Promise<object>} A empresa criada.
 * @throws {Error} Se o CNPJ já estiver em uso.
 */
const createEmpresa = async (empresaData) => {
  const { cnpj } = empresaData;

  const existingEmpresa = await prisma.empresa.findUnique({
    where: { cnpj },
  });

  if (existingEmpresa) {
    throw new Error('O CNPJ informado já está cadastrado.');
  }

  return prisma.empresa.create({
    data: empresaData,
  });
};

/**
 * Retorna todas as empresas cadastradas.
 * @returns {Promise<Array<object>>} Uma lista de empresas.
 */
const getAllEmpresas = async () => {
  return prisma.empresa.findMany();
};

/**
 * Busca uma empresa pelo seu ID.
 * @param {number} id - O ID da empresa.
 * @returns {Promise<object|null>} A empresa encontrada ou null.
 */
const getEmpresaById = async (id) => {
  return prisma.empresa.findUnique({
    where: { id_empresa: id },
  });
};

/**
 * Atualiza os dados de uma empresa existente.
 * @param {number} id - O ID da empresa a ser atualizada.
 * @param {object} empresaData - Os novos dados da empresa.
 * @returns {Promise<object>} A empresa atualizada.
 */
const updateEmpresa = async (id, empresaData) => {
  // Opcional: Adicionar verificação de CNPJ duplicado se o CNPJ for alterado.
  return prisma.empresa.update({
    where: { id_empresa: id },
    data: empresaData,
  });
};

/**
 * Deleta uma empresa pelo seu ID.
 * @param {number} id - O ID da empresa a ser deletada.
 * @returns {Promise<object>} A empresa que foi deletada.
 */
const deleteEmpresa = async (id) => {
  return prisma.empresas.delete({
    where: { id_empresa: id },
  });
};

export default {
  createEmpresa,
  getAllEmpresas,
  getEmpresaById,
  updateEmpresa,
  deleteEmpresa,
};