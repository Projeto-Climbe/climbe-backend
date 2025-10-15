import prisma from '../utils/prismaClient.js';

export const planilhaModel = {
  save: async (data) =>
    prisma.planilha.create({ data }),

  findMany: async () =>
    prisma.planilha.findMany(),

  findById: async (id) =>
    prisma.planilha.findUnique({ where: { id } }),

  update: async (id, data) =>
    prisma.planilha.update({ where: { id }, data }),

  delete: async (id) =>
    prisma.planilha.delete({ where: { id } }),
};
