import prisma from '../utils/prismaClient.js';

const create = async (data) => {
  return prisma.reunioes.create({ data });
};

const findById = async (id) => {
  return prisma.reunioes.findUnique({
    where: { id_reuniao: id },
  });
};

const findAll = async () => {
  return prisma.reunioes.findMany();
};

const update = async (id, data) => {
  return prisma.reunioes.update({
    where: { id_reuniao: id },
    data,
  });
};

const remove = async (id) => {
  return prisma.reunioes.delete({
    where: { id_reuniao: id },
  });
};

export default {
  create,
  findById,
  findAll,
  update,
  remove,
};