import planilhaModel from '../model/planilhaModel.js';

export const planilhaService = {
  async create(data) {
    return prisma.planilhaModel.create({ data });
  },

  async findAll() {
    return prisma.planilhaModel.findMany({
      include: { contrato: true },
    });
  },

  async findById(id) {
    const planilha = await prisma.planilhaModel.findUnique({
      where: { id },
      include: { contrato: true },
    });
    if (!planilha) throw new Error('Planilha não encontrada');
    return planilha;
  },

  async update(id, data) {
    return prisma.plaplanilhaModelnilha.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    return prisma.planilhaModel.delete({
      where: { id },
    });
  },
};
