import prisma from '../utils/prismaClient.js';

const create = async (data) => {
  return prisma.contratos.create({ data });
};

const findById = async (id) => {
  return prisma.contratos.findUnique({
    where: { id_contrato: id },
  });
};

const findByPropostaId = async (propostaId) => {
  return prisma.contratos.findUnique({
    where: { id_proposta: propostaId },
  });
};

const findAll = async () => {
  return prisma.contratos.findMany();
};

const update = async (id, data) => {
  return prisma.contratos.update({
    where: { id_contrato: id },
    data,
  });
};

const remove = async (id) => {
  return prisma.contratos.delete({
    where: { id_contrato: id },
  });
};

export default {
  create,
  findById,
  findByPropostaId,
  findAll,
  update,
  remove,
};