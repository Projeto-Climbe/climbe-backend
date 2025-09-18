import prisma from '../utils/prismaClient.js';

export const roleModel = {
  save: async (data) =>
    prisma.role.create({ data }),

  findMany: async () =>
    prisma.role.findMany(),

  findById: async (id) => 
    prisma.role.findUnique({ where: { id } }),

  update: async (id, name) => 
    prisma.role.update({
      where: { id },
      data: { name }  
    }),

  remove: async (id) =>
    prisma.role.delete({ where: { id } })
};
