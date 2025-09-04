import { update } from "../controller/roleController.js";
import prisma from "../utils/prismaClient.js";

export const userPermissionModel = {
    save: async (data) =>
        prisma.userPermission.create({ data }),

    findMany: async () =>
        prisma.userPermission.findMany(),

    findById: async (id) =>
        prisma.userPermission.findUnique({ where: { id } }),

    findUserPermissions: async (userId, permissionId) =>
        prisma.userPermission.findMany({ where: { userId: userId, permissionId: permissionId } }),

    update: async (id, userId, permissionId) =>
        prisma.userPermission.update({
            where: { id },
            data: { userId, permissionId }
        }),
};
