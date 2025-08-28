import prisma from '../utils/prismaClient.js';

export const userModel = {
  create: async (data) => 
    prisma.user.create({ data }),

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

  updateRole: async (userId, role_id) =>
    prisma.user.update({
    where: { id: userId },
    data: {
      role_id: role_id, 
    },
  }),

  findPending: async () => 
    prisma.user.findMany({
      where: { status: 'pending' },
      select: { id: true, fullName: true, email: true },
    }),
};
