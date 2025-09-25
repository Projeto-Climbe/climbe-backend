import prisma from '../utils/prismaClient.js';

const add = async (data) => {
  return prisma.participantesReuniao.create({ data });
};

const findByReuniao = async (reuniaoId) => {
  return prisma.participantesReuniao.findMany({
    where: { id_reuniao: reuniaoId },
    include: {
      usuarios: {
        select: { id: true, fullName: true, email: true }, 
      },
      reunioes: {
        select: { titulo: true, data: true },
      },
    },
  });
};

const remove = async (reuniaoId, usuarioId) => {
  return prisma.participantesReuniao.delete({
    where: {
      id_reuniao_id_usuario: { 
        id_reuniao: reuniaoId,
        id_usuario: usuarioId,
      },
    },
  });
};

export default {
  add,
  findByReuniao,
  remove,
};