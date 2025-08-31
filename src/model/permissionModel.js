import prisma from "../utils/prismaClient.js";

export const permissionModel = {
    save: async (data) =>
    prisma.permission.create({ data }),

    findMany: async () =>
    prisma.permission.findMany(),

    findById: async (id) => 
    prisma.permission.findUnique({ where: { id } }),

    update: async (id, description) =>
        prisma.permission.update({
            where: { id },
            data: { description }
        }),
  
};
