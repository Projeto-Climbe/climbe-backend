import prisma from '../utils/prismaClient.js'

export const userModel = {
  create: (data) => 
    prisma.user.create({ data }),

  findByEmail: (email) => 
    prisma.user.findUnique({ where: { email } }),

  findByCpf: (cpf) => 
    prisma.user.findUnique({ where: { cpf } }),

  findById: (id) => 
    prisma.user.findUnique({ where: { id } }),

  updateStatus: (id, status) => 
    prisma.user.update({ where: { id }, data: { status } }),

  findPending: () => 
    prisma.user.findMany({ where: { status: 'pending' },
         select: { id: true, fullName: true, email: true } }),
}
