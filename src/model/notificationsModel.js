import prisma from '../utils/prismaClient.js';

export const notificationsModel = {
  save: async (data) =>
    prisma.notifications.create({ data }),

  findMany: async () =>
    prisma.notifications.findMany(),

  findById: async (id) => 
    prisma.notifications.findUnique({ where: { id } }),

  update: async (id, userId, message) => 
    prisma.notifications.update({
        where: { id },
        data: { userId, message }
    }),

  delete: async (id) =>
    prisma.notifications.delete({ where: { id } })
};
