import prisma from '../utils/prismaClient.js';

export const companyServiceModel = {
  save: async (data) =>
    prisma.companyService.create({ data }),

  findMany: async () =>
    prisma.companyService.findMany(),

  findById: async (id) => 
    prisma.companyService.findUnique({ where: { id } }),

  update: async (id, data) => 
    prisma.companyService.update({
        where: { id },
        data
    }),

  delete: async (id) =>
    prisma.companyService.delete({ where: { id } })
};
