import prisma from '../utils/prismaClient.js';

export const documentModel = {
  save: async (data) =>
    prisma.document.create({ data }),

  findMany: async () =>
    prisma.document.findMany(),

  findById: async (id) => 
    prisma.document.findUnique({ where: { id } }),

  update: async (id, data) => 
    prisma.document.update({
        where: { id },
        data
    }),

  delete: async (id) =>
    prisma.document.delete({ where: { id } })
};
