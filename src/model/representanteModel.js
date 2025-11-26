import prisma from '../utils/prismaClient.js';

const create = async (data) => {
  return prisma.representante.create({ data });
};

const findById = async (id) => {
  return prisma.representante.findUnique({
    where: { id_representante: id },
  });
};

const findAll = async () => {
  return prisma.representante.findMany();
};

const findByCpf = async (cpf) => {
  return prisma.representante.findUnique({
    where: { cpf: cpf },
  });
};

const update = async (id, data) => {
  return prisma.representante.update({
    where: { id_representante: id },
    data,
  });
};

const remove = async (id) => {
  return prisma.representante.delete({
    where: { id_representante: id },
  });
};

export default {
  create,
  findById,
  findByCpf,
  findAll,
  update,
  remove,
};