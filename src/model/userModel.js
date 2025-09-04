import prisma from '../utils/prismaClient.js'

export const userModel = {
  create: (data) => 
    prisma.usuarios.create({ data }),

  findByEmail: (email) => 
    prisma.usuarios.findUnique({ where: { email } }),

  findById: (id) => 
    prisma.usuarios.findUnique({ where: { id } }),

  updateStatus: (id, status) => 
    prisma.usuarios.update({ where: { id }, data: { status } }),

  findPending: () => 
    prisma.usuarios.findMany({ where: { status: 'pending' },
         select: { id: true, fullName: true, email: true } }),
}
