import prisma from '../utils/prismaClient.js';

const create = async (data) => {
  return prisma.propostas.create({ data });
};

const findById = async (id) => {
  return prisma.propostas.findUnique({
    where: { id_proposta: id },
  });
};

const findAll = async () => {
  return prisma.propostas.findMany();
};

const update = async (id, data) => {
  return prisma.propostas.update({
    where: { id_proposta: id },
    data,
  });
};

const remove = async (id) => {
  return prisma.propostas.delete({
    where: { id_proposta: id },
  });
};

export default {
  create,
  findById,
  findAll,
  update,
  remove,
};