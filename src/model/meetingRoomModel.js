import prisma from '../utils/prismaClient.js';

export const meetingRoomModel = {
  create: async (data) =>
    prisma.meetingRoom.create({ data }),

  findMany: async () =>
    prisma.meetingRoom.findMany(),

  findById: async (id) =>
    prisma.meetingRoom.findUnique({ where: { id } }),
};
