import prisma from '../utils/prismaClient.js';

export const userModel = {
  save: async (data) => 
    prisma.user.create({ data }),

  findMany: async () =>
    prisma.user.findMany(),

  findByEmail: async (email) => 
    prisma.user.findUnique({ where: { email } }),

  findByCpf: async (cpf) => 
    prisma.user.findUnique({ where: { cpf } }),

  findById: async (id) => 
    prisma.user.findUnique({ where: { id } }),

  update: async (id, data) => 
    prisma.user.update({ where: { id }, data }),

  updateStatus: async (id, status) => 
    prisma.user.update({ where: { id }, data: { status } }),

  updateRole: async (userId, roleId) =>
    prisma.user.update({
    where: { id: userId },
    data: {
    roleId : roleId, 
    },
  }),

  findPending: async () => 
    prisma.user.findMany({
      where: { status: 'pending' },
      select: { id: true, fullName: true, email: true },
    }),

    delete: async (id) =>
      prisma.user.delete({
          where: {id}
      })
};
