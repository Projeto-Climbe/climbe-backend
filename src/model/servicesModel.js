import prisma from '../utils/prismaClient.js';

export const servicesModel = {
  save: async (data) =>
  prisma.service.create({
    data: {
      name: data.name
    }
  }),

  findMany: async () =>
    prisma.service.findMany(),

  findById: async (id) => 
    prisma.service.findUnique({ where: { id } }),

  findByName: async (name) => 
    prisma.service.findUnique({ where: { name } }),

  update: async (id, name) => 
    prisma.service.update({
      where: { id },
      data: { name }  
    }),

  remove: async (id) =>
    prisma.service.delete({ where: { id } })
};
