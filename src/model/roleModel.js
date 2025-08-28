import prisma from '../utils/prismaClient.js';

export const roleModel = {
  findById: (id) => 
    prisma.role.findUnique({ where: { id } })
};