import prisma from '../utils/prismaClient.js';

const add = async (data) => {
  return prisma.participantesReuniao.create({ data });
};

const addMany = async (items) => {
  if (!items || items.length === 0) {
    return { count: 0 };
  }

  const prepared = items.map((item) => ({
    id_reuniao: item.id_reuniao,
    id_usuario: item.id_usuario,
    id_empresa: item.id_empresa,
  }));

  return prisma.participantesReuniao.createMany({
    data: prepared,
    skipDuplicates: true,
  });
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
  addMany,
  findByReuniao,
  remove,
};
