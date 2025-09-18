import prisma from '../utils/prismaClient.js';

export const servicesModel = {
  save: async (data) =>
    prisma.services.create({ data }),

  findMany: async () =>
    prisma.services.findMany(),

  findById: async (id) => 
    prisma.services.findUnique({ where: { id } }),

  findByName: async (name) => 
    prisma.services.findUnique({ where: { name } }),

  update: async (id, name) => 
    prisma.services.update({
      where: { id },
      data: { name }  
    }),

  remove: async (id) =>
    prisma.services.delete({ where: { id } })
};
