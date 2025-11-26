import prisma from '../utils/prismaClient.js';

const create = async (data) => {
  return prisma.relatorios.create({ data });
};

const findById = async (id) => {
  return prisma.relatorios.findUnique({
    where: { id_relatorio: id },
  });
};

const findByContratoId = async (contratoId) => {
  return prisma.relatorios.findMany({
    where: { contrato_id: contratoId },
  });
};

const findAll = async () => {
  return prisma.relatorios.findMany();
};

const update = async (id, data) => {
  return prisma.relatorios.update({
    where: { id_relatorio: id },
    data,
  });
}

const remove = async (id) => {
  return prisma.relatorios.delete({
    where: { id_relatorio: id },
  });
};

export default {
  create,
  findById,
  findByContratoId,
  findAll,
  update,
  remove,
};